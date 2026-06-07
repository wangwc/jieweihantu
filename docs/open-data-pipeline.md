# Open Data Pipeline

支持：
- CHGIS GeoJSON / SHP 转换后的 JSON
- CBDB CSV
- 博物馆 Open Data CSV / JSON
- 人物、地点、文物、地图图层

流程：
1. 读取开放结构化数据。
2. 标准化字段。
3. 进入 StagingPerson / StagingTerritory / StagingArtifact。
4. 自动检测重复。
5. 自动建议关联 Claim。
6. 审核后正式入库。

命令：

```bash
npm run import:chgis -- --file=templates/import/chgis-territory.template.csv
npm run import:cbdb -- --file=templates/import/cbdb-persons.template.csv
npm run import:museum-artifacts -- --file=templates/import/museum-artifacts.template.csv
```
