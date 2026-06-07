import type { AlternativeLeadKind, AlternativeNarrativeRanking, ControversialClaim, EvidenceGapTask, LeadItem, RiskLevel, Topic } from "@/lib/types";

const topicKeywords: Array<[Topic, string[]]> = [
  ["疆域", ["疆域", "远航", "海外", "边界", "统治", "册封"]],
  ["皇帝评价", ["皇帝", "不上朝", "怠政", "荒唐", "木匠", "评价"]],
  ["制度", ["制度", "财政", "军制", "亡国", "党争", "责任"]],
  ["外交", ["朝贡", "外部", "使节", "海外"]],
  ["军力", ["军", "战争", "边防"]]
];

function inferTopic(text: string): Topic | "未分类" {
  return topicKeywords.find(([, keywords]) => keywords.some((keyword) => text.includes(keyword)))?.[0] ?? "未分类";
}

function inferRisk(text: string, sourceKind: AlternativeLeadKind): RiskLevel {
  if (sourceKind === "subtitle" || /必然|彻底|真相|完全|唯一|无敌/.test(text)) return "high";
  if (sourceKind === "article" || /可能|据说|有人认为/.test(text)) return "medium";
  return "low";
}

function splitClaims(text: string) {
  return text
    .split(/[。！？!?；;\n]+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 8)
    .slice(0, 8);
}

export function decomposeAlternativeNarrative(input: {
  leadId: string;
  sourceUrl: string;
  sourceKind: AlternativeLeadKind;
  platform: LeadItem["platform"];
  text: string;
  createdAt?: string;
}): { claims: ControversialClaim[]; tasks: EvidenceGapTask[] } {
  const createdAt = input.createdAt ?? new Date().toISOString();
  const claims = splitClaims(input.text).map((raw, index) => {
    const id = `cc-${input.leadId}-${index + 1}`;
    const topic = inferTopic(raw);
    const taskIds = [`task-${id}-primary`, `task-${id}-citation`];
    return {
      id,
      title: `争议主张：${raw.slice(0, 32)}`,
      rawClaimText: raw,
      normalizedClaim: raw.replace(/^有人认为[:：]?/, ""),
      topic,
      sourceLeadId: input.leadId,
      sourceUrl: input.sourceUrl,
      sourceKind: input.sourceKind,
      platform: input.platform,
      speculativeSourceIds: ["source-speculative-001"],
      relatedHistoricalClaimIds: [],
      status: "待核验",
      riskLevel: inferRisk(raw, input.sourceKind),
      aiDecompositionNote: "本地AI拆解：按句读和风险词拆分为待核验主张；结果不得直接进入事实数据库。",
      requiredEvidenceTasks: taskIds,
      reviewerNote: "必须补S/A/B/C证据并通过Evidence审核流程。",
      createdAt,
      updatedAt: createdAt,
      demoOnly: false
    } satisfies ControversialClaim;
  });

  const tasks = claims.flatMap((claim) => [
    {
      id: claim.requiredEvidenceTasks[0],
      controversialClaimId: claim.id,
      title: `为“${claim.normalizedClaim.slice(0, 24)}”补事实证据`,
      taskType: "补原始材料",
      requiredSourceLayers: claim.topic === "疆域" ? ["A", "B", "C"] : ["S", "C"],
      description: "寻找可审核来源；D/X/Q不得作为事实依据。",
      priority: claim.riskLevel === "high" ? "high" : "medium",
      status: "待补资料",
      assignedTo: "待分配",
      dueNote: "补齐 citation、licenseNote、sourceId 后才能进入 Evidence 审核。",
      createdAt: claim.createdAt,
      updatedAt: claim.updatedAt,
      demoOnly: false
    } satisfies EvidenceGapTask,
    {
      id: claim.requiredEvidenceTasks[1],
      controversialClaimId: claim.id,
      title: `为“${claim.normalizedClaim.slice(0, 24)}”补引用和授权`,
      taskType: "补引用信息",
      requiredSourceLayers: ["C"],
      description: "补正式引用、访问方式、授权说明和人工审核备注。",
      priority: "medium",
      status: "待补资料",
      assignedTo: "待分配",
      dueNote: "缺引用或授权说明时不得进入事实数据库。",
      createdAt: claim.createdAt,
      updatedAt: claim.updatedAt,
      demoOnly: false
    } satisfies EvidenceGapTask
  ]);

  return { claims, tasks };
}

export function calculateAlternativeRankings(claims: ControversialClaim[], tasks: EvidenceGapTask[], calculatedAt = new Date().toISOString()): AlternativeNarrativeRanking[] {
  return claims.map((claim) => {
    const relatedTasks = tasks.filter((task) => task.controversialClaimId === claim.id);
    const highPriority = relatedTasks.filter((task) => task.priority === "high").length;
    const missing = relatedTasks.filter((task) => task.status === "待补资料" || task.status === "检索中").length;
    const riskWeight = claim.riskLevel === "high" ? 35 : claim.riskLevel === "medium" ? 22 : 10;
    const kindWeight = claim.sourceKind === "subtitle" ? 18 : claim.sourceKind === "article" ? 14 : 10;

    return {
      controversialClaimId: claim.id,
      networkControversyScore: riskWeight + kindWeight + claim.requiredEvidenceTasks.length * 6,
      evidenceGapScore: missing * 18 + highPriority * 12 + (claim.relatedHistoricalClaimIds.length ? 0 : 10),
      leadSignalCount: 1,
      platformDiversityScore: 1,
      missingEvidenceTaskCount: missing,
      highPriorityTaskCount: highPriority,
      lastCalculatedAt: calculatedAt,
      demoOnly: claim.demoOnly
    };
  });
}
