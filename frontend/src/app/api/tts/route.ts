
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "沒有輸入文字" },
        { status: 400 }
      );
    }

    const response = await fetch(
      process.env.TTS_API_URL ||
        "http://127.0.0.1:8880/v1/audio/speech",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "kokoro",
          input: text,
          voice: process.env.TTS_VOICE || "zf_xiaobei",
          response_format: "mp3",
          speed: 1.0,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const audio = await response.arrayBuffer();

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);

    return NextResponse.json(
      { error: "語音生成失敗" },
      { status: 500 }
    );
  }
}
