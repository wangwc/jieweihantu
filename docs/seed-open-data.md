# Seed Open Data

开放结构化数据通过 manifest 接入：

- `data-seed/raw/open-data/chgis-files.manifest.csv`
- `data-seed/raw/open-data/cbdb-files.manifest.csv`
- `data-seed/raw/open-data/museum-files.manifest.csv`

真实文件放置位置：

- CHGIS：`data-seed/raw/chgis/`
- CBDB：`data-seed/raw/cbdb/`
- Museum：`data-seed/raw/museum/`

如果文件不存在，Seed Builder 生成 missing-data report，不中断流程，不伪造数据。

`seed:import -- --mode trusted-open-data` 只允许 Person、Territory、Artifact 进入正式结构化层；Claim 和 Evidence 仍必须经过审核。
