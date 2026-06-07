# Seed Validation

`npm run seed:validate` 检查：

- records 是否有 `sourceId` 或 `claimId`。
- records 是否有 `importBatchId`。
- records 是否有 `licenseNote`。
- records 是否有 `citation` 或 `url`。
- controversial claims 是否全部 `pending_review`。
- controversial claims 是否明确 `不作为事实结论`。
- TextChunk 是否未被直接当作 Evidence。
- EvidenceCandidate 是否未成为 approved Evidence。
- 自动关联是否只保存在 `suggestedLinks`。
- 争议 seed 数量不少于 60。
- 历史文本 page list 数量不少于 120。

校验报告写入 `data-seed/reports/validation-report.json`。
