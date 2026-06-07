import { alternativeRankings, controversialClaims, evidenceTasks, stagingItems } from "../lib/data";
import { calculateStagingBacklogRankings } from "../lib/staging-ranking";

const rows = calculateStagingBacklogRankings(stagingItems as any, controversialClaims, evidenceTasks, alternativeRankings);
console.log(JSON.stringify({
  pendingBacklog: rows.sort((a, b) => b.backlogScore - a.backlogScore).slice(0, 10),
  highRisk: rows.sort((a, b) => b.highRiskScore - a.highRiskScore).slice(0, 10),
  evidenceGap: rows.sort((a, b) => b.evidenceGapScore - a.evidenceGapScore).slice(0, 10),
  highValueTasks: rows.sort((a, b) => b.highValueTaskScore - a.highValueTaskScore).slice(0, 10)
}, null, 2));
