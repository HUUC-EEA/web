import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import subsetFont from "subset-font";

const ROOT = process.cwd();
const SCAN_DIRS = ["app"];
const OUT_DIR = join(ROOT, "public", "fonts");

const SOURCES = [
  {
    file: "node_modules/@fontsource/fusion-pixel-12px-proportional-sc/files/fusion-pixel-12px-proportional-sc-latin-400-normal.woff2",
    out: "fusion-pixel-12px-proportional-sc.woff2",
  },
  {
    file: "node_modules/@fontsource/fusion-pixel-12px-monospaced-sc/files/fusion-pixel-12px-monospaced-sc-latin-400-normal.woff2",
    out: "fusion-pixel-12px-monospaced-sc.woff2",
  },
];

async function collectSourceFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await collectSourceFiles(full)));
    else if ([".tsx", ".ts", ".css"].includes(extname(entry.name))) out.push(full);
  }
  return out;
}

const files = [];
for (const dir of SCAN_DIRS) {
  files.push(...(await collectSourceFiles(join(ROOT, dir))));
}

const chars = new Set();
for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    // 汉字、扩展 A、兼容表意文字
    if ((cp >= 0x4e00 && cp <= 0x9fff) || (cp >= 0x3400 && cp <= 0x4dbf) || (cp >= 0xf900 && cp <= 0xfaff)) {
      chars.add(ch);
    }
  }
}

// ASCII 可打印字符 + 中文标点，保证英文/数字/符号也走像素字形
for (let cp = 0x20; cp <= 0x7e; cp++) chars.add(String.fromCodePoint(cp));
for (const ch of "、。！？：；，·—…“”‘’（）《》【】％＋｜～") chars.add(ch);

const charset = [...chars].join("");
await mkdir(OUT_DIR, { recursive: true });

for (const src of SOURCES) {
  const buf = await readFile(join(ROOT, src.file));
  const subset = await subsetFont(buf, charset, { targetFormat: "woff2" });
  await writeFile(join(OUT_DIR, src.out), subset);
  console.log(
    `${src.out}: ${(buf.length / 1024).toFixed(0)}KB -> ${(subset.length / 1024).toFixed(1)}KB (${chars.size} chars)`
  );
}
