# 导入工作流

导入支持 CSV 和 JSON。脚本默认 dry-run：

```bash
npm run import:sources -- templates/sources.template.csv
npm run import:evidence -- templates/evidence.template.csv
```

写入需要显式传入 `--write`：

```bash
npm run import:sources -- templates/sources.template.csv --write
```

每次导入都会生成 ImportBatch。导入失败时只输出错误报告，不写入目标数据。
