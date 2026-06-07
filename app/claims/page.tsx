"use client";

import { useMemo, useState } from "react";
import { ClaimCard } from "@/components/claim-card";
import { DemoBanner } from "@/components/demo-banner";
import { FilterBar } from "@/components/filter-bar";
import { claims, evidence } from "@/lib/data";

export default function ClaimsPage() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("全部主题");
  const [assessment, setAssessment] = useState("全部判断");
  const topics = ["全部主题", ...Array.from(new Set(claims.map((claim) => claim.topic)))];
  const assessments = ["全部判断", ...Array.from(new Set(claims.map((claim) => claim.currentAssessment)))];
  const filtered = useMemo(() => claims.filter((claim) => {
    const keyword = `${claim.title} ${claim.qingNarrative.text} ${claim.counterQuestion} ${claim.period.emperor}`.includes(search);
    return keyword && (topic === "全部主题" || claim.topic === topic) && (assessment === "全部判断" || claim.currentAssessment === assessment);
  }), [search, topic, assessment]);

  return (
    <div className="space-y-5">
      <DemoBanner />
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">清修叙事对照</h1>
        <p className="mt-2 text-sm text-muted">把清修叙事拆成可核验主张，再关联多源证据链。</p>
      </div>
      <FilterBar search={search} onSearch={setSearch}>
        <select className="focus-ring rounded border border-line bg-paper px-3 py-2 text-sm" value={topic} onChange={(event) => setTopic(event.target.value)}>
          {topics.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="focus-ring rounded border border-line bg-paper px-3 py-2 text-sm" value={assessment} onChange={(event) => setAssessment(event.target.value)}>
          {assessments.map((item) => <option key={item}>{item}</option>)}
        </select>
      </FilterBar>
      <div className="grid gap-4">
        {filtered.map((claim) => <ClaimCard key={claim.id} claim={claim} evidence={evidence} />)}
      </div>
    </div>
  );
}
