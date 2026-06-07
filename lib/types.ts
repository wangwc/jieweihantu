export type SourceLayer = "S" | "A" | "B" | "C" | "D" | "Q" | "X";

export type Topic =
  | "疆域"
  | "皇帝评价"
  | "军力"
  | "财政"
  | "民生"
  | "外交"
  | "科技"
  | "制度"
  | "文化"
  | "争议事件";

export type Assessment =
  | "清修叙事可能失真"
  | "清修叙事部分成立"
  | "清修叙事缺少证据"
  | "多源证据存在冲突"
  | "暂无法判断";

export type EvidenceRelation =
  | "支持清修叙事"
  | "反驳清修叙事"
  | "部分支持"
  | "部分反驳"
  | "提供背景"
  | "仅作为线索";

export type MediaProvider = "YouTube" | "Bilibili" | "Museum" | "Archive" | "Database" | "Website" | "Other";
export type MediaKind = "image" | "video" | "webpage" | "archive" | "document";
export type ImportMethod = "manual" | "csv" | "json" | "api" | "open-data" | "archive";
export type SourceStatus = "active" | "pending" | "disabled" | "rejected";
export type ReviewStatus = "draft" | "pending_review" | "reviewed" | "disputed" | "archived";
export type VerificationStatus = "未审核" | "初审" | "复审" | "已确认" | "已废弃";
export type RiskLevel = "low" | "medium" | "high";
export type ImportType = "csv" | "json" | "manual" | "open-data";
export type ImportEntityType =
  | "source"
  | "lead"
  | "claim"
  | "evidence"
  | "artifact"
  | "territory"
  | "person"
  | "text-chunk"
  | "controversial-claim"
  | "evidence-task"
  | "staging";
export type ImportStatus = "pending" | "success" | "failed" | "partial_success";
export type AuditAction = "create" | "update" | "approve" | "reject" | "archive" | "restore";
export type ControversialClaimStatus = "待核验" | "待补证据" | "待审核" | "已转入证据流程" | "已驳回" | "暂存";
export type AlternativeLeadKind = "url" | "article" | "subtitle";
export type EvidenceTaskStatus = "待补资料" | "检索中" | "待审核" | "已补充" | "已关闭";
export type StagingReviewStatus = "pending_review" | "approved" | "rejected" | "merged";
export type StagingEntityKind = "source" | "lead" | "claim" | "evidence" | "text-chunk" | "artifact" | "territory" | "person";

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  title: string;
  url: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  provider: MediaProvider;
  caption: string;
  licenseNote: string;
  accessNote: string;
  demoOnly: boolean;
}

export interface SourceRegistry {
  id: string;
  title: string;
  sourceType: string;
  sourceLayer: SourceLayer;
  institution: string;
  author: string;
  dynastyOrDate: string;
  url?: string;
  homepageUrl?: string;
  previewImageUrl?: string;
  accessMethod: string;
  licenseNote: string;
  citationFormat: string;
  reliabilityNote: string;
  allowedUsage: string;
  importMethod: ImportMethod;
  reviewRequired: boolean;
  status: SourceStatus;
  sampleMediaAssets: MediaAsset[];
  demoOnly: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SuggestedLink {
  entityType: ImportEntityType;
  entityId: string;
  label: string;
  reason: string;
  confidence: number;
}

export interface StagingBase<TNormalized = Record<string, unknown>> {
  id: string;
  importBatchId: string;
  rawPayload: Record<string, unknown>;
  normalizedPayload: TNormalized;
  detectedSourceLayer: SourceLayer;
  detectedSourceType: string;
  confidence: number;
  duplicateCandidateIds: string[];
  suggestedLinks: SuggestedLink[];
  validationWarnings: string[];
  validationErrors: string[];
  reviewStatus: StagingReviewStatus;
  reviewerNote: string;
  demoOnly: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StagingSource extends StagingBase<Partial<SourceRegistry>> {
  entityKind: "source";
}

export interface StagingLead extends StagingBase<Partial<LeadItem>> {
  entityKind: "lead";
}

export interface StagingClaim extends StagingBase<Partial<HistoricalClaim> & { controversial?: boolean }> {
  entityKind: "claim";
}

export interface StagingEvidence extends StagingBase<Partial<EvidenceItem>> {
  entityKind: "evidence";
}

export interface StagingTextChunk extends StagingBase<Partial<TextChunk>> {
  entityKind: "text-chunk";
}

export interface StagingArtifact extends StagingBase<Partial<Artifact>> {
  entityKind: "artifact";
}

export interface StagingTerritory extends StagingBase<Partial<TerritoryLayer>> {
  entityKind: "territory";
}

export interface StagingPerson extends StagingBase<Partial<PersonProfile>> {
  entityKind: "person";
}

export type Source = SourceRegistry & {
  layer: SourceLayer;
  date: string;
};

export interface HistoricalClaim {
  id: string;
  title: string;
  topic: Topic;
  period: {
    emperor: string;
    reignTitle: string;
    yearStart: number;
    yearEnd: number;
  };
  qingNarrative: {
    text: string;
    sourceTitle: string;
    volume: string;
    originalText: string;
    url?: string;
    note: string;
  };
  counterQuestion: string;
  currentAssessment: Assessment;
  evidenceIds: string[];
  leadIds: string[];
  sourceIds: string[];
  conclusion: string;
  confidenceLevel: SourceLayer;
  controversy: number;
  reviewStatus: ReviewStatus;
  reviewNotes: string;
  tags: string[];
  demoOnly: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceItem {
  id: string;
  claimId: string;
  sourceId: string;
  relationToClaim: EvidenceRelation;
  sourceLayer: SourceLayer;
  sourceType: string;
  title: string;
  authorOrInstitution: string;
  dynastyOrDate: string;
  originalText: string;
  translationOrSummary: string;
  url?: string;
  archiveUrl?: string;
  screenshotOrArchiveUrl?: string;
  screenshotOrImageUrl?: string;
  locationRef: string;
  citation: string;
  licenseNote: string;
  reliabilityNote: string;
  extractionNote: string;
  reviewerNote: string;
  verificationStatus: VerificationStatus;
  auditTrail: string[];
  mediaAssets: MediaAsset[];
  primaryMediaId?: string;
  hasImage: boolean;
  hasVideo: boolean;
  hasEmbeddableMedia: boolean;
  demoOnly: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TextChunk {
  id: string;
  sourceId: string;
  title: string;
  dynastyOrDate: string;
  volume: string;
  page: string;
  originalText: string;
  translationOrSummary: string;
  keywords: string[];
  personIds: string[];
  placeIds: string[];
  candidateClaimIds: string[];
  citation: string;
  url?: string;
  licenseNote: string;
  reviewStatus: StagingReviewStatus;
  createdAt: string;
  updatedAt: string;
  demoOnly: boolean;
}

export interface Artifact {
  id: string;
  title: string;
  artifactType: string;
  institution: string;
  sourceId: string;
  dynastyOrDate: string;
  url?: string;
  imageUrl?: string;
  licenseNote: string;
  citation: string;
  relatedClaimIds: string[];
  reviewStatus: StagingReviewStatus;
  createdAt: string;
  updatedAt: string;
  demoOnly: boolean;
}

export interface PersonProfile {
  id: string;
  name: string;
  reignYears?: string;
  nativePlace?: string;
  dynastyOrDate: string;
  sourceId: string;
  relatedClaimIds: string[];
  citation: string;
  licenseNote: string;
  reviewStatus: StagingReviewStatus;
  createdAt: string;
  updatedAt: string;
  demoOnly: boolean;
}

export interface EmperorProfile {
  id: string;
  name: string;
  reignTitle: string;
  reignYears: string;
  qingLabel: string;
  reassessmentDimensions: string[];
  claims: string[];
  positiveEvidenceCount: number;
  negativeEvidenceCount: number;
  disputedEvidenceCount: number;
  summary: string;
  demoOnly: boolean;
}

export interface TerritoryLayer {
  id: string;
  title: string;
  yearStart: number;
  yearEnd: number;
  controlType: "直接行政区" | "军事控制区" | "羁縻册封" | "短期占领" | "航海影响区" | "名义声索区" | "争议区";
  geojson: {
    type: "Feature";
    geometry: { type: "Point"; coordinates: [number, number] };
    properties: { label: string };
  };
  evidenceIds: string[];
  note: string;
  demoOnly: boolean;
}

export interface LeadItem {
  id: string;
  platform: "B站" | "抖音" | "快手" | "西瓜视频" | "YouTube" | "知乎" | "公众号" | "论坛" | "其他";
  title: string;
  url: string;
  author: string;
  publishDate: string;
  capturedAt: string;
  rawSummary: string;
  extractedClaims: string[];
  mentionedSources: string[];
  relatedClaimIds: string[];
  status: "待核验" | "已拆解" | "已找到证据" | "已驳回" | "暂存";
  riskLevel: RiskLevel;
  riskNote: string;
  reviewerNote: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  mediaAssets: MediaAsset[];
  platformPolicyNote: string;
  demoOnly: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ControversialClaim {
  id: string;
  title: string;
  rawClaimText: string;
  normalizedClaim: string;
  topic: Topic | "未分类";
  sourceLeadId: string;
  sourceUrl: string;
  sourceKind: AlternativeLeadKind;
  platform: LeadItem["platform"];
  speculativeSourceIds: string[];
  relatedHistoricalClaimIds: string[];
  status: ControversialClaimStatus;
  riskLevel: RiskLevel;
  aiDecompositionNote: string;
  requiredEvidenceTasks: string[];
  reviewerNote: string;
  createdAt: string;
  updatedAt: string;
  demoOnly: boolean;
}

export interface EvidenceGapTask {
  id: string;
  controversialClaimId: string;
  title: string;
  taskType: "补原始材料" | "补实物证据" | "补外部记录" | "补现代研究" | "补引用信息" | "补授权说明";
  requiredSourceLayers: SourceLayer[];
  description: string;
  priority: "low" | "medium" | "high";
  status: EvidenceTaskStatus;
  assignedTo: string;
  dueNote: string;
  createdAt: string;
  updatedAt: string;
  demoOnly: boolean;
}

export interface AlternativeNarrativeRanking {
  controversialClaimId: string;
  networkControversyScore: number;
  evidenceGapScore: number;
  leadSignalCount: number;
  platformDiversityScore: number;
  missingEvidenceTaskCount: number;
  highPriorityTaskCount: number;
  lastCalculatedAt: string;
  demoOnly?: boolean;
}

export interface ImportBatch {
  id: string;
  importType: ImportType;
  entityType: ImportEntityType;
  fileName: string;
  importedAt: string;
  importedBy: string;
  totalRows: number;
  successRows: number;
  failedRows: number;
  warnings: string[];
  errors: string[];
  status: ImportStatus;
  rawFilePath: string;
  resultFilePath: string;
  demoOnly?: boolean;
}

export interface ImportRowError {
  id: string;
  importBatchId: string;
  rowNumber: number;
  entityType: ImportEntityType;
  rawPayload: Record<string, unknown>;
  message: string;
  severity: "warning" | "error";
  createdAt: string;
  demoOnly?: boolean;
}

export interface AuditRecord {
  id: string;
  entityType: ImportEntityType;
  entityId: string;
  action: AuditAction;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  note: string;
  reviewer: string;
  createdAt: string;
  demoOnly?: boolean;
}

export interface RankingMetric {
  claimId: string;
  evidenceCount: number;
  supportCount: number;
  refuteCount: number;
  partialCount: number;
  leadCount: number;
  sourceDiversityScore: number;
  controversyScore: number;
  refutationStrengthScore: number;
  evidenceCompletenessScore: number;
  leadHeatScore: number;
  lastCalculatedAt: string;
  demoOnly?: boolean;
}
