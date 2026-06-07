# Controversial Claim Pipeline

输入：
- 网络文章 URL 手工录入
- 视频标题
- 视频字幕文本
- 公众号文章文本
- 知乎回答文本
- 论坛帖子文本
- 用户粘贴内容

流程：
1. 生成 StagingLead。
2. 抽取 StagingClaim 候选。
3. D/X 级内容只生成 Lead 或 ControversialClaim 候选。
4. 默认 `pending_review`。
5. 自动生成待补证据任务。
6. 不进入正式历史事实层。
7. Territory / Person 只能进入 suggestedLinks。

命令：

```bash
npm run import:controversial-leads:v3 -- --file=templates/alternative-leads.template.txt --kind=article --platform=公众号 --url=https://example.org/article
```
