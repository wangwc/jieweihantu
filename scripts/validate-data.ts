import { artifacts, auditRecords, claims, controversialClaims, evidence, evidenceTasks, leads, sourceRegistry, stagingItems, territoryLayers, textChunks } from "../lib/data";
import { validateDataset } from "../lib/validation";

const result = validateDataset({ claims, evidence, leads, sources: sourceRegistry, controversialClaims, evidenceTasks, stagingItems: stagingItems as any, textChunks, artifacts, territoryLayers, auditRecords });
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
