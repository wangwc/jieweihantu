import { seedLink } from "@/lib/seed/pipeline";

seedLink().then((report) => console.log(JSON.stringify(report, null, 2)));
