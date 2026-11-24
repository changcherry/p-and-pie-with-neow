"use client";
import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ShieldIcon } from "@/components/icons";
import { dimensions } from "@/lib/demo-data";
import { catRewards } from "@/lib/cat-progress";
type Result={title:string;safe:boolean;feedback:string;warnings:string[];marked:string[];calm:number;badge:string;catRewards?:string[]};
export default function Page(){const[result]=useState<Result|null>(()=>{if(typeof window==="undefined")return null;const raw=localStorage.getItem("goodshield-result");return raw?JSON.parse(raw):null});const safe=result?.safe??true;const score=safe?86:54;const found=result?.marked?.length??2;return <AppShell current="能力報告"><div className="inner game-result">
  <header className="result-hero"><div><p className="eyebrow">任務結算</p><h1>{safe?"善盾守住了這次風險":"這次找到需要修復的能力"}</h1><p>{result?.feedback??"你成功停止操作，並改用可信任的管道查證。"}</p><div className="result-tags"><span>{result?.title??"假親友借錢"}</span><span>冷靜值 {result?.calm??88}</span><span>警訊 {found} / 3</span></div></div><div className={`shield-result ${safe?"complete":"damaged"}`}><div className="shield-core"><ShieldIcon/><strong>{score}</strong><span>善盾完整度</span></div><i/><i/><i/></div></header>
  <section className="reward-grid"><article className="reward-card badge-card"><p className="eyebrow">本次徽章</p><div className="badge-medal"><ShieldIcon/><span>✓</span></div><h2>{safe?"查證守護者":"再次練習"}</h2><p>{safe?"你在催促下仍使用獨立管道確認身分。":"完成下一次練習，就能重新修復這面善盾。"}</p></article><article className="reward-card warnings-card"><p className="eyebrow">警訊收集</p><h2>找到 {found} 個警訊</h2><div>{(result?.warnings??["要求立刻匯款","阻止向他人查證","突然更換聯絡方式"]).map((w,i)=><span className={i<found?"found":""} key={w}><i>{i<found?"✓":"?"}</i>{i<found?w:"尚未找到的警訊"}</span>)}</div></article></section>
  {!!result?.catRewards?.length&&<section className="cat-unlock-banner"><div><p className="eyebrow">守護貓獎勵</p><h2>新的夥伴能力已解鎖</h2><p>{result.catRewards.map(id=>catRewards.find(reward=>reward.id===id)?.name).filter(Boolean).join("、")}</p></div><Link className="button button-primary" href="/guardian-cat">查看守護貓</Link></section>}
  <section className="ability-result"><div><p className="eyebrow">六面善盾</p><h2>這次強化了查證能力</h2><p>正式分數由固定規則計算，AI 只負責把改善建議改寫得更容易理解。</p></div><div className="shield-dimensions">{dimensions.map(([name,value],i)=>{const adjusted=Math.max(42,value+(safe?0:-22));return <div className={i===3?"boosted":""} key={name}><span>{name}</span><i><b style={{width:`${adjusted}%`}}/></i><strong>{adjusted}</strong>{i===3&&<em>+8</em>}</div>})}</div></section>
  <div className="actions result-actions"><Link className="button button-primary" href="/scenarios">選擇下一個任務</Link><Link className="button button-secondary" href="/history">查看成長紀錄</Link></div>
  </div></AppShell>}
