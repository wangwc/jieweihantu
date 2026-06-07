import { seedValidate } from "@/lib/seed/pipeline";

seedValidate().then((report) => {
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(1);
});
