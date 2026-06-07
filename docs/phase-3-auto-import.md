# 第三阶段自动导入计划

第三阶段采用 staging-first 架构：所有外部资料先进入暂存层，自动抽取结果全部标记为 `pending_review`。

禁止：
- 直接写入正式 Evidence。
- 直接把 Lead 写成 Claim 结论。
- 把 TextChunk 当 Evidence。
- 把 D/X/Q 级资料作为事实依据。
- 编写绕过登录、反爬、风控或付费墙的采集代码。

允许：
- 手工录入。
- CSV / JSON 导入。
- 公开下载数据。
- 开放 API。
- 本地文件和用户主动粘贴文本。
