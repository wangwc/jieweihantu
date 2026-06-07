import { claims, evidence, leads } from "../lib/data";
import { calculateRankingMetrics } from "../lib/ranking";
import { writeJson } from "./lib/io";

const rankings = calculateRankingMetrics(claims, evidence, leads);
writeJson("rankings.json", rankings);
console.log(JSON.stringify({ count: rankings.length, output: "data/rankings.json" }, null, 2));
