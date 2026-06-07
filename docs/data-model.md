# 数据模型

核心实体：
- `HistoricalClaim`
- `EvidenceItem`
- `Source`
- `EmperorProfile`
- `TerritoryLayer`
- `LeadItem`
- `MediaAsset`

`MediaAsset` 支持图片、视频、网页、档案和文档入口。视频只在提供允许嵌入的 `embedUrl` 时站内播放，否则回退为缩略图和外链。

`EvidenceItem` 新增媒体字段：
- `mediaAssets`
- `primaryMediaId`
- `hasImage`
- `hasVideo`
- `hasEmbeddableMedia`

`Source` 新增：
- `homepageUrl`
- `previewImageUrl`
- `sampleMediaAssets`

`LeadItem` 新增：
- `thumbnailUrl`
- `embedUrl`
- `mediaAssets`
- `platformPolicyNote`
