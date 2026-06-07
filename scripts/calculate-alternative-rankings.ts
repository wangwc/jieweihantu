import { controversialClaims, evidenceTasks } from "../lib/data";
import { calculateAlternativeRankings } from "../lib/alternative-narrative";
import { writeJson } from "./lib/io";

const rankings = calculateAlternativeRankings(controversialClaims, evidenceTasks);
writeJson("alternative-rankings.json", rankings);
console.log(JSON.stringify({ count: rankings.length, output: "data/alternative-rankings.json" }, null, 2));
