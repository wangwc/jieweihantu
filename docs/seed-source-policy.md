# Seed Source Policy

Seed 来源必须保留 `sourceId`、`url` 或 `citation`、`licenseNote`、`importBatchId`。

允许内置：

- 来源登记配置。
- 争议主张的待核验标题和问题。
- 历史文本 page list 入口。
- CHGIS、CBDB、博物馆开放数据 manifest。

不能内置：

- 未核验原文。
- 伪造页码、卷次、馆藏号。
- 需要登录、付费、绕过风控或禁止抓取的平台内容。
- 把网络争议主张写成事实结论。

默认 `seed:fetch` 不联网。联网只允许 `--allow-network` 下访问公开允许的 API 或页面，并保留失败报告。
