export const skillDimensions = [
  { key: "riskRecognition", label: "風險辨識" },
  { key: "calmJudgment", label: "冷靜判斷" },
  { key: "personalData", label: "個資保護" },
  { key: "verification", label: "查證能力" },
  { key: "refusal", label: "拒絕能力" },
  { key: "helpSeeking", label: "求助能力" },
] as const;

export type SkillScores = Record<(typeof skillDimensions)[number]["key"], number>;
