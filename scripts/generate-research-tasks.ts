import { controversialClaims, evidenceTasks } from "../lib/data";

const missing = controversialClaims.filter((claim) => claim.requiredEvidenceTasks.some((taskId) => !evidenceTasks.some((task) => task.id === taskId)));
console.log(JSON.stringify({ missingClaims: missing.map((claim) => ({ id: claim.id, title: claim.title, requiredEvidenceTasks: claim.requiredEvidenceTasks })) }, null, 2));
