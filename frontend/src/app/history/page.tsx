"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { readTrainingHistory, selectTrainingHistoryRecord } from "@/lib/training-history";
import { skillDimensions } from "@/lib/training-score";

export default function Page() {
  const [records] = useState(() => readTrainingHistory());
  const recent = records.slice(0, 3);
  const average = recent.length ? Math.round(recent.reduce((sum, record) => sum + record.score, 0) / recent.length) : null;
  const latest = records[0];
  const previous = records[1];
  const strongestGrowth = latest && previous
    ? skillDimensions.map((dimension) => ({ label: dimension.label, change: latest.scores[dimension.key] - previous.scores[dimension.key] })).sort((a, b) => b.change - a.change)[0]
    : null;

  return <AppShell current="歷史紀錄"><div className="inner"><header className="page-title compact"><p className="eyebrow">能力紀錄</p><h1>每次練習，都看得見進步</h1><p>紀錄只保存在目前的瀏覽器，不會上傳或分享完整對話。</p></header>
    <section className="history-summary"><div><small>最近一次</small><strong>{latest ? `${latest.score} 分` : "尚無紀錄"}</strong></div><div><small>最近三次平均</small><strong>{average === null ? "—" : `${average} 分`}</strong></div><div><small>進步最多</small><strong>{strongestGrowth?.change && strongestGrowth.change > 0 ? strongestGrowth.label : "完成兩次後顯示"}</strong></div></section>
    {records.length ? <section className="history-list" aria-label="訓練紀錄">{records.map((record, index) => { const older = records[index + 1]; const change = older ? record.score - older.score : null; return <article key={record.id}><div><strong>{record.title}</strong><span>{new Intl.DateTimeFormat("zh-TW", { dateStyle: "medium", timeStyle: "short" }).format(new Date(record.completedAt))}</span></div><b>{record.score} 分</b><span className="change">{change === null ? "初次" : `${change >= 0 ? "+" : ""}${change}`}</span><Link href="/report" onClick={() => selectTrainingHistoryRecord(record)}>查看報告</Link></article>; })}</section> : <section className="no-score-card"><h2>還沒有練習紀錄</h2><p>完成一次三輪情境與 AI 分析後，紀錄就會出現在這裡。</p><Link className="button button-primary" href="/scenarios">開始第一次練習</Link></section>}
  </div></AppShell>;
}
