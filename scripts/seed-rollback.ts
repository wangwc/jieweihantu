import { seedRollback } from "@/lib/seed/pipeline";

seedRollback().then((report) => console.log(JSON.stringify({ restoredSnapshot: report.id }, null, 2)));
