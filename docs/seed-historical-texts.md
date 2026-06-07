# Seed Historical Texts

首版内置 120 条历史文本 page list，位于：

`data-seed/raw/historical-text/historical-text.page-list.csv`

这些记录只是文本入口，不包含伪造原文。无法取得全文时：

- `originalText = 待补原文`
- `reviewStatus = pending_review`
- 只生成 TextChunk / StagingTextChunk
- 不能直接生成 Evidence

用户可把已合法下载或整理的 TXT、Markdown、CSV 放入 `data-seed/raw/historical-text/`，再通过 Local File adapter 标准化。
