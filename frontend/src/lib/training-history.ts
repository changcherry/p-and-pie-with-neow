import type { SkillScores } from "@/lib/training-score";

export type TrainingHistoryRecord = {
  id: string;
  completedAt: string;
  title: string;
  score: number;
  scores: SkillScores;
  result: Record<string, unknown>;
  analysis: Record<string, unknown>;
};

const storageKey = "goodshield-training-history";

export function readTrainingHistory(): TrainingHistoryRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(value) ? value.filter((item) => item && typeof item.id === "string" && typeof item.score === "number") : [];
  } catch {
    return [];
  }
}

export function appendTrainingHistory(record: Omit<TrainingHistoryRecord, "id" | "completedAt">) {
  const next: TrainingHistoryRecord = {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    completedAt: new Date().toISOString(),
  };
  localStorage.setItem(storageKey, JSON.stringify([next, ...readTrainingHistory()].slice(0, 50)));
  return next;
}

export function selectTrainingHistoryRecord(record: TrainingHistoryRecord) {
  localStorage.setItem("goodshield-result", JSON.stringify(record.result));
  localStorage.setItem("goodshield-ai-analysis", JSON.stringify({ status: "complete", analysis: record.analysis }));
}
