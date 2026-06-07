import { seedFetch } from "@/lib/seed/pipeline";

seedFetch(process.argv.includes("--allow-network")).then((report) => console.log(JSON.stringify(report, null, 2)));
