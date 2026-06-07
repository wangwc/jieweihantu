import { seedNormalize } from "@/lib/seed/pipeline";

seedNormalize().then((report) => console.log(JSON.stringify(Object.fromEntries(Object.entries(report).map(([key, rows]) => [key, rows.length])), null, 2)));
