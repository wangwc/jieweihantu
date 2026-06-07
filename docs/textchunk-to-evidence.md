# TextChunk 到 Evidence

TextChunk 是资料片段，不是 Evidence。

生成 Evidence 的条件：
- TextChunk 已审核。
- 有 sourceId。
- 有 claimId。
- 有 citation 或 url。
- 有 licenseNote。
- 写入 AuditRecord。

命令示例：

```bash
npm run review:action -- --action=approve --id=stg-textchunk-demo-001
npm run review:action -- --action=promoteTextChunkToEvidence --id=stg-textchunk-demo-001 --claim-id=claim-wanli-court --source-id=source-001 --citation=示例引用 --license=示例许可
```
