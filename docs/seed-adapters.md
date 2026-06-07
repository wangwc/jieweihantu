# Seed Adapters

所有 adapter 输出统一 normalized records，并写 adapter report。

- CHGIS：生成 Territory / Place / StagingTerritory 候选，要求 `controlType`，不生成疆域结论。
- CBDB：生成 Person / Office / Relationship / StagingPerson 候选，不生成皇帝评价。
- Museum：生成 Artifact / StagingArtifact，保留 institution、collectionUrl、licenseNote，不下载受限大图。
- MediaWiki Text：生成 TextChunk / StagingTextChunk，支持 page list、rateLimit、citation 和实体识别入口。
- Local File：读取本地 TXT、Markdown 或 CSV 导出，缺全文则保留待补状态。
- Controversial URL List：生成 Lead、ControversialClaimCandidate、ResearchTask，默认 D/X、controversial、pending_review。

自动关联只能写入 `suggestedLinks`，不得建立正式事实关系。
