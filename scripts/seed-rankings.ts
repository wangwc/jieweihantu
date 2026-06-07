import { seedRankings } from "@/lib/seed/pipeline";

seedRankings().then((report) => console.log(JSON.stringify(report, null, 2)));
