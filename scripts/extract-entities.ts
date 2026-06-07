import fs from "node:fs";
import path from "node:path";
import { extractEntities } from "../lib/import/entity-extractor";

const file = process.argv.find((arg) => !arg.startsWith("--") && arg !== process.argv[1]);
if (!file) throw new Error("请提供文本文件路径。");
const text = fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
console.log(JSON.stringify(extractEntities(text), null, 2));
