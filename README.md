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

目前答題與解鎖進度儲存在瀏覽器 `localStorage`。正式認證、資料庫與 AI 串接尚未加入。
