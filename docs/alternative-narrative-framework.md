# Alternative Narrative Framework

该模块用于处理网络争议叙事、文章观点、URL 摘要和字幕文本。

核心边界：
- 导入结果只生成 ControversialClaim。
- 所有争议主张默认状态为“待核验”。
- 自动拆解只生成待补证据任务。
- 不直接写入 HistoricalClaim 或 EvidenceItem。
- 不进入事实数据库。
- 必须补 S/A/B/C 来源并经过 Evidence 审核流程。

导入示例：

```bash
npm run import:alternative-leads -- --file=templates/alternative-leads.template.txt --kind=article --platform=公众号 --url=https://example.org/article
```

写入本地 JSON：

```bash
npm run import:alternative-leads -- --file=templates/alternative-leads.template.txt --kind=subtitle --platform=B站 --url=https://example.org/video --write
```

计算争议叙事排行：

```bash
npm run rankings:alternative
```

排行榜：
- 网络争议排行榜：根据风险等级、来源类型和待补任务数量计算。
- 证据缺口排行榜：根据待补任务、高优先级任务和缺少关联事实主张情况计算。
