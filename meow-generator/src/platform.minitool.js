function getMiniToolBridge() {
  return window.xhs?.miniTool ?? null;
}

function blobToDataUri(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', () => reject(reader.error ?? new Error('Image conversion failed')));
    reader.readAsDataURL(blob);
  });
}

export async function saveBlob(blob) {
  if (!blob?.type?.startsWith('image/')) {
    throw new Error('小工具只支持將圖片保存到相冊');
  }

  const bridge = getMiniToolBridge();
  if (!bridge?.writeTempFile || !bridge?.saveImageToPhotosAlbum) {
    throw new Error('當前環境未提供小紅書相冊能力');
  }

  const data = await blobToDataUri(blob);
  const tempFile = await bridge.writeTempFile({ data });
  if (!tempFile?.filePath) {
    throw new Error('臨時圖片寫入失敗');
  }
  await bridge.saveImageToPhotosAlbum({ filePath: tempFile.filePath });
}

export function getRepositoryMarkup(label) {
  return `<span class="share-card-repo" aria-label="項目地址">${label}</span>`;
}
