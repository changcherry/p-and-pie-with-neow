import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ShieldIcon } from "@/components/icons";
import { scenarios } from "@/lib/demo-data";

export default function Home() {
  return <AppShell current="首頁">
    <section className="hero" data-enter>
      <div className="hero-copy">
        <div className="hero-kicker"><span>AI 實境陪練</span><span>4 種常見情境</span></div>
        <h1>長者防詐<br/>實境陪練平台</h1>
        <p className="lead">AI 依你的選擇改變話術。練習查證、拒絕與求助，在安全環境中建立面對詐騙的判斷力。</p>
        <div className="actions"><Link className="button button-primary" href="/scenarios">開始防詐訓練 <span aria-hidden="true">→</span></Link><Link className="button button-secondary" href="/history">查看成長紀錄</Link></div>
        <p className="fact"><ShieldIcon/> 正式分數由固定規則計算，AI 不會自行決定分數。</p>
      </div>
      <div className="hero-stage" aria-label="假親友借錢實境訓練預覽" role="img" data-visual>
        <div className="stage-orbit orbit-one"/><div className="stage-orbit orbit-two"/>
        <div className="product-window">
          <div className="window-bar"><span className="window-brand"><i><ShieldIcon/></i>善盾 AI</span><span className="window-status"><b/>安全練習中</span></div>
          <div className="window-context"><span>假親友借錢</span><strong>第 2 階段：面對緊急借款</strong><em>02 / 04</em></div>
          <div className="conversation-preview">
            <div className="speaker-row"><span className="speaker danger-speaker">陌</span><div className="message-block"><small>陌生聯絡人</small><p>我換手機了，現在真的很急。你先幫我匯款，晚點再解釋。</p></div></div>
            <div className="risk-signal"><span>偵測到催促話術</span><i>先停一下</i></div>
            <div className="speaker-row self"><span className="speaker safe-speaker">我</span><div className="message-block"><small>你的回答</small><p>我先打你原本的電話確認，不會現在匯款。</p></div></div>
          </div>
          <div className="window-feedback"><span className="feedback-icon"><ShieldIcon/></span><div><strong>你做了正確查證</strong><small>沒有跟著對方的急迫節奏行動</small></div><span className="feedback-score">+26</span></div>
        </div>
        <div className="stage-note"><span>本次能力</span><strong>查證能力提升</strong><i>↑ 8</i></div>
      </div>
    </section>
    <section className="scenario-section section" id="scenarios">
      <div className="section-head"><div><p className="eyebrow">四種實境練習</p><h2>不同話術，同一個安全原則</h2></div><p>遇到催促、恐嚇或誘惑時，練習先停止操作，再查證與求助。</p></div>
      <div className="cards scenario-cards">{scenarios.map((scenario,index)=><Link className="card scenario-card" href={`/training?scenario=${scenario.slug}`} key={scenario.slug}><div className="card-top" data-visual><span className="scenario-index">0{index+1}</span><span className={`symbol ${scenario.tone}`}>{scenario.symbol}</span></div><small>{scenario.difficulty}</small><h3>{scenario.title}</h3><p>{scenario.description}</p><span className="card-action">開始這項訓練 <b aria-hidden="true">→</b></span></Link>)}</div>
    </section>
    <section className="method-section section">
      <div className="method-copy"><p className="eyebrow">練習留下能力</p><h2>每一次決定，都有清楚依據</h2><p>系統記錄你辨識到的警訊與做出的關鍵決策，再用固定規則計算六項能力。AI 只負責把建議說得更容易理解。</p><Link className="button button-secondary" href="/report">查看能力報告</Link></div>
      <div className="ability-panel" data-visual><div className="ability-head"><div><small>本次總分</small><strong>82</strong></div><span>假親友借錢</span></div><div className="ability-bars">{[["風險辨識",86],["冷靜判斷",78],["個資保護",92],["查證能力",84],["拒絕能力",76],["求助能力",74]].map(([label,value])=><div className="ability-row" key={label}><span>{label}</span><i><b style={{width:`${value}%`}}/></i><strong>{value}</strong></div>)}</div><div className="ability-note"><ShieldIcon/><span><strong>沒有提供個人資料</strong><small>你成功避開一項高風險行為</small></span></div></div>
    </section>
  </AppShell>;
}
