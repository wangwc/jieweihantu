# 大明辨证录 / Ming Evidence Atlas

清修叙事待核验、多源证据反证、争议并存、人工审核的数字人文证据平台原型。

## 运行

```bash
npm install
npm run dev
```

当前本机 Node 为 v16 时，项目固定使用 Next.js 13.5.6。

## 原型说明

- 所有 JSON 数据均为 demo 数据。
- `待录入原文` 不是史料原文，只是字段占位。
- 清修《明史》在本系统中为 Q 级待核验对象。
- 网络文章和短视频为 D/X 级线索，不能直接作为历史结论。
- 媒体资料支持图片预览、URL 卡片和允许的 iframe 嵌入，但不做爬虫。

## 二阶段脚本

校验数据：

```bash
npm run validate:data
```

计算排行榜：

```bash
npm run rankings:calculate
```

导入模板 dry-run：

```bash
npm run import:sources -- templates/sources.template.csv
npm run import:leads -- templates/leads.template.csv
npm run import:claims -- templates/claims.template.csv
npm run import:evidence -- templates/evidence.template.csv
```

写入本地 JSON 需要显式增加 `--write`。所有导入都会生成 ImportBatch；失败时只输出错误报告。

## 真实资料替换路线

1. 人工录入 20 个高价值主张。
2. 每个主张补 3-5 条 S/A/B/C 证据。
3. 建立 SourceRegistry 白名单。
4. 再接入 CHGIS、CBDB、博物馆开放数据和其他开放资料。

## Alternative Narrative Framework

争议叙事导入只生成待核验主张和待补证据任务，不直接进入事实数据库。

```bash
npm run import:alternative-leads -- --file=templates/alternative-leads.template.txt --kind=article --platform=公众号 --url=https://example.org/article
npm run rankings:alternative
```

需要写入本地 JSON 时显式增加 `--write`。所有争议主张默认状态为“待核验”，必须经过 Evidence 审核流程。

## 第三阶段 Staging-First 导入

所有外部资料先进 staging，不直接进入正式事实库。

```bash
npm run import:historical-text -- --file=templates/alternative-leads.template.txt --source-title=示例史料 --source-type=明代实录
npm run import:controversial-leads:v3 -- --file=templates/alternative-leads.template.txt --kind=article --platform=公众号 --url=https://example.org/article
npm run import:chgis -- --file=templates/import/chgis-territory.template.csv
npm run import:cbdb -- --file=templates/import/cbdb-persons.template.csv
npm run import:museum-artifacts -- --file=templates/import/museum-artifacts.template.csv
npm run rankings:staging
```

审核和提升示例：

```bash
npm run review:action -- --action=approve --id=stg-textchunk-demo-001
npm run review:action -- --action=promoteTextChunkToEvidence --id=stg-textchunk-demo-001 --claim-id=claim-wanli-court --source-id=source-001 --citation=示例引用 --license=示例许可
```
