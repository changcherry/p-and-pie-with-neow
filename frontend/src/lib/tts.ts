
let currentAudio: HTMLAudioElement | null = null;
let currentUrl: string | null = null;
let requestId = 0;

export function stopSpeech() {
  requestId++;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  if (currentUrl) {
    URL.revokeObjectURL(currentUrl);
    currentUrl = null;
  }
}

export async function speakText(
  text: string,
  onEnd?: () => void
) {
  stopSpeech();
  const id = requestId;

  if (!text.trim()) {
    onEnd?.();
    return;
  }

  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("語音生成失敗");
    }

    const blob = await response.blob();

    if (id !== requestId) return;

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    currentUrl = url;
    currentAudio = audio;

    const finish = () => {
      if (id === requestId) {
        stopSpeech();
        onEnd?.();
      }
    };

    audio.onended = finish;
    audio.onerror = finish;

    await audio.play();

  } catch (error) {
    if (id === requestId) {
      stopSpeech();
      onEnd?.();
    }

    console.error("TTS 播放失敗：", error);
  }
}
