export type CatReward = {
  id: string;
  type: "花色" | "姿勢" | "動作";
  name: string;
  description: string;
  required: number;
  swatch: string;
};

export type CatProgress = {
  completedScenarios: string[];
  seenRewards: string[];
};

export const catRewards: CatReward[] = [
  { id: "orange", type: "花色", name: "暖橘守護色", description: "第一位陪你練習查證的守護貓。", required: 0, swatch: "#d88a4a" },
  { id: "stretch", type: "姿勢", name: "安心伸懶腰", description: "完成第一個情境後解鎖。", required: 1, swatch: "#e8ccd7" },
  { id: "tabby", type: "花色", name: "灰虎斑", description: "完成兩個不同情境後解鎖。", required: 2, swatch: "#9b9288" },
  { id: "play", type: "動作", name: "撲玩具", description: "完成三個不同情境後解鎖。", required: 3, swatch: "#c7d3db" },
  { id: "tuxedo-run", type: "花色", name: "賓士巡邏隊", description: "完成全部四個情境後解鎖。", required: 4, swatch: "#3e3630" },
];

const storageKey = "goodshield-cat-progress";

export function readCatProgress(): CatProgress {
  if (typeof window === "undefined") return { completedScenarios: [], seenRewards: [] };
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { completedScenarios: [], seenRewards: [] };
    const parsed = JSON.parse(raw) as Partial<CatProgress>;
    return {
      completedScenarios: Array.isArray(parsed.completedScenarios) ? parsed.completedScenarios : [],
      seenRewards: Array.isArray(parsed.seenRewards) ? parsed.seenRewards : [],
    };
  } catch {
    return { completedScenarios: [], seenRewards: [] };
  }
}

export function completeScenario(slug: string) {
  const before = readCatProgress();
  const completedScenarios = Array.from(new Set([...before.completedScenarios, slug]));
  const newlyUnlocked = catRewards.filter(
    reward => reward.required <= completedScenarios.length && reward.required > before.completedScenarios.length,
  );
  const next = { ...before, completedScenarios };
  localStorage.setItem(storageKey, JSON.stringify(next));
  localStorage.setItem("goodshield-new-cat-rewards", JSON.stringify(newlyUnlocked.map(reward => reward.id)));
  return newlyUnlocked;
}

