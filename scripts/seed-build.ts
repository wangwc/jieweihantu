import { seedBuild } from "@/lib/seed/pipeline";

function arg(name: string) {
  return process.argv.find((item) => item.startsWith(`--${name}=`))?.split("=").slice(1).join("=") || "";
}

seedBuild(process.argv.includes("--allow-network"), arg("mode") || "staging").then((report) => {
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(1);
});
