"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ShieldIcon } from "@/components/icons";
import { catRewards } from "@/lib/cat-progress";
import { skillDimensions, type SkillScores } from "@/lib/training-score";

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
type Result = { title: string; decisionLabel: string; totalScore: number; badge: string; catRewards?: string[]; turns?: { speaker: string; text: string }[] };
type SavedAnalysis = { status: "loading" | "complete" | "error"; analysis?: Analysis; error?: string };

function readLocal<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : null; } catch { return null; }
}

export default function Page() {
  const [result] = useState<Result | null>(() => readLocal<Result>("goodshield-result"));
  const [saved] = useState<SavedAnalysis | null>(() => readLocal<SavedAnalysis>("goodshield-ai-analysis"));
  const candidate = saved?.analysis;
  const analysis = saved?.status === "complete" && candidate && candidate.scenarioRiskLevel && candidate.answerRiskLevel && candidate.dimensionScores ? candidate : null;
  const riskLabels = { high: "高風險", medium: "中度風險", low: "低風險", insufficient_information: "資訊不足" };
  const hasScore = typeof result?.totalScore === "number";

  return <AppShell current="能力報告"><div className="inner game-result">
    <header className="result-hero"><div><p className="eyebrow">任務結算</p><h1>{analysis ? analysis.answerRiskLevel === "low" ? "你選擇了安全的回應" : analysis.answerRiskLevel === "high" ? "這次回答有明顯風險" : "這次回答還有改善空間" : "完成一次 AI 情境練習，查看評分"}</h1><p>{analysis?.responseFeedback ?? saved?.error ?? "每次練習會生成新對話，並分開評估來話風險與回答風險。"}</p><div className="result-tags"><span>{result?.title ?? "尚無訓練紀錄"}</span><span>來話風險：{analysis ? riskLabels[analysis.scenarioRiskLevel] : "—"}</span><span>回答風險：{analysis ? riskLabels[analysis.answerRiskLevel] : "—"}</span></div></div><div className={`shield-result ${analysis?.answerRiskLevel === "low" ? "complete" : "damaged"}`}><div className="shield-core"><ShieldIcon/><strong>{hasScore ? result.totalScore : "—"}</strong><span>AI 練習分數 / 100</span></div><i/><i/><i/></div></header>

    {analysis ? <>
      {result?.turns?.length && <section className="conversation-transcript"><p className="eyebrow">本次完整對話</p>{result.turns.map((turn, index) => <article className={turn.speaker === "user" ? "transcript-user" : ""} key={`${turn.speaker}-${index}`}><small>{turn.speaker === "user" ? "你的回答" : "AI 模擬來話方"}</small><p>{turn.text}</p></article>)}</section>}
      <section className="dynamic-report-pair"><article><small>對方來話風險</small><strong>{riskLabels[analysis.scenarioRiskLevel]}</strong><p>這只代表模擬對話中來話方的風險程度。</p></article><article className={analysis.answerRiskLevel === "low" ? "risk-is-safe" : "risk-needs-work"}><small>你的回答風險</small><strong>{riskLabels[analysis.answerRiskLevel]}</strong><p>這只評估你選擇的回應，不會與來話風險混算。</p></article></section>

      <section className="report-ai-analysis"><div className="report-ai-heading"><div><p className="eyebrow">AI 對話分析</p><h2>風險依據與回饋</h2></div><span>模擬練習，非正式案件判定</span></div><p>{analysis.summary}</p>
        {analysis.scenarioSignals.length > 0 && <div className="report-ai-list"><strong>來話警訊</strong>{analysis.scenarioSignals.map((signal, index) => <div key={`scenario-${index}`}><b>{signal.name}</b><span>{signal.evidence}</span></div>)}</div>}
        {analysis.answerSignals.length > 0 && <div className="report-ai-list"><strong>回答中的風險</strong>{analysis.answerSignals.map((signal, index) => <div key={`answer-${index}`}><b>{signal.name}</b><span>{signal.evidence}</span></div>)}</div>}
        {analysis.suggestedActions.length > 0 && <div className="report-ai-list"><strong>建議下一步</strong><ul>{analysis.suggestedActions.map((action, index) => <li key={`${index}-${action}`}>{action}</li>)}</ul></div>}
        {analysis.uncertainty && <p>仍需留意：{analysis.uncertainty}</p>}<small className="report-ai-disclaimer">遇到實際可疑情況，請改用官方管道查證；在臺灣可撥 165 詢問。</small>
      </section>

      <section className="ability-result"><div><p className="eyebrow">六項能力評分</p><h2>本次總分 {analysis.totalScore} / 100</h2><p>AI 依本次完整對話與回答證據評估各項能力，總分由六項分數平均計算。</p></div><div className="shield-dimensions">{skillDimensions.map(({ key, label }) => { const value = analysis.dimensionScores[key]; return <div key={key}><span>{label}</span><i><b style={{ width: `${value}%` }}/></i><strong>{value}</strong></div>; })}</div></section>
    </> : <section className="no-score-card"><h2>{saved?.status === "loading" ? "正在分析對話…" : "尚無本次 AI 評分"}</h2><p>{saved?.status === "error" ? saved.error : "完成一個情境練習後，這裡會顯示來話風險、回答風險和六項能力評分。"}</p><Link className="button button-primary" href="/scenarios">開始防詐訓練</Link></section>}

    {!!result?.catRewards?.length && <section className="cat-unlock-banner"><div><p className="eyebrow">守護貓獎勵</p><h2>新的夥伴能力已解鎖</h2><p>{result.catRewards.map((id) => catRewards.find((reward) => reward.id === id)?.name).filter(Boolean).join("、")}</p></div><Link className="button button-primary" href="/guardian-cat">查看守護貓</Link></section>}
    <div className="actions result-actions"><Link className="button button-primary" href="/scenarios">再練習一個情境</Link><Link className="button button-secondary" href="/history">查看成長紀錄</Link></div>
  </div></AppShell>;
}
