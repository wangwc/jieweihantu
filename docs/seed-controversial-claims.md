# Seed Controversial Claims

首版内置 60 条争议主张种子，位于：

`data-seed/raw/controversial/controversial-claims.seed.csv`

每条必须满足：

- `controversial = true`
- `defaultLayer = D/X`
- `reviewStatus = pending_review`
- `assessment = 待核验`
- `conclusion = 不作为事实结论`

Seed Builder 会为每条争议主张生成 ResearchTask。任务只表示待补资料方向，不表示该主张可信。
