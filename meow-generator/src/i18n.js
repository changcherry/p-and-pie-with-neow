const STORAGE_KEY = 'meow-generator-locale';
const SUPPORTED_LOCALES = new Set(['zh-TW', 'ja-JP', 'en']);

const COPY = {
  '小貓罐頭正在準備畫布': { 'ja-JP': 'ねこ缶がキャンバスを準備中', en: 'The canned kitten is preparing the canvas' },
  '正在開罐，馬上就好…': { 'ja-JP': '缶を開けています、もうすぐです…', en: 'Opening the can, almost ready…' },
  '場景控制': { 'ja-JP': 'シーン操作', en: 'Scene controls' },
  '拖動光照球調整光照方向': { 'ja-JP': 'ライト球をドラッグして光の向きを変更', en: 'Drag the light orb to change lighting direction' },
  '拖動小太陽，改變光照方向': { 'ja-JP': '小さな太陽をドラッグして光の向きを変更', en: 'Drag the sun to change lighting direction' },
  '音樂': { 'ja-JP': '音楽', en: 'Music' },
  '光照': { 'ja-JP': '照明', en: 'Light' },
  '天氣': { 'ja-JP': '天気', en: 'Weather' },
  '☀️ 晴天': { 'ja-JP': '☀️ 晴れ', en: '☀️ Sunny' },
  '☁️ 陰天': { 'ja-JP': '☁️ くもり', en: '☁️ Cloudy' },
  '⚡ 打雷': { 'ja-JP': '⚡ 雷', en: '⚡ Thunder' },
  '🌧️ 下雨': { 'ja-JP': '🌧️ 雨', en: '🌧️ Rain' },
  '可與陰天或下雨疊加': { 'ja-JP': 'くもり・雨と同時に使えます', en: 'Can be combined with cloudy or rain' },
  '雨量和落魚量可分別調整': { 'ja-JP': '雨量と魚の量を個別に調整', en: 'Rain and fish amounts can be adjusted separately' },
  '天氣參數': { 'ja-JP': '天気パラメータ', en: 'Weather settings' },
  '雨量': { 'ja-JP': '雨量', en: 'Rain' },
  '雲量': { 'ja-JP': '雲量', en: 'Clouds' },
  '魚量': { 'ja-JP': '魚量', en: 'Fish' },
  '拖曳旋轉 · 滾輪縮放 · 右鍵平移': { 'ja-JP': 'ドラッグ回転・ホイール拡大縮小・右ドラッグ移動', en: 'Drag to orbit · Wheel to zoom · Right-drag to pan' },
  '拖曳旋轉 · 雙指平移 · 捏合縮放': { 'ja-JP': 'ドラッグ回転・2本指移動・ピンチ拡大縮小', en: 'Drag to orbit · Two-finger pan · Pinch to zoom' },
  '參數分類': { 'ja-JP': 'パラメータ分類', en: 'Parameter categories' },
  '🐾 隨機遇見小貓': { 'ja-JP': '🐾 ランダムねこ', en: '🐾 Random kitten' },
  '帶走 GLB': { 'ja-JP': 'GLB を保存', en: 'Save GLB' },
  '留影 PNG': { 'ja-JP': 'PNG を撮影', en: 'Capture PNG' },
  '🐾 帶回 Codex': { 'ja-JP': '🐾 Codex に連れて帰る', en: '🐾 Bring to Codex' },
  '帶回 Codex': { 'ja-JP': 'Codex に連れて帰る', en: 'Bring to Codex' },
  '🐾 匯出給 Codex': { 'ja-JP': '🐾 Codex 用に書き出す', en: '🐾 Export for Codex' },
  '匯出給 Codex': { 'ja-JP': 'Codex 用に書き出す', en: 'Export for Codex' },
  '準備兩個文件，不會直接打開或喚醒 Codex': {
    'ja-JP': '2つのファイルを準備します。Codex を直接開いたり起動したりはしません',
    en: 'Prepare two files — this does not open or wake Codex',
  },
  '這裡會準備當前小貓的參數 JSON 和參考圖 PNG。下載後，把兩個文件一起發送給 Codex。': {
    'ja-JP': '現在のねこのパラメータ JSON と参考画像 PNG を準備します。ダウンロード後、2つのファイルを一緒に Codex へ送ってください。',
    en: 'This prepares a parameter JSON and reference PNG for the current kitten. Download both, then send them together to Codex.',
  },
  '下載 JSON 和圖片': { 'ja-JP': 'JSON と画像を保存', en: 'Download JSON and image' },
  '把兩個文件發給 Codex': { 'ja-JP': '2つを Codex に送る', en: 'Send both files to Codex' },
  '複製下面的指令': { 'ja-JP': '下の指示文をコピー', en: 'Copy the prompt below' },
  '為什麼需要兩個文件？': { 'ja-JP': 'なぜ2つのファイルが必要？', en: 'Why are two files needed?' },
  'JSON 保存體型和配色參數；PNG 幫助 Codex 確認小貓的最終外觀。': {
    'ja-JP': 'JSON は体型と配色を保存し、PNG はねこの最終的な見た目を Codex が確認するために使います。',
    en: 'JSON preserves body and color parameters; PNG helps Codex confirm the kitten’s final appearance.',
  },
  '把這段話和兩個文件一起發給 Codex：': {
    'ja-JP': 'この文章を2つのファイルと一緒に Codex へ送ってください：',
    en: 'Send this message to Codex together with both files:',
  },
  '請使用我附上的 Meow Generator 參數 JSON 和參考圖 PNG，為這隻貓創建並安裝一個 Codex 本機寵物。請保持它的體型、花紋、眼睛和主色；生成完整透明動作圖集；安裝前先給我看動作總覽和左右方向預覽；確認後安裝為新的獨立寵物，不要覆蓋現有寵物。': {
    'ja-JP': '添付した Meow Generator のパラメータ JSON と参考画像 PNG を使い、このねこの Codex ローカルペットを作成してインストールしてください。体型、毛柄、目、主な色を保ち、透明背景の完全なモーションアトラスを生成してください。インストール前にモーション一覧と左右方向のプレビューを見せ、確認後は既存のペットを上書きせず、新しい独立したペットとしてインストールしてください。',
    en: 'Use the attached Meow Generator parameter JSON and reference PNG to create and install a local Codex pet for this kitten. Preserve its body, coat, eyes, and main colors; generate a complete motion atlas with transparency; show me the motion overview and left/right direction previews before installation; after confirmation, install it as a new independent pet without overwriting any existing pet.',
  },
  '請分別下載 JSON 和 PNG，再複製指令。': {
    'ja-JP': 'JSON と PNG をそれぞれ保存してから、指示文をコピーしてください。',
    en: 'Download the JSON and PNG separately, then copy the prompt.',
  },
  '下載參數 JSON': { 'ja-JP': 'パラメータ JSON を保存', en: 'Download parameter JSON' },
  '下載參考圖 PNG': { 'ja-JP': '参考画像 PNG を保存', en: 'Download reference PNG' },
  '複製給 Codex 的指令': { 'ja-JP': 'Codex 用の指示文をコピー', en: 'Copy prompt for Codex' },
  '參數 JSON 已下載。還需要下載參考圖 PNG。': {
    'ja-JP': 'パラメータ JSON を保存しました。参考画像 PNG も保存してください。',
    en: 'Parameter JSON downloaded. You still need the reference PNG.',
  },
  '參考圖 PNG 已下載。請確認 JSON 也已經下載。': {
    'ja-JP': '参考画像 PNG を保存しました。JSON も保存済みか確認してください。',
    en: 'Reference PNG downloaded. Make sure the JSON is downloaded too.',
  },
  '指令已複製。現在把 JSON、PNG 和這段指令一起發給 Codex。': {
    'ja-JP': '指示文をコピーしました。JSON、PNG、この文章を一緒に Codex へ送ってください。',
    en: 'Prompt copied. Now send the JSON, PNG, and this message together to Codex.',
  },
  '已複製': { 'ja-JP': 'コピー済み', en: 'Copied' },
  '複製失敗，請手動選中上面的指令。': {
    'ja-JP': 'コピーできませんでした。上の指示文を手動で選択してください。',
    en: 'Copy failed. Please select the prompt above manually.',
  },
  '把現在這隻貓變成本機裡的新寵物': {
    'ja-JP': 'いま作ったねこを、この端末の新しいペットにします',
    en: 'Turn this kitten into a new pet on this computer',
  },
  '當前小貓': { 'ja-JP': '現在のねこ', en: 'Current kitten' },
  '這會鎖定當前小貓的體型、花紋、眼睛和顏色，再生成 Codex 寵物所需的動作。': {
    'ja-JP': '現在のねこの体型・毛柄・目・色を固定し、Codex ペット用の動きを生成します。',
    en: 'This locks the kitten’s body, coat, eyes, and colors, then generates the motions required by a Codex pet.',
  },
  '鎖定這隻貓': { 'ja-JP': 'このねこを固定', en: 'Lock this kitten' },
  '生成 Codex 動作': { 'ja-JP': 'Codex モーションを生成', en: 'Generate Codex motions' },
  '安裝為本機寵物': { 'ja-JP': 'この端末のペットとしてインストール', en: 'Install as a local pet' },
  '橘橘動作樣機已跑通': { 'ja-JP': 'オレンジねこのモーション試作は動作済み', en: 'Orange kitten motion prototype is working' },
  '任意參數自動生成與一鍵安裝正在接入。': {
    'ja-JP': '任意パラメータからの自動生成とワンクリック導入は接続中です。',
    en: 'Automatic generation from any parameters and one-click installation are being connected.',
  },
  '當前保存的是小貓參數方案，不是已經安裝完成的 Codex 寵物。': {
    'ja-JP': '現在保存できるのはねこのパラメータ案で、インストール済みの Codex ペットではありません。',
    en: 'What you can save now is the kitten parameter draft, not an installed Codex pet.',
  },
  '查看動作樣機': { 'ja-JP': 'モーション試作を見る', en: 'View motion prototype' },
  '橘橘動作樣機': { 'ja-JP': 'オレンジねこのモーション試作', en: 'Orange kitten motion prototype' },
  '返回當前小貓': { 'ja-JP': '現在のねこに戻る', en: 'Back to current kitten' },
  '先保存寵物方案': { 'ja-JP': 'ペット案を先に保存', en: 'Save pet draft' },
  '一鍵安裝 · 開發中': { 'ja-JP': 'ワンクリック導入・開発中', en: 'One-click install · In development' },
  '寵物方案已保存。動作生成與一鍵安裝完成後，可以用它繼續製作同一只貓。': {
    'ja-JP': 'ペット案を保存しました。モーション生成とワンクリック導入の完成後、同じねこの制作を続けられます。',
    en: 'Pet draft saved. Once motion generation and one-click installation are ready, it can continue building the same kitten.',
  },
  '關閉': { 'ja-JP': '閉じる', en: 'Close' },
  '播放背景音樂': { 'ja-JP': 'BGM を再生', en: 'Play background music' },
  '暫停背景音樂': { 'ja-JP': 'BGM を一時停止', en: 'Pause background music' },
  '造型': { 'ja-JP': 'スタイル', en: 'Style' },
  '姿勢': { 'ja-JP': 'ポーズ', en: 'Pose' },
  '站立': { 'ja-JP': '立つ', en: 'Stand' },
  '貓咪麵包': { 'ja-JP': '香箱座り', en: 'Loaf' },
  '隨機貓窩': { 'ja-JP': 'ランダム猫ベッド', en: 'Random cat nest' },
  '伸懶腰': { 'ja-JP': '伸び', en: 'Stretch' },
  '雙足直立': { 'ja-JP': '二足立ち', en: 'Biped' },
  '岔腿坐': { 'ja-JP': 'だらり座り', en: 'Slouch sit' },
  '側臥攤平': { 'ja-JP': '横向きぺたん', en: 'Side flop' },
  '香蕉站立': { 'ja-JP': 'バナナ立ち', en: 'Banana stand' },
  '貓窩大小': { 'ja-JP': '猫ベッドの大きさ', en: 'Nest size' },
  '實驗：軟體填充': { 'ja-JP': '実験：ソフト充填', en: 'Experimental: soft fill' },
  '實驗：軟體碰撞': { 'ja-JP': '実験：ぷるぷる衝突', en: 'Experimental: squishy collision' },
  '動態模式': { 'ja-JP': 'モーションモード', en: 'Motion mode' },
  '鍵盤狀態機': { 'ja-JP': 'キーボード操作', en: 'Keyboard state machine' },
  '動作': { 'ja-JP': 'アクション', en: 'Action' },
  '速度': { 'ja-JP': '速度', en: 'Speed' },
  '幅度': { 'ja-JP': '強さ', en: 'Intensity' },
  '小貓歸位': { 'ja-JP': 'ねこを戻す', en: 'Reset kitten' },
  'Experimental': { 'ja-JP': 'Experimental', en: 'Experimental' },
  '實驗功能：動作適配與網格表現仍在持續調整。': {
    'ja-JP': '実験機能：モーション適応とメッシュ表現は調整中です。',
    en: 'Experimental: motion retargeting and mesh behavior are still being refined.',
  },
  '花紋': { 'ja-JP': '毛柄', en: 'Coat' },
  '花紋與眼睛': { 'ja-JP': '毛柄と目', en: 'Coat & eyes' },
  '花色': { 'ja-JP': '毛柄', en: 'Coat' },
  '自訂花色': { 'ja-JP': 'カスタム毛柄', en: 'Custom coat' },
  '啟用自訂花色': { 'ja-JP': 'カスタム毛柄を有効化', en: 'Enable custom coat' },
  '花色底色': { 'ja-JP': 'ベース色', en: 'Base color' },
  '主色塊': { 'ja-JP': 'メイン模様', en: 'Primary patch' },
  '輔助色塊': { 'ja-JP': 'サブ模様', en: 'Secondary patch' },
  '隨機花色參數': { 'ja-JP': '毛柄をランダム', en: 'Randomize coat' },
  '身體環紋': { 'ja-JP': '胴体の縞', en: 'Body stripes' },
  '頭部額紋': { 'ja-JP': '額の縞', en: 'Forehead stripes' },
  '密度': { 'ja-JP': '密度', en: 'Density' },
  '寬度': { 'ja-JP': '幅', en: 'Width' },
  '抖動': { 'ja-JP': '揺らぎ', en: 'Wobble' },
  '邊緣暈染': { 'ja-JP': 'ぼかし', en: 'Edge blur' },
  '色塊數量': { 'ja-JP': '模様の数', en: 'Patch count' },
  '色塊大小': { 'ja-JP': '模様の大きさ', en: 'Patch size' },
  '不規則度': { 'ja-JP': '不規則さ', en: 'Irregularity' },
  '身體條紋密度': { 'ja-JP': '胴縞の密度', en: 'Body stripe density' },
  '身體條紋寬度': { 'ja-JP': '胴縞の幅', en: 'Body stripe width' },
  '身體條紋抖動': { 'ja-JP': '胴縞の揺らぎ', en: 'Body stripe wobble' },
  '頭部額紋密度': { 'ja-JP': '額縞の密度', en: 'Forehead stripe density' },
  '頭部額紋寬度': { 'ja-JP': '額縞の幅', en: 'Forehead stripe width' },
  '頭部額紋抖動': { 'ja-JP': '額縞の揺らぎ', en: 'Forehead stripe wobble' },
  '眼睛': { 'ja-JP': '目', en: 'Eyes' },
  '眼睛顏色': { 'ja-JP': '目の色', en: 'Eye color' },
  '右眼顏色': { 'ja-JP': '右目の色', en: 'Right eye color' },
  '異瞳': { 'ja-JP': 'オッドアイ', en: 'Odd eyes' },
  '眼睛大小': { 'ja-JP': '目の大きさ', en: 'Eye size' },
  '眼距': { 'ja-JP': '目の間隔', en: 'Eye spacing' },
  '瞳孔大小': { 'ja-JP': '瞳の大きさ', en: 'Pupil size' },
  '瞳孔高光大小': { 'ja-JP': '瞳のハイライト', en: 'Pupil highlight size' },
  '淚眼模式': { 'ja-JP': 'うるうる目', en: 'Watery eyes' },
  '淚眼形變': { 'ja-JP': 'うるうる変形', en: 'Watery deformation' },
  '體型': { 'ja-JP': '体型', en: 'Body' },
  '身體尺寸': { 'ja-JP': 'ボディサイズ', en: 'Body size' },
  '頭身比': { 'ja-JP': '頭身比', en: 'Head ratio' },
  '圓潤度': { 'ja-JP': 'ふっくら', en: 'Roundness' },
  '腿長': { 'ja-JP': '脚の長さ', en: 'Leg length' },
  '耳朵大小': { 'ja-JP': '耳の大きさ', en: 'Ear size' },
  '尾巴長度': { 'ja-JP': 'しっぽの長さ', en: 'Tail length' },
  '尾巴捲曲': { 'ja-JP': 'しっぽの巻き', en: 'Tail curl' },
  '毛髮': { 'ja-JP': '毛', en: 'Fur' },
  '炸毛': { 'ja-JP': '逆立ち毛', en: 'Fluff up' },
  '炸毛程度': { 'ja-JP': '逆立ち具合', en: 'Fluff amount' },
  '線條': { 'ja-JP': '線', en: 'Line' },
  '手繪抖動': { 'ja-JP': '手描きの揺れ', en: 'Hand-drawn wobble' },
  '捏貓': { 'ja-JP': 'ねこをつまむ', en: 'Sculpt kitten' },
  '範圍': { 'ja-JP': '範囲', en: 'Radius' },
  '軟硬': { 'ja-JP': '柔らかさ', en: 'Softness' },
  'Q彈': { 'ja-JP': 'ぷるぷる', en: 'Bounce' },
  '墊子': { 'ja-JP': 'マット', en: 'Rug' },
  '顯示墊子': { 'ja-JP': 'マットを表示', en: 'Show rug' },
  '隨機墊子': { 'ja-JP': 'マットをランダム', en: 'Random rug' },
  '木地板': { 'ja-JP': '木の床', en: 'Wood floor' },
  '隨機木地板': { 'ja-JP': '床をランダム', en: 'Random floor' },
  '木板底色': { 'ja-JP': '床のベース色', en: 'Floor base' },
  '縫隙顏色': { 'ja-JP': '目地の色', en: 'Seam color' },
  '木紋顏色': { 'ja-JP': '木目の色', en: 'Grain color' },
  '木板寬度': { 'ja-JP': '板の幅', en: 'Plank width' },
  '木紋密度': { 'ja-JP': '木目の密度', en: 'Grain density' },
  '地板方向': { 'ja-JP': '床の向き', en: 'Floor direction' },
  '粗細': { 'ja-JP': '太さ', en: 'Thickness' },
  '密度': { 'ja-JP': '密度', en: 'Density' },
  '抖動': { 'ja-JP': '揺らぎ', en: 'Wobble' },
  '傾斜': { 'ja-JP': '傾き', en: 'Slant' },
  '虛線水平拉伸': { 'ja-JP': '破線の横伸び', en: 'Dash stretch' },
  '地面影子': { 'ja-JP': '床の影', en: 'Ground shadow' },
  '排線顏色': { 'ja-JP': 'ハッチ色', en: 'Hatch color' },
  '色塊顏色': { 'ja-JP': '影の色', en: 'Shadow fill' },
  '對齊鏡頭': { 'ja-JP': 'カメラに合わせる', en: 'Align to camera' },
  '身上陰影': { 'ja-JP': '体の影', en: 'Body shading' },
  '渲染與場景': { 'ja-JP': '描画とシーン', en: 'Rendering & scene' },
  '場景與渲染': { 'ja-JP': 'シーンと描画', en: 'Scene & rendering' },
  '陰影濃度': { 'ja-JP': '影の濃さ', en: 'Shadow opacity' },
  '陰影顏色': { 'ja-JP': '影の色', en: 'Shadow color' },
  '排線濃度': { 'ja-JP': 'ハッチ濃度', en: 'Hatch opacity' },
  '大橘': { 'ja-JP': '茶トラ', en: 'Orange tabby' },
  '灰虎斑': { 'ja-JP': 'サバトラ', en: 'Grey tabby' },
  '棕虎斑': { 'ja-JP': 'キジトラ', en: 'Brown tabby' },
  '奶油': { 'ja-JP': 'クリーム', en: 'Cream' },
  '賓士貓': { 'ja-JP': 'ハチワレ', en: 'Tuxedo' },
  '三花': { 'ja-JP': '三毛', en: 'Calico' },
  '玳瑁': { 'ja-JP': 'サビ', en: 'Tortoiseshell' },
  '暹羅': { 'ja-JP': 'シャム', en: 'Siamese' },
  '黑貓': { 'ja-JP': '黒猫', en: 'Black' },
  '白貓': { 'ja-JP': '白猫', en: 'White' },
  '藍灰': { 'ja-JP': 'ブルーグレー', en: 'Blue grey' },
  '紙箱': { 'ja-JP': '段ボール箱', en: 'Cardboard box' },
  '花盆': { 'ja-JP': '植木鉢', en: 'Flowerpot' },
  '藤編籃': { 'ja-JP': '藤かご', en: 'Wicker basket' },
  '搪瓷盆': { 'ja-JP': 'ホーロー盆', en: 'Enamel basin' },
  '小水桶': { 'ja-JP': '小さなバケツ', en: 'Small bucket' },
  '布藝收納箱': { 'ja-JP': '布収納箱', en: 'Fabric bin' },
  '待機': { 'ja-JP': '待機', en: 'Idle' },
  '警覺待機': { 'ja-JP': '警戒', en: 'Alert idle' },
  '行走': { 'ja-JP': '歩く', en: 'Walk' },
  '奔跑': { 'ja-JP': '走る', en: 'Run' },
  '潛行': { 'ja-JP': '忍び歩き', en: 'Sneak' },
  '跳躍': { 'ja-JP': 'ジャンプ', en: 'Jump' },
  '落下': { 'ja-JP': '落下', en: 'Fall' },
  '坐下': { 'ja-JP': '座る', en: 'Sit' },
  '休息姿勢': { 'ja-JP': '休む', en: 'Rest' },
  '叫喚': { 'ja-JP': '鳴く', en: 'Meow' },
  '咬咬': { 'ja-JP': 'かむ', en: 'Bite' },
  '撲接': { 'ja-JP': '飛びつく', en: 'Pounce' },
  '仰頭叫': { 'ja-JP': '遠吠え', en: 'Howl' },
  '倒地': { 'ja-JP': '倒れる', en: 'Collapse' },
  '固定網格': { 'ja-JP': '固定メッシュ', en: 'Fixed mesh' },
  '骨骼蒙皮': { 'ja-JP': 'ボーンスキン', en: 'bone skinning' },
  '前進': { 'ja-JP': '前進', en: 'Forward' },
  '後退': { 'ja-JP': '後退', en: 'Backward' },
  '轉向': { 'ja-JP': '旋回', en: 'Turn' },
  '警覺 / 坐下 / 休息': { 'ja-JP': '警戒 / 座る / 休む', en: 'Alert / Sit / Rest' },
  '叫 / 咬 / 撲接 / 仰頭叫': { 'ja-JP': '鳴く / かむ / 飛びつく / 遠吠え', en: 'Meow / Bite / Pounce / Howl' },
  '落下 / 倒地': { 'ja-JP': '落下 / 倒れる', en: 'Fall / Collapse' },
};

const textRecords = new WeakMap();
const attributeRecords = new WeakMap();
let activeLocale = 'zh-TW';
let translating = false;

function normalizedLocale(value) {
  return SUPPORTED_LOCALES.has(value) ? value : 'zh-TW';
}

function translatedCore(source, locale) {
  if (locale === 'zh-TW') return source;
  if (COPY[source]?.[locale]) return COPY[source][locale];
  if (source.startsWith('当前猫窝：')) {
    const prefix = locale === 'ja-JP' ? '現在の猫ベッド：' : 'Current nest: ';
    return `${prefix}${translatedCore(source.slice(5), locale)}`;
  }
  return source
    .split(' · ')
    .map((part) => COPY[part]?.[locale] ?? part)
    .join(' · ');
}

export function t(source, locale = activeLocale) {
  const match = String(source).match(/^(\s*)(.*?)(\s*)$/s);
  if (!match) return source;
  return `${match[1]}${translatedCore(match[2], locale)}${match[3]}`;
}

function translateTextNode(node) {
  const current = node.nodeValue ?? '';
  const previous = textRecords.get(node);
  const source = previous && current === previous.translated ? previous.source : current;
  const translated = t(source);
  textRecords.set(node, { source, translated });
  if (translated !== current) node.nodeValue = translated;
}

function translateAttributes(element) {
  if (!(element instanceof Element) || element.closest('[data-i18n-ignore]')) return;
  const previous = attributeRecords.get(element) ?? {};
  const next = { ...previous };
  for (const attribute of ['aria-label', 'title', 'placeholder']) {
    if (!element.hasAttribute(attribute)) continue;
    const current = element.getAttribute(attribute) ?? '';
    const record = previous[attribute];
    const source = record && current === record.translated ? record.source : current;
    const translated = t(source);
    next[attribute] = { source, translated };
    if (translated !== current) element.setAttribute(attribute, translated);
  }
  attributeRecords.set(element, next);
}

function translateSubtree(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root);
    return;
  }
  if (!(root instanceof Element) && root !== document) return;
  if (root instanceof Element) translateAttributes(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
    else translateAttributes(node);
    node = walker.nextNode();
  }
}

function refreshLocaleButtons() {
  document.querySelectorAll('[data-locale]').forEach((button) => {
    const selected = button.dataset.locale === activeLocale;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

export function setLocale(locale) {
  activeLocale = normalizedLocale(locale);
  localStorage.setItem(STORAGE_KEY, activeLocale);
  document.documentElement.lang = activeLocale;
  document.title = 'Meow Generator';
  translating = true;
  translateSubtree(document.body);
  translating = false;
  refreshLocaleButtons();
  window.dispatchEvent(new CustomEvent('meow:localechange', { detail: { locale: activeLocale } }));
}

export function initI18n() {
  activeLocale = normalizedLocale(localStorage.getItem(STORAGE_KEY) ?? 'zh-TW');
  document.querySelectorAll('[data-locale]').forEach((button) => {
    button.addEventListener('click', () => setLocale(button.dataset.locale));
  });
  const observer = new MutationObserver((mutations) => {
    if (translating) return;
    translating = true;
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') translateTextNode(mutation.target);
      for (const node of mutation.addedNodes) translateSubtree(node);
      if (mutation.type === 'attributes') translateAttributes(mutation.target);
    }
    translating = false;
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['aria-label', 'title', 'placeholder'],
  });
  setLocale(activeLocale);
  return {
    get locale() { return activeLocale; },
    setLocale,
    translate: t,
    disconnect: () => observer.disconnect(),
  };
}
