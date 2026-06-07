# Staging 数据模型

所有 staging 实体共享 `StagingBase` 字段：
- `id`
- `importBatchId`
- `rawPayload`
- `normalizedPayload`
- `detectedSourceLayer`
- `detectedSourceType`
- `confidence`
- `duplicateCandidateIds`
- `suggestedLinks`
- `validationWarnings`
- `validationErrors`
- `reviewStatus`
- `reviewerNote`
- `createdAt`
- `updatedAt`

实体包括：
- StagingSource
- StagingLead
- StagingClaim
- StagingEvidence
- StagingTextChunk
- StagingArtifact
- StagingTerritory
- StagingPerson

`suggestedLinks` 只是建议，不是事实关系。
