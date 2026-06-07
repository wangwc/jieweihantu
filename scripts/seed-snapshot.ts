import { seedSnapshot } from "@/lib/seed/pipeline";

seedSnapshot().then((report) => console.log(JSON.stringify({ id: report.id, createdAt: report.createdAt }, null, 2)));
