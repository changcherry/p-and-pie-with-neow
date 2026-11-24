import * as THREE from 'three';

const COPY = {
  'zh-TW': {
    cat: [
      '這塊地毯歸我了。',
      '別催，我在長貓。',
      '摸一下，收費一條魚。',
      '我沒有胖，是毛在膨脹。',
      '剛剛是誰偷看我？',
      '喵生苦短，先躺一會。',
      '尾巴有自己的想法。',
      '這個窩勉強及格。',
      '鏡頭過來，拍左臉。',
      '隨機可以，醜貓不行。',
      '今天也被可愛耽誤了。',
      '再摸一下，就一下。',
    ],
    fish: [
      '別看我，我在裝玩具。',
      '我只是暫時不會遊。',
      '誰把海搬走了？',
      '那隻貓看起來很餓。',
      '保持安靜，我在盯屏幕。',
      '尾巴是片，不是錐。',
      '今天也逃過一口。',
      '離貓遠點，是生存智慧。',
      '我眼神堅定，身體不一定。',
      '請把我放回水裡，謝謝。',
    ],
    duck: [
      '嘎？這裡不是池塘嗎？',
      '我圓，但我有碰撞。',
      '別踢我，我會滾。',
      '今天負責假裝鎮定。',
      '那條魚看起來可疑。',
      '貓大，我先讓路。',
      '嘎一下，氣氛就有了。',
      '我只是黃，不代表膽小。',
      '剛才的雷不是我放的。',
      '窩滿了，我睡地板。',
    ],
    weather: {
      cat: {
        thunder: ['誰把炸毛開關按了？', '打雷可以，別震我的窩。'],
        rain: ['下魚了？那我不困了。', '這雨聞起來有點鮮。'],
      },
      fish: {
        thunder: ['先別劈，我是布的！'],
        rain: ['天上掉同事了！', '這算不算魚躍龍門？'],
      },
      duck: {
        thunder: ['嘎！我什麼都沒做！'],
        rain: ['終於有點池塘氣氛了。', '雨來了，鴨也精神了。'],
      },
    },
  },
  'ja-JP': {
    cat: [
      'このラグ、いただき。',
      '急かさないで、貓育ち中。',
      'なでるなら魚一匹。',
      '太ったんじゃない、毛です。',
      '今見てたの、だれ？',
      '貓生は短い。まず寢よう。',
      'しっぽには考えがある。',
      'この寢床、まあ合格。',
      'カメラ、左顔からね。',
      'ランダムでも可愛くして。',
      '今日も可愛さが忙しい。',
      'もう一回だけ、なでて。',
    ],
    fish: [
      '見ないで、玩具のふり中。',
      '今だけ泳げないんです。',
      '海はどこへ行った？',
      'あの貓、お腹すいてそう。',
      '靜かに。畫面を見張ってる。',
      'しっぽは板、コーンじゃない。',
      '今日も一口を逃れた。',
      '貓との距離は命の距離。',
      '目は強気、體は弱気。',
      '水へ戻してください。',
    ],
    duck: [
      'ガー？池じゃないの？',
      '丸いけど衝突します。',
      '蹴らないで、転がるよ。',
      '今日は平靜のふり擔當。',
      'あの魚、ちょっと怪しい。',
      '貓が大きいので道を譲る。',
      'ガーで空気が整います。',
      '黃色でも怖がりじゃない。',
      'さっきの雷、私じゃない。',
      '寢床が満員。床で寢る。',
    ],
    weather: {
      cat: {
        thunder: ['だれが逆毛スイッチ押した？', '雷はいいけど寢床は揺らすな。'],
        rain: ['魚が降る？目が覚めた。', 'この雨、ちょっと新鮮。'],
      },
      fish: {
        thunder: ['落とさないで、布製です！'],
        rain: ['空から仲間が降ってきた！', 'これが魚の出世コース？'],
      },
      duck: {
        thunder: ['ガー！何もしてない！'],
        rain: ['やっと池っぽくなってきた。', '雨だ。アヒルも元気。'],
      },
    },
  },
  en: {
    cat: [
      'This rug is mine now.',
      'Do not rush me. I am catting.',
      'One pet costs one fish.',
      'Not chubby. Just extra fluffy.',
      'Who was staring at me?',
      'Life is short. Nap first.',
      'My tail has its own plans.',
      'This nest barely passes.',
      'Camera, get my left side.',
      'Random is fine. Ugly is not.',
      'Too busy being cute today.',
      'One more pet. Just one.',
    ],
    fish: [
      'Do not look. I am a toy.',
      'I am temporarily unable to swim.',
      'Who moved the ocean?',
      'That cat looks hungry.',
      'Quiet. I am watching the screen.',
      'Flat tail. Not a cone.',
      'Survived another snack time.',
      'Distance from cat equals survival.',
      'Bold eyes, uncertain body.',
      'Please return me to water.',
    ],
    duck: [
      'Quack? This is not a pond?',
      'Round, but collision-enabled.',
      'Do not kick me. I roll.',
      'Pretending to be calm today.',
      'That fish looks suspicious.',
      'Big cat. I will make room.',
      'One quack fixes the mood.',
      'Yellow does not mean timid.',
      'That thunder was not me.',
      'Nest full. Floor it is.',
    ],
    weather: {
      cat: {
        thunder: ['Who pressed the fluff switch?', 'Thunder is fine. Leave my nest.'],
        rain: ['Raining fish? I am awake.', 'This rain smells suspiciously fresh.'],
      },
      fish: {
        thunder: ['Do not zap me. I am fabric!'],
        rain: ['It is raining coworkers!', 'Is this upward mobility for fish?'],
      },
      duck: {
        thunder: ['Quack! I did nothing!'],
        rain: ['Finally, some pond atmosphere.', 'Rain! Duck energy restored.'],
      },
    },
  },
};

const ROLE_WEIGHTS = [
  ['cat', 0.5],
  ['fish', 0.26],
  ['duck', 0.24],
];

const anchorWorld = new THREE.Vector3();
const anchorScreen = new THREE.Vector3();

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function pickRandom(items, excluded = '') {
  if (!items.length) return '';
  const available = items.length > 1 ? items.filter((item) => item !== excluded) : items;
  return available[Math.floor(Math.random() * available.length)] ?? items[0];
}

function weightedRole(availableRoles) {
  const choices = ROLE_WEIGHTS.filter(([role]) => availableRoles.has(role));
  const total = choices.reduce((sum, [, weight]) => sum + weight, 0);
  let cursor = Math.random() * total;
  for (const [role, weight] of choices) {
    cursor -= weight;
    if (cursor <= 0) return role;
  }
  return choices.at(-1)?.[0] ?? 'cat';
}

function localizedCopy(locale) {
  return COPY[locale] ?? COPY['zh-TW'];
}

function actorAnchor(actor, role) {
  if (role === 'cat') {
    actor.updateWorldMatrix(true, false);
    anchorWorld.copy(actor.userData.headC ?? new THREE.Vector3(0, 1, 0));
    anchorWorld.y += (actor.userData.hr ?? 0.42) * 1.02;
    return actor.localToWorld(anchorWorld);
  }

  actor.mesh.updateWorldMatrix(true, false);
  actor.mesh.getWorldPosition(anchorWorld);
  anchorWorld.y += Math.max(0.18, actor.radius * (role === 'duck' ? 1.42 : 1.12));
  return anchorWorld;
}

export function createSpeechBubbleController({
  element,
  viewport,
  camera,
  getCat,
  getToys,
  getLocale,
  getWeather,
}) {
  let elapsed = 0;
  let nextAt = randomBetween(3.2, 6.2);
  let active = null;
  let activeUntil = 0;
  let lastText = '';
  let bubbleWidth = 180;

  function setDiagnostics(visible, role = '', text = '') {
    viewport.dataset.speechVisible = String(visible);
    viewport.dataset.speechSpeaker = role;
    viewport.dataset.speechText = text;
  }

  function availableActors() {
    const result = new Map();
    const cat = getCat();
    if (cat?.visible) result.set('cat', [cat]);
    for (const toy of getToys()) {
      if (!toy.mesh.visible || !['fish', 'duck'].includes(toy.kind)) continue;
      if (!result.has(toy.kind)) result.set(toy.kind, []);
      result.get(toy.kind).push(toy);
    }
    return result;
  }

  function messageFor(role) {
    const localeCopy = localizedCopy(getLocale());
    const weather = getWeather();
    const contexts = [];
    if (weather.thunder) contexts.push('thunder');
    if (weather.mode === 'fishRain') contexts.push('rain');
    const contextual = contexts.flatMap((key) => localeCopy.weather[role]?.[key] ?? []);
    const useContext = contextual.length > 0 && Math.random() < 0.58;
    return pickRandom(useContext ? contextual : localeCopy[role], lastText);
  }

  function positionActive() {
    if (!active) return false;
    const anchor = actorAnchor(active.actor, active.role);
    anchorScreen.copy(anchor).project(camera);
    const visible = (
      anchorScreen.z >= -1
      && anchorScreen.z <= 1
      && anchorScreen.x >= -1.2
      && anchorScreen.x <= 1.2
      && anchorScreen.y >= -1.2
      && anchorScreen.y <= 1.2
    );
    element.classList.toggle('is-offscreen', !visible);
    if (!visible) return false;

    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    const rawX = (anchorScreen.x * 0.5 + 0.5) * width;
    const rawY = (-anchorScreen.y * 0.5 + 0.5) * height;
    const halfBubble = bubbleWidth * 0.5;
    const x = THREE.MathUtils.clamp(rawX, halfBubble + 12, width - halfBubble - 12);
    const y = THREE.MathUtils.clamp(rawY, 76, height - 28);
    const tailX = THREE.MathUtils.clamp(rawX - x + halfBubble, 20, bubbleWidth - 20);
    element.style.left = `${x.toFixed(1)}px`;
    element.style.top = `${y.toFixed(1)}px`;
    element.style.setProperty('--bubble-tail-x', `${tailX.toFixed(1)}px`);
    return true;
  }

  function showNow(preferredRole = '') {
    const actors = availableActors();
    if (!actors.size) return false;
    const roles = new Set(actors.keys());
    const role = roles.has(preferredRole) ? preferredRole : weightedRole(roles);
    const roleActors = actors.get(role);
    const actor = pickRandom(roleActors);
    const text = messageFor(role);
    if (!actor || !text) return false;

    active = { role, actor };
    lastText = text;
    element.textContent = text;
    element.dataset.speaker = role;
    element.classList.remove('is-visible', 'is-offscreen');
    bubbleWidth = Math.max(120, element.offsetWidth);
    positionActive();
    requestAnimationFrame(() => element.classList.add('is-visible'));
    activeUntil = elapsed + THREE.MathUtils.clamp(2.8 + text.length * 0.065, 3.15, 4.5);
    setDiagnostics(true, role, text);
    return true;
  }

  function hide() {
    element.classList.remove('is-visible');
    active = null;
    nextAt = elapsed + randomBetween(4.2, 8);
    setDiagnostics(false);
  }

  function update(dt) {
    elapsed += dt;
    if (active) {
      positionActive();
      if (elapsed >= activeUntil) hide();
      return;
    }
    if (elapsed >= nextAt && !showNow()) {
      nextAt = elapsed + 1;
    }
  }

  function refreshLocale() {
    if (!active) return;
    const text = messageFor(active.role);
    lastText = text;
    element.textContent = text;
    bubbleWidth = Math.max(120, element.offsetWidth);
    positionActive();
    setDiagnostics(true, active.role, text);
  }

  setDiagnostics(false);
  return {
    update,
    showNow,
    hide,
    refreshLocale,
    get activeRole() { return active?.role ?? ''; },
    get activeText() { return active ? element.textContent : ''; },
  };
}

export const SPEECH_BUBBLE_COPY = COPY;
