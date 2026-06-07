# Seed Reproducibility

Seed Builder 的目标是可重复、可校验、可回滚。

常用命令：

```bash
npm run seed:fetch
npm run seed:normalize
npm run seed:link
npm run seed:validate
npm run seed:snapshot
npm run seed:import -- --mode staging
npm run seed:rankings
```

回滚：

```bash
npm run seed:rollback
```

更新 seed 时先改 `data-seed/raw` 或 `data-seed/config`，再运行 `seed:build`。不要直接手改 normalized 输出作为唯一来源。
