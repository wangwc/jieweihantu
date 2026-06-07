# Historical Source Pipeline

输入：
- CSV
- JSON
- TXT
- Markdown
- PDF 已提取文本
- 用户粘贴文本

流程：
1. 创建 Source 候选或匹配已有 Source。
2. 切分文本为 TextChunk。
3. 自动识别人名、地点、年份、年号和关键词。
4. 自动建议关联 Claim。
5. 生成 StagingTextChunk。
6. 生成 StagingEvidence 候选。
7. 状态为 `pending_review`。
8. 不直接写入正式 Evidence。

命令：

```bash
npm run import:historical-text -- --file=templates/alternative-leads.template.txt --source-title=示例史料 --source-type=明代实录
```
