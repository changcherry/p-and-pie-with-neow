"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AppShell } from "@/components/app-shell";
import { ShieldIcon } from "@/components/icons";
import { scenarios } from "@/lib/demo-data";
import { completeScenario } from "@/lib/cat-progress";
import { skillDimensions, type SkillScores } from "@/lib/training-score";

type Session = { scenarioSlug: string; title: string; conversationType: "scam" | "legitimate"; opening: string; choices: string[] };
type Turn = { speaker: "caller" | "user"; text: string };
type Signal = { name: string; evidence: string };
type Analysis = {
  scenarioRiskLevel: "high" | "medium" | "low" | "insufficient_information";
  answerRiskLevel: "high" | "medium" | "low" | "insufficient_information";
  scenarioSignals: Signal[];
  answerSignals: Signal[];
  summary: string;
  responseFeedback: string;
  suggestedActions: string[];
  uncertainty: string;
  dimensionScores: SkillScores;
  totalScore: number;
};

type ErrorStage = "start" | "reply" | "analysis";

async function readPayload(response: Response) {
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "暫時無法完成 AI 處理。");
  return payload;
}

function Training() {
  const params = useSearchParams();
  const router = useRouter();
  const scenario = scenarios.find((item) => item.slug === params.get("scenario")) ?? scenarios[0];
  const started = useRef<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [conversationTurns, setConversationTurns] = useState<Turn[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [phase, setPhase] = useState<"loading" | "choosing" | "replying" | "analyzing" | "complete" | "error">("loading");
  const [error, setError] = useState("");
  const [errorStage, setErrorStage] = useState<ErrorStage>("start");
  const [rewardIds, setRewardIds] = useState<string[]>([]);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speakingText, setSpeakingText] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setSpeechSupported("speechSynthesis" in window && "SpeechSynthesisUtterance" in window), 0);
    return () => {
      window.clearTimeout(timer);
      window.speechSynthesis?.cancel();
    };
  }, []);

  function stopSpeech() {
    window.speechSynthesis?.cancel();
    setSpeakingText("");
  }

  function toggleSpeech(text: string) {
    if (!speechSupported) return;
    if (speakingText === text) {
      stopSpeech();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-TW";
    utterance.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => voice.lang.toLowerCase() === "zh-tw") ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("zh")) ?? null;
    utterance.onend = () => setSpeakingText("");
    utterance.onerror = () => setSpeakingText("");
    setSpeakingText(text);
    window.speechSynthesis.speak(utterance);
  }

  async function startSession() {
    setPhase("loading");
    setError("");
    setSession(null);
    setSelectedChoice("");
    setConversationTurns([]);
    setAnalysis(null);
    localStorage.removeItem("goodshield-ai-analysis");
    try {
      const response = await fetch("/api/training-session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", scenarioSlug: scenario.slug }),
      });
      const payload = await readPayload(response);
      setSession(payload.session as Session);
      setConversationTurns([{ speaker: "caller", text: (payload.session as Session).opening }]);
      setSelectedChoice("");
      setAnalysis(null);
      setPhase("choosing");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "無法產生新情境。");
      setErrorStage("start");
      setPhase("error");
    }
  }

  useEffect(() => {
    if (started.current === scenario.slug) return;
    started.current = scenario.slug;
    void startSession();
  // Only start a session when entering a scenario; retries are user-triggered.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.slug]);

  async function evaluate(turns: Turn[], selected: string, earnedRewards: string[] = rewardIds) {
    if (!session) return;
    setPhase("analyzing");
    setError("");
    try {
      const response = await fetch("/api/risk-assessment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioTitle: scenario.title, selectedChoice: selected, turns }),
      });
      const payload = await readPayload(response);
      const result = payload.analysis as Analysis;
      setAnalysis(result);
      setPhase("complete");
      const safe = result.answerRiskLevel === "low";
      const badge = result.totalScore >= 80 ? "善盾判斷佳" : result.totalScore >= 60 ? "持續練習" : "再次練習";
      localStorage.setItem("goodshield-ai-analysis", JSON.stringify({ status: "complete", analysis: result }));
      localStorage.setItem("goodshield-result", JSON.stringify({
        title: scenario.title,
        safe,
        decisionLabel: selected,
        feedback: result.responseFeedback,
        warnings: result.scenarioSignals.map((signal) => signal.name),
        marked: result.scenarioSignals.map((signal) => signal.name),
        calm: result.dimensionScores.calmJudgment,
        totalScore: result.totalScore,
        scores: result.dimensionScores,
        warningRecall: 0,
        badge,
        scenarioRiskLevel: result.scenarioRiskLevel,
        answerRiskLevel: result.answerRiskLevel,
        scenarioSignals: result.scenarioSignals,
        answerSignals: result.answerSignals,
        turns,
        catRewards: earnedRewards,
      }));
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "無法分析這段對話。";
      setError(message);
      setErrorStage("analysis");
      setPhase("error");
      localStorage.setItem("goodshield-ai-analysis", JSON.stringify({ status: "error", error: message }));
    }
  }

  async function chooseAnswer(choice: string) {
    if (!session) return;
    const lastTurn = conversationTurns.at(-1);
    const retryingSameAnswer = phase === "error" && errorStage === "reply" && lastTurn?.speaker === "user" && lastTurn.text === choice;
    const turnsBeforeAnswer = retryingSameAnswer ? conversationTurns.slice(0, -1) : conversationTurns;
    const round = turnsBeforeAnswer.filter((turn) => turn.speaker === "user").length + 1;
    const turnsWithAnswer: Turn[] = [...turnsBeforeAnswer, { speaker: "user", text: choice }];
    setSelectedChoice(choice);
    setConversationTurns(turnsWithAnswer);
    setPhase("replying");
    setError("");
    try {
      const response = await fetch("/api/training-session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reply", scenarioSlug: scenario.slug, conversationType: session.conversationType, opening: session.opening, choices: session.choices, selectedChoice: choice, turns: turnsWithAnswer, round }),
      });
      const payload = await readPayload(response);
      const reply = payload.reply as string;
      const completedTurns: Turn[] = [...turnsWithAnswer, { speaker: "caller", text: reply }];
      setConversationTurns(completedTurns);
      if (round >= 3) {
        const rewards = completeScenario(scenario.slug).map((reward) => reward.id);
        setRewardIds(rewards);
        await evaluate(completedTurns, choice, rewards);
      } else {
        setSession((current) => current ? { ...current, choices: payload.choices as string[] } : current);
        setSelectedChoice("");
        setPhase("choosing");
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "無法取得來話方的回覆。";
      setError(message);
      setErrorStage("reply");
      setPhase("error");
    }
  }

  const riskLabels = { high: "高風險", medium: "中度風險", low: "低風險", insufficient_information: "資訊不足" };
  const completedRounds = conversationTurns.filter((turn) => turn.speaker === "user").length;
  const phaseLabels = { loading: "正在產生本次來話", choosing: "閱讀來話並選擇回應", replying: "來話方正在回覆", analyzing: "AI 正在分析對話與評分", complete: "對話分析完成", error: "需要重新處理" };
  const progressPercent = phase === "complete" ? 100 : phase === "analyzing" ? 90 : phase === "loading" ? 10 : Math.min(80, 25 + completedRounds * 20);

  return <AppShell current="訓練情境"><div className="inner game-training">
    <header className="training-mission-bar"><div><span>情境主題</span><strong>{scenario.title}</strong></div><div className="calm-meter"><span>練習進度</span><i><b style={{ width: `${progressPercent}%` }}/></i><strong>{phase === "complete" ? "完成" : "進行中"}</strong></div><button type="button" onClick={() => router.push("/scenarios")}>離開任務</button></header>

    <div className="training-game-layout"><aside className="mission-side"><div className="shield-status"><span><ShieldIcon/></span><div><small>本次流程</small><strong>{phaseLabels[phase]}</strong></div></div><ol>{["AI 產生新來話", "完成三輪回答", "來話方依回答反應", "AI 分析與評分"].map((label, index) => { const complete = phase === "complete" || (phase === "analyzing" && index < 3) || (phase === "replying" && index < 2) || (phase === "choosing" && index === 0); return <li className={complete ? "done" : ""} key={label}><span>{complete ? "✓" : index + 1}</span>{label}</li>; })}</ol><p className="training-mode-note">完成三輪並送出分析後，才會計入守護貓進度；重複同一情境不會重複計算。</p></aside>

      <section className="chat game-chat" aria-busy={phase === "analyzing"}><div className="chat-head"><div><strong>AI 情境對話</strong><span>主題：{scenario.title} · 虛構安全練習</span></div><span>{phase === "choosing" || phase === "replying" ? `第 ${Math.min(3, completedRounds + (phase === "replying" ? 1 : 1))} / 3 輪` : phaseLabels[phase]}</span></div>
        <div className="chat-body">
          {phase === "loading" && <p>AI 正在為「{scenario.title}」產生本次來話和四個回應選項…</p>}
          {conversationTurns.map((turn, index) => <div className="conversation-turn" key={`${index}-${turn.speaker}`}><div className={`speaker-label ${turn.speaker === "user" ? "user-label" : ""}`}><span>{turn.speaker === "user" ? "我" : "來"}</span>{turn.speaker === "user" ? "你的回答" : index === 0 ? "來話方" : "來話方的回覆"}{turn.speaker === "caller" && speechSupported && <button className="speech-inline" type="button" onClick={() => toggleSpeech(turn.text)} aria-label={`${speakingText === turn.text ? "停止" : "朗讀"}這則來話`}>{speakingText === turn.text ? "停止" : "朗讀"}</button>}</div><div className={`bubble ${turn.speaker === "user" ? "user" : "attacker"}`}>{turn.text}</div></div>)}
          {phase === "replying" && <div className="conversation-turn typing-turn"><div className="speaker-label"><span>來</span>來話方正在輸入</div><div className="bubble attacker typing-bubble" role="status" aria-live="polite" aria-label="來話方正在輸入"><span aria-hidden="true"/><span aria-hidden="true"/><span aria-hidden="true"/></div></div>}
          {phase === "choosing" && session && <div className="generated-choice-list"><strong>第 {completedRounds + 1} 輪：你會怎麼回應？</strong>{session.choices.map((choice, index) => <div className="choice-row" key={`${index}-${choice}`}><button className="choice-select" type="button" onClick={() => { stopSpeech(); void chooseAnswer(choice); }}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>{speechSupported && <button className="choice-speak" type="button" onClick={() => toggleSpeech(choice)} aria-label={`${speakingText === choice ? "停止" : "朗讀"}選項 ${String.fromCharCode(65 + index)}`}>{speakingText === choice ? "停止" : "朗讀"}</button>}</div>)}</div>}
          {phase === "analyzing" && <section className="analysis-progress" role="status" aria-live="polite" aria-label="AI 正在分析本次對話">
            <div className="analysis-progress-heading"><span className="analysis-cat" aria-hidden="true"><Image className="analysis-cat-frame" src="/brand/waiting-cat-1.png" alt="" width={72} height={72}/><Image className="analysis-cat-frame" src="/brand/waiting-cat-2.png" alt="" width={72} height={72}/><Image className="analysis-cat-frame" src="/brand/waiting-cat-3.png" alt="" width={72} height={72}/></span><div><strong>對話已結束，AI 正在分析</strong><p>請稍候，系統正在整理這段練習的風險與回饋。</p></div></div>
            <div className="analysis-progress-track" role="progressbar" aria-label="AI 分析進度" aria-valuetext="分析進行中"><span className="analysis-progress-fill"/><span className="analysis-fish" aria-hidden="true"><Image src="/brand/loading-fish.png" alt="" width={84} height={49}/></span></div>
            <ul><li>辨識來話中的風險訊號</li><li>評估你的回答是否安全</li><li>整理練習回饋與能力分數</li></ul>
            <small>分析完成後會自動顯示結果，請先留在此頁面。</small>
          </section>}
          {analysis && <div className="dynamic-analysis"><div className="dynamic-risk-pair"><div><small>來話風險</small><strong>{riskLabels[analysis.scenarioRiskLevel]}</strong></div><div className={analysis.answerRiskLevel === "low" ? "risk-is-safe" : "risk-needs-work"}><small>你的回答風險</small><strong>{riskLabels[analysis.answerRiskLevel]}</strong></div><div><small>本次 AI 評分</small><strong>{analysis.totalScore} / 100</strong></div></div><p>{analysis.summary}</p><p className="response-feedback">{analysis.responseFeedback}</p>
            {analysis.scenarioSignals.length > 0 && <div><strong>來話警訊</strong>{analysis.scenarioSignals.map((signal, index) => <p className="signal-line" key={`scenario-${index}`}><b>{signal.name}</b>：{signal.evidence}</p>)}</div>}
            {analysis.answerSignals.length > 0 && <div><strong>回答中的風險</strong>{analysis.answerSignals.map((signal, index) => <p className="signal-line" key={`answer-${index}`}><b>{signal.name}</b>：{signal.evidence}</p>)}</div>}
            {analysis.suggestedActions.length > 0 && <div><strong>下一步建議</strong><ul>{analysis.suggestedActions.map((action, index) => <li key={`${index}-${action}`}>{action}</li>)}</ul></div>}
            <div className="dynamic-score-bars">{skillDimensions.map(({ key, label }) => <div key={key}><span>{label}</span><i><b style={{ width: `${analysis.dimensionScores[key]}%` }}/></i><strong>{analysis.dimensionScores[key]}</strong></div>)}</div>
            <small>此為 AI 對本次模擬對話的練習評分，不代表真實防詐能力或正式案件判定。</small>
          </div>}
        </div>
        {phase === "error" && <div className="decision"><p role="alert">{error}</p>{errorStage === "start" ? <button className="button button-primary" onClick={() => void startSession()}>重新產生情境</button> : errorStage === "reply" ? <button className="button button-primary" onClick={() => void chooseAnswer(selectedChoice)}>重試來話回覆</button> : <button className="button button-primary" onClick={() => void evaluate(conversationTurns, selectedChoice)}>重試分析與評分</button>}</div>}
        {phase === "complete" && <div className="decision"><button className="button button-primary" onClick={() => router.push("/report")}>查看完整任務報告</button></div>}
      </section>
    </div>
  </div></AppShell>;
}

export default function Page() { return <Suspense><Training/></Suspense>; }
