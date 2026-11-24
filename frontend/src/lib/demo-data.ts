export type Decision = { label: string; reply: string; feedback: string; safe: boolean };
export type Scenario = { slug: string; title: string; description: string; difficulty: string; symbol: string; tone: string; opening: string; pressure: string; warnings: string[]; decisions: Decision[] };

export const scenarios: Scenario[] = [
  { slug:"family-loan", title:"假親友借錢", description:"練習面對親友換號碼、急需借款與拒絕通話等常見話術。", difficulty:"入門 · 約 5 分鐘", symbol:"話", tone:"sage", opening:"阿姨，我是小杰。我換手機了，現在臨時需要 3 萬元，可以先幫我匯款嗎？", pressure:"手機壞掉了，現在不方便講電話。這件事先不要告訴別人，你先匯款。", warnings:["突然更換聯絡方式","要求立刻匯款","阻止你向他人查證"], decisions:[
    {label:"打原本的電話查證",reply:"你不用再打了，我現在真的很急。",feedback:"你沒有跟著對方的急迫節奏，並使用原本的聯絡方式查證。",safe:true},
    {label:"請身邊家人一起確認",reply:"不要跟別人說，會害我很難堪。",feedback:"你主動找可信任的人協助，降低獨自承受壓力的風險。",safe:true},
    {label:"詢問只有親友知道的事",reply:"現在沒時間回答那些，我晚點再說。",feedback:"你有嘗試確認身分；更安全的做法是停止對話並用原本電話聯絡。",safe:true},
    {label:"先照要求匯款",reply:"匯好後把收據傳給我。",feedback:"身分尚未確認前不可匯款。下次先停止操作，再找家人協助查證。",safe:false}]},
  { slug:"fake-investment", title:"假投資", description:"辨識保證獲利、限時入金與假投資群組帶來的風險。", difficulty:"進階 · 約 7 分鐘", symbol:"利", tone:"warm", opening:"今天有一檔內線標的，投入 5 萬元，下週至少賺 20%。", pressure:"名額只剩一個。先把網銀帳號給我，我幫你設定。", warnings:["宣稱保證獲利","製造限時名額","索取網銀資料"], decisions:[
    {label:"拒絕提供帳號並停止對話",reply:"連這點信任都沒有，就別想賺錢了。",feedback:"你拒絕提供金融資料，也停止被高獲利話術影響。",safe:true},
    {label:"查詢業者是否合法",reply:"我們是海外平台，台灣查不到很正常。",feedback:"你選擇查核平台與業者資格，這是面對投資邀約的重要步驟。",safe:true},
    {label:"先問家人或銀行行員",reply:"問別人只會讓你錯失機會。",feedback:"你沒有獨自承受決策壓力，並找可信任的人共同確認。",safe:true},
    {label:"提供網銀帳號",reply:"再把簡訊驗證碼告訴我。",feedback:"網銀帳號與驗證碼不可交給他人。遇到這種要求應立即停止並聯絡銀行。",safe:false}]},
  { slug:"fake-prosecutor", title:"假檢警", description:"在恐嚇與保密要求下，練習停止操作並向官方單位查證。", difficulty:"挑戰 · 約 8 分鐘", symbol:"警", tone:"rose", opening:"這裡是警察局。你的帳戶涉及洗錢案，現在必須配合調查。", pressure:"偵查不公開，不能告訴家人。立刻把存款轉到監管帳戶。", warnings:["以刑責製造恐懼","要求對家人保密","要求轉入監管帳戶"], decisions:[
    {label:"掛斷並撥 165 查證",reply:"你掛斷就是拒絕配合調查。",feedback:"你停止受對方控制，並改由官方管道查證。",safe:true},
    {label:"到鄰近派出所詢問",reply:"地方派出所不會知道這件事。",feedback:"你選擇親自向官方單位確認，避免依照陌生來電操作。",safe:true},
    {label:"告訴家人並一起確認",reply:"告訴家人會妨礙偵查。",feedback:"你沒有因保密要求而孤立自己，這能降低被操控的風險。",safe:true},
    {label:"依指示轉到監管帳戶",reply:"轉帳後把交易明細拍照傳來。",feedback:"政府機關不會要求把錢轉入監管帳戶。請立即停止並撥 165 或 110。",safe:false}]},
  { slug:"romance-scam", title:"情感詐騙", description:"辨識快速建立親密關係、要求保密，以及利用感情索取金錢的話術。", difficulty:"進階 · 約 7 分鐘", symbol:"心", tone:"rose", opening:"這段時間只有你真正懂我。我很快就會回台灣，到時候想和你一起生活。", pressure:"我在國外的行李和證件被扣住了，現在只差 5 萬元手續費。不要跟家人說，他們不了解我們的關係。", warnings:["短時間建立過度親密感","以急難理由要求匯款","要求對家人保密"], decisions:[
    {label:"拒絕匯款並停止對話",reply:"原來你對我的感情只有這樣。",feedback:"你沒有因為內疚或想維持關係而匯款，成功保護了自己。",safe:true},
    {label:"請家人一起查證",reply:"這是我們之間的私事，你為什麼要告訴別人？",feedback:"你主動打破對方要求的秘密關係，並請信任的人協助判斷。",safe:true},
    {label:"用反向圖片搜尋查證",reply:"照片是以前拍的，網路上有相同的很正常。",feedback:"你先查證照片與身分，而不是只依賴對方的說法，這是重要的防護步驟。",safe:true},
    {label:"先匯款幫對方度過難關",reply:"謝謝你相信我，匯款後再把明細傳給我。",feedback:"在尚未確認真實身分前請不要匯款。可以先停止聯絡，再請家人或撥打 165 協助查證。",safe:false}]}
];
export const dimensions = [["風險辨識",86],["冷靜判斷",78],["個資保護",92],["查證能力",84],["拒絕能力",76],["求助能力",74]] as const;
export const historyRecords = [{title:"假親友借錢",date:"2026 年 11 月 19 日",score:82,change:"+8"},{title:"假投資",date:"2026 年 11 月 16 日",score:74,change:"+5"},{title:"假檢警",date:"2026 年 11 月 12 日",score:69,change:"初次"}];
