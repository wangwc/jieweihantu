import { readInput } from "./lib/io";

const file = process.argv.find((arg) => !arg.startsWith("--") && arg !== process.argv[1]);
if (!file) throw new Error("请提供开放数据 CSV/JSON 文件路径。");
const rows = readInput(file) as Record<string, unknown>[];
console.log(JSON.stringify({ count: rows.length, sample: rows.slice(0, 3) }, null, 2));
