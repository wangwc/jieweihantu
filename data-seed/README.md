# Seed Database Builder

`data-seed` stores repeatable seed inputs and generated reports for Ming Evidence Atlas.

Run:

```bash
npm run seed:build
npm run seed:validate
npm run seed:rankings
```

Default behavior is offline and staging-first. Network access is skipped unless `--allow-network` is passed. Missing CHGIS, CBDB, museum, or historical full-text files are reported in `reports/missing-data-report.json`; the builder must not fabricate source text, page numbers, collection IDs, or remote data.

Place real files here:

- CHGIS GeoJSON/CSV: `raw/chgis/`
- CBDB CSV/JSON exports: `raw/cbdb/`
- Museum CSV/JSON open data: `raw/museum/`
- Local TXT/Markdown historical text exports: `raw/historical-text/`
- Manually curated controversial URL lists: `raw/controversial/`

All generated controversial claims, leads, text chunks, and evidence candidates remain `pending_review`.
