import { claims, evidence, leads, sourceRegistry } from "../lib/data";
import { validateDataset } from "../lib/validation";

const result = validateDataset({ claims, evidence, leads, sources: sourceRegistry });
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
