import { seedImport } from "@/lib/seed/pipeline";

function arg(name: string) {
  return process.argv.find((item) => item.startsWith(`--${name}=`))?.split("=").slice(1).join("=") || "";
}

seedImport(arg("mode") || "staging").then((report) => console.log(JSON.stringify(report, null, 2)));
