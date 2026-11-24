import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ShieldIcon } from "@/components/icons";
import { scenarios } from "@/lib/demo-data";

const missionNames = ["陌生的新號碼", "保證獲利的群組", "不能告訴家人的案件", "只有你能幫我"];
const status = ["建議先挑戰", "尚未練習", "尚未練習", "新任務"];
const skills = [["查證能力", "冷靜判斷"], ["風險辨識", "冷靜判斷"], ["風險辨識", "求助能力"], ["拒絕能力", "求助能力"]];

export default function Page() {
  return <AppShell current="訓練情境"><div className="inner game-hub">
    <header className="mission-header"><div><p className="eyebrow">善盾任務中心</p><h1>選擇今天的防詐任務</h1><p>完成實境對話、找出詐騙警訊，強化六項善盾能力。</p></div><div className="player-card"><span className="player-shield"><ShieldIcon/></span><div><small>你的善盾</small><strong>守護等級 2</strong><span>已完成 3 次練習</span></div><b>75</b></div></header>
    <section className="mission-progress" aria-label="本週任務進度"><div><span>本週進度</span><strong>1 / 4</strong></div><i><b/></i><p>再完成 3 個任務，可獲得「四關守護者」徽章。</p></section>
    <section className="mission-grid" aria-label="任務地圖">{scenarios.map((scenario, index) => <article className={`mission-card mission-${index + 1}`} key={scenario.slug}><div className="mission-visual" data-visual><span className="mission-number">{String(index + 1).padStart(2, "0")}</span><div className="mission-rings"><i/><i/><i/></div><span className={`symbol ${scenario.tone}`}>{scenario.symbol}</span><em>{status[index]}</em></div><div className="mission-content"><small>{scenario.difficulty}</small><h2>{missionNames[index]}</h2><p>{scenario.description}</p><div className="mission-skills"><span>{skills[index][0]}</span><span>{skills[index][1]}</span></div><Link className="button button-primary" href={`/training?scenario=${scenario.slug}`}>開始任務 <span aria-hidden="true">→</span></Link></div></article>)}</section>
  </div></AppShell>;
}
