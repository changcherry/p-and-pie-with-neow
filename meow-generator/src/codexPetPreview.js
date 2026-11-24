import prototypeContactSheetUrl from './assets/codex-pet/meow-orange-prototype-contact-sheet.png';

function makeButton(label, className = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  return button;
}

function downloadJson(payload, filename) {
  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    { type: 'application/json;charset=utf-8' }
  );
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

function downloadDataUrl(dataUrl, filename) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

async function copyText(text) {
  let nativeCopied = false;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      nativeCopied = true;
    } catch {
      nativeCopied = false;
    }
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const legacyCopied = document.execCommand('copy');
  textarea.remove();
  if (!nativeCopied && !legacyCopied) {
    throw new Error('Clipboard write is unavailable');
  }
}

export function createCodexPetPreview({
  trigger,
  capturePreview,
  getPetDescriptor,
}) {
  if (!trigger) return null;

  const overlay = document.createElement('div');
  overlay.className = 'codex-pet-overlay';
  overlay.hidden = true;
  overlay.setAttribute('role', 'presentation');

  const dialog = document.createElement('section');
  dialog.className = 'codex-pet-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'codex-pet-title');

  const closeButton = makeButton('×', 'codex-pet-close');
  closeButton.setAttribute('aria-label', '關閉');

  const eyebrow = document.createElement('div');
  eyebrow.className = 'codex-pet-eyebrow';
  const paw = document.createElement('span');
  paw.textContent = '🐾';
  const experimental = document.createElement('span');
  experimental.className = 'codex-pet-badge';
  experimental.textContent = 'Experimental';
  eyebrow.append(paw, experimental);

  const title = document.createElement('h2');
  title.id = 'codex-pet-title';
  title.textContent = '匯出給 Codex';

  const subtitle = document.createElement('p');
  subtitle.className = 'codex-pet-subtitle';
  subtitle.textContent = '準備兩個文件，不會直接打開或喚醒 Codex';

  const header = document.createElement('header');
  header.className = 'codex-pet-header';
  header.append(eyebrow, title, subtitle);

  const previewImage = document.createElement('img');
  previewImage.className = 'codex-pet-preview-image';
  previewImage.alt = '當前小貓預覽';
  previewImage.draggable = false;

  const previewLabel = document.createElement('span');
  previewLabel.className = 'codex-pet-preview-label';
  previewLabel.textContent = '當前小貓';

  const previewFrame = document.createElement('figure');
  previewFrame.className = 'codex-pet-preview';
  previewFrame.append(previewLabel, previewImage);

  const description = document.createElement('p');
  description.className = 'codex-pet-description';
  description.textContent = '這裡會準備當前小貓的參數 JSON 和參考圖 PNG。下載後，把兩個文件一起發送給 Codex。';

  const steps = document.createElement('ol');
  steps.className = 'codex-pet-steps';
  ['下載 JSON 和圖片', '把兩個文件發給 Codex', '複製下面的指令'].forEach((label, index) => {
    const item = document.createElement('li');
    const number = document.createElement('span');
    number.className = 'codex-pet-step-number';
    number.textContent = String(index + 1);
    const text = document.createElement('span');
    text.textContent = label;
    item.append(number, text);
    steps.appendChild(item);
  });

  const status = document.createElement('div');
  status.className = 'codex-pet-status';
  const statusTitle = document.createElement('strong');
  statusTitle.textContent = '為什麼需要兩個文件？';
  const statusCopy = document.createElement('span');
  statusCopy.textContent = 'JSON 保存體型和配色參數；PNG 幫助 Codex 確認小貓的最終外觀。';
  status.append(statusTitle, statusCopy);

  const promptBox = document.createElement('section');
  promptBox.className = 'codex-pet-prompt';
  const promptTitle = document.createElement('strong');
  promptTitle.textContent = '把這段話和兩個文件一起發給 Codex：';
  const promptText = document.createElement('p');
  promptText.textContent = '請使用我附上的 Meow Generator 參數 JSON 和參考圖 PNG，為這隻貓創建並安裝一個 Codex 本機寵物。請保持它的體型、花紋、眼睛和主色；生成完整透明動作圖集；安裝前先給我看動作總覽和左右方向預覽；確認後安裝為新的獨立寵物，不要覆蓋現有寵物。';
  promptBox.append(promptTitle, promptText);

  const note = document.createElement('p');
  note.className = 'codex-pet-note';
  note.textContent = '請分別下載 JSON 和 PNG，再複製指令。';

  const actionSampleButton = makeButton('查看動作樣機', 'btn codex-pet-sample-button');
  const saveJsonButton = makeButton('下載參數 JSON', 'btn primary codex-pet-json-button');
  const saveImageButton = makeButton('下載參考圖 PNG', 'btn codex-pet-image-button');
  const copyPromptButton = makeButton('複製給 Codex 的指令', 'btn codex-pet-copy-button');

  const actions = document.createElement('div');
  actions.className = 'codex-pet-actions';
  actions.append(saveJsonButton, saveImageButton, copyPromptButton, actionSampleButton);

  const details = document.createElement('div');
  details.className = 'codex-pet-details';
  details.append(description, steps, status, promptBox, note, actions);

  const body = document.createElement('div');
  body.className = 'codex-pet-body';
  body.append(previewFrame, details);

  dialog.append(closeButton, header, body);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  let active = false;
  let showingSample = false;
  let previousFocus = null;
  let currentPreviewUrl = '';

  function showCurrentPreview() {
    showingSample = false;
    previewFrame.classList.remove('is-contact-sheet');
    previewLabel.textContent = '當前小貓';
    previewImage.alt = '當前小貓預覽';
    currentPreviewUrl = capturePreview();
    previewImage.src = currentPreviewUrl;
    actionSampleButton.textContent = '查看動作樣機';
  }

  function showActionSample() {
    showingSample = true;
    previewFrame.classList.add('is-contact-sheet');
    previewLabel.textContent = '橘橘動作樣機';
    previewImage.alt = '橘橘 Codex 寵物動作樣機';
    previewImage.src = prototypeContactSheetUrl;
    actionSampleButton.textContent = '返回當前小貓';
  }

  function open() {
    if (active) return;
    previousFocus = document.activeElement;
    showCurrentPreview();
    overlay.hidden = false;
    active = true;
    document.body.classList.add('codex-pet-modal-open');
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      closeButton.focus();
    });
  }

  function close() {
    if (!active) return;
    overlay.classList.remove('is-open');
    document.body.classList.remove('codex-pet-modal-open');
    active = false;
    window.setTimeout(() => {
      overlay.hidden = true;
      previousFocus?.focus?.();
    }, 180);
  }

  trigger.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  actionSampleButton.addEventListener('click', () => {
    if (showingSample) showCurrentPreview();
    else showActionSample();
  });
  saveJsonButton.addEventListener('click', () => {
    const descriptor = getPetDescriptor();
    const referenceImage = `meow-codex-pet-${descriptor.seed}-reference.png`;
    downloadJson({
      ...descriptor,
      handoff: {
        referenceImage,
        prompt: promptText.textContent,
      },
    }, `meow-codex-pet-${descriptor.seed}.json`);
    note.textContent = '參數 JSON 已下載。還需要下載參考圖 PNG。';
  });
  saveImageButton.addEventListener('click', () => {
    const descriptor = getPetDescriptor();
    downloadDataUrl(
      currentPreviewUrl || capturePreview(),
      `meow-codex-pet-${descriptor.seed}-reference.png`
    );
    note.textContent = '參考圖 PNG 已下載。請確認 JSON 也已經下載。';
  });
  copyPromptButton.addEventListener('click', async () => {
    try {
      await copyText(promptText.textContent);
      note.textContent = '指令已複製。現在把 JSON、PNG 和這段指令一起發給 Codex。';
      copyPromptButton.textContent = '已複製';
      window.setTimeout(() => {
        copyPromptButton.textContent = '複製給 Codex 的指令';
      }, 1800);
    } catch (error) {
      console.warn('Copy Codex pet prompt failed', error);
      note.textContent = '複製失敗，請手動選中上面的指令。';
    }
  });
  window.addEventListener('keydown', (event) => {
    if (active && event.key === 'Escape') close();
  });

  return {
    get active() {
      return active;
    },
    open,
    close,
  };
}
