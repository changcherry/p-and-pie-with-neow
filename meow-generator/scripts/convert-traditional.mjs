import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as OpenCC from 'opencc-js';

const root = new URL('../', import.meta.url).pathname;
const convert = OpenCC.Converter({ from: 'cn', to: 'tw' });
const taiwanize = (text) => text
  .replaceAll('拖拽', '拖曳')
  .replaceAll('導出', '匯出')
  .replaceAll('自定義', '自訂')
  .replaceAll('灰狸花', '灰虎斑')
  .replaceAll('棕狸花', '棕虎斑')
  .replaceAll('奶牛', '賓士貓')
  .replaceAll('播放背景音乐', '播放背景音樂');
const sourceFiles = (await readdir(join(root, 'src')))
  .filter((name) => name.endsWith('.js') && name !== 'i18n.js')
  .map((name) => `src/${name}`);
const files = ['index.html', ...sourceFiles];

for (const relative of files) {
  const path = join(root, relative);
  const source = await readFile(path, 'utf8');
  await writeFile(path, taiwanize(convert(source)).replaceAll('zh-CN', 'zh-TW'));
}

const i18nPath = join(root, 'src/i18n.js');
const i18n = await readFile(i18nPath, 'utf8');
const convertedI18n = i18n
  .replaceAll('zh-CN', 'zh-TW')
  .split('\n')
  .map((line) => line.replace(/^(\s{2})'([^']+)'(\s*:\s*)/, (_, indent, key, suffix) => `${indent}'${taiwanize(convert(key))}'${suffix}`))
  .join('\n');
await writeFile(i18nPath, convertedI18n);

