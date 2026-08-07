// Windows 限定修補：next 14.2.x 內建的 @vercel/og bundle 在模組頂層用
//   fileURLToPath(join(import.meta.url, "../resvg.wasm"))
// 讀 wasm / 內建字型。Windows 上 path.join 會把 file:/// URL 攪成反斜線路徑，
// fileURLToPath 直接拋 Invalid URL —— 所以任何 opengraph-image 在本地 build 都會炸。
// （Linux 上 join 產出剛好可解析，Vercel / CI 從沒遇過。）
//
// 修法：new URL("./x", import.meta.url) —— 這三個資源跟 index.node.js 同目錄。
// 不能用 new URL("../x", ...)：URL 解析的 .. 是從「檔案」再上一層，會爬到
// @vercel/ 目錄去。14.2.35 已是 14.x 末代，未來若升到 15+，bundle 已是修好的
// 版本，此腳本會自動變 no-op。

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const target = join(
  process.cwd(),
  "node_modules/next/dist/compiled/@vercel/og/index.node.js"
);

let src;
try {
  src = readFileSync(target, "utf8");
} catch {
  console.log("patch-og: 找不到 bundle，略過");
  process.exit(0);
}

// 三種歷史狀態都收斂到同一目標（`new URL("./x", import.meta.url)`）
const fixes = [
  /fileURLToPath\(join\(import\.meta\.url, "\.\.\/([^"]*)"\)\)/g,
  /fileURLToPath\(new URL\("\.\.\/([^"]*)"\)\)/g,
  /fileURLToPath\(new URL\("\.\.\/([^"]*)", import\.meta\.url\)\)/g,
];

let changed = false;
for (const re of fixes) {
  src = src.replace(re, (_m, name) => {
    changed = true;
    return `fileURLToPath(new URL("./${name}", import.meta.url))`;
  });
}

if (!changed) {
  console.log(
    src.includes('new URL("./resvg.wasm", import.meta.url)')
      ? "patch-og: 已是修好的版本，略過"
      : "patch-og: 找不到目標字串（bundle 結構變了？），略過"
  );
  process.exit(0);
}

writeFileSync(target, src);
console.log("patch-og: 已修補 @vercel/og Windows 路徑 bug");
