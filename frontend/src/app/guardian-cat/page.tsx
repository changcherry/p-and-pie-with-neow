"use client";

import { useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { catRewards, readCatProgress, type CatProgress } from "@/lib/cat-progress";

const rewardControlLabels: Record<string, string[]> = {
  stretch: ["伸懶腰"], tabby: ["灰虎斑"], play: ["Motion", "動作"], "tuxedo-run": ["賓士貓"],
};

export default function GuardianCatPage() {
  const [progress] = useState<CatProgress>(() => readCatProgress());
  const studio = useRef<HTMLIFrameElement>(null);
  const completed = progress.completedScenarios.length;
  const unlocked = catRewards.filter((reward) => reward.required <= completed);

  function prepareStudio() {
    const doc = studio.current?.contentDocument;
    if (!doc) return;
    doc.documentElement.lang = "zh-Hant-TW";
    doc.documentElement.dataset.locale = "zh-TW";
    const traditionalChineseButton = doc.querySelector<HTMLButtonElement>('[data-locale="zh-TW"]');
    if (traditionalChineseButton && traditionalChineseButton.getAttribute("aria-pressed") !== "true") {
      traditionalChineseButton.click();
    }
    const style = doc.createElement("style");
    style.dataset.goodshield = "locks";
    style.textContent = `.panel-actions{display:none!important}.goodshield-locked-control{opacity:.38!important;filter:grayscale(.7)!important;cursor:not-allowed!important;pointer-events:none!important}`;
    doc.head.appendChild(style);
    const controls = Array.from(doc.querySelectorAll<HTMLElement>("button, [role='button'], label"));
    for (const reward of catRewards) {
      if (reward.required <= completed || reward.required === 0) continue;
      const labels = rewardControlLabels[reward.id] ?? [];
      for (const control of controls) {
        const text = `${control.textContent ?? ""} ${control.getAttribute("aria-label") ?? ""}`;
        if (!labels.some((label) => text.includes(label))) continue;
        control.classList.add("goodshield-locked-control");
        control.setAttribute("aria-disabled", "true");
        control.setAttribute("title", `完成 ${reward.required} 個不同情境後解鎖`);
        if (control instanceof HTMLButtonElement) control.disabled = true;
      }
    }
  }

  return <AppShell current="守護貓"><div className="guardian-meow-page">
    <section className="guardian-meow-bar" aria-label="守護貓進度"><div><p className="eyebrow">善盾守護貓</p><strong>完成防詐任務，開放更多造型與動作</strong></div><div className="guardian-meow-progress"><span>已完成 <b>{completed} / 4</b> 個情境</span><small>{unlocked.length} / {catRewards.length} 項獎勵</small><i aria-hidden="true"><b style={{ width: `${Math.min(100, completed / 4 * 100)}%` }} /></i></div></section>
    <iframe ref={studio} onLoad={prepareStudio} className="guardian-meow-frame" src="/meow-generator/index.html" title="善盾 AI 3D 守護貓互動工作室" />
    <p className="guardian-meow-license">3D 小貓系統源自 Meow Generator，依 PolyForm Noncommercial 1.0.0 授權使用。Copyright 2026 Simon Lee and Ring Hyacinth.</p>
  </div></AppShell>;
}
