import fs from "node:fs";
import path from "node:path";

const file = process.argv.find((arg) => !arg.startsWith("--") && arg !== process.argv[1]);
if (!file) throw new Error("请提供文本文件路径。");
const text = fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
const chunks = text
  .split(/\n{2,}|。|；|;|\r\n/)
  .map((item) => item.trim())
  .filter((item) => item.length >= 12)
  .map((item, index) => ({ index: index + 1, text: item }));
console.log(JSON.stringify({ count: chunks.length, chunks }, null, 2));
