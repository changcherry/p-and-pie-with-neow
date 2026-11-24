# 善盾 AI

## 守護貓比較版

這份複本加入「完成防詐情境後解鎖守護貓花色、姿勢與動作」的遊戲化流程。原始專案位於上一層目錄，未被修改。

- 前端：`frontend`
- 內嵌 3D 小貓來源：`meow-generator`
- 守護貓頁面：`/guardian-cat`

Meow Generator 使用 PolyForm Noncommercial License 1.0.0。比較版保留其完整 `LICENSE`、原始碼與 Required Notice；若用於商業、品牌合作或展覽，請另向原作者取得書面授權。

長者防詐實境陪練平台。本倉庫包含 Next.js 前端與已整合的 Meow Generator 原始碼。

## 啟動

```bash
cd frontend
npm install
npm run dev
```

開啟 <http://localhost:3000>，守護貓頁面位於 <http://localhost:3000/guardian-cat>。

訓練進度與最新報告儲存在瀏覽器 `localStorage`。正式認證與資料庫尚未加入。AI 路由採 OpenAI Chat Completions 相容格式。設定時將 `frontend/env.example` 複製成 `frontend/.env.local`，填入模型服務網址、私密 API key 與模型名稱，再重新啟動前端。API key 只在伺服器端使用；未設定或模型服務無法使用時，動態訓練會顯示錯誤並提供重試。

## 訓練評分

每次訓練會依選定主題生成新的虛構來話與四個回答選項；使用者選擇後，模型生成來話方回覆，再分析完整對話。模型分開評估來話風險與使用者回答風險，並依對話證據為六項能力評分；伺服器驗證分數範圍後計算六項平均作為總分。這是 AI 輔助的練習原型，不代表經實證驗證的防詐能力測驗。安全限制與資料欄位見 `frontend/src/app/api/training-session/route.ts` 和 `frontend/src/app/api/risk-assessment/route.ts`。
