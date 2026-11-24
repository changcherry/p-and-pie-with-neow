import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"善盾 AI｜長者防詐實境陪練平台",description:"透過 AI 動態詐騙情境，練習辨識、查證、拒絕與求助。",openGraph:{title:"善盾 AI｜長者防詐實境陪練平台",description:"在安全環境中練習面對詐騙壓力。",type:"website"},other:{"page-type":"software","site-kind":"software"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-Hant" data-type="software" data-radius="soft" data-buttons="solid" className="m-enter"><body>{children}</body></html>}
