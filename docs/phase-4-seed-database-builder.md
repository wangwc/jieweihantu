# 第四阶段 Seed Database Builder

Seed Database Builder 用于初始化一批可重复执行、可校验、可回滚的资料入口。它不是爬虫系统，也不是事实结论生成器。

## 运行顺序

```bash
npm run seed:build
npm run seed:validate
npm run seed:rankings
```

`seed:build` 顺序为 fetch、normalize、link、validate、snapshot、import、rankings、reports。默认离线运行；只有显式传入 `--allow-network` 才能访问公开 API 或 URL。

## 数据边界

- Controversial Claim、Lead、TextChunk、EvidenceCandidate 默认 `pending_review`。
- TextChunk 不等于 Evidence。
- 网络文章、短视频、论坛、公众号、知乎、Bilibili、YouTube 只能作为 Lead 或争议线索。
- 清修《明史》及清代官方叙事只能作为 Q 级待核验对象。
- 缺失真实原文、页码、卷次、馆藏号时必须写入 report，不能补造。

## 输出

Seed Builder 输出到 `data-seed/normalized`、`data-seed/reports` 和 `data-seed/snapshots`。默认 import 模式只写入 `data/staging`。
