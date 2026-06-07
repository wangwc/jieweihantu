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
