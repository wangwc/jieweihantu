# 审核与入库工作流

支持动作：
- approveStagingItem
- rejectStagingItem
- mergeStagingItem
- promoteTextChunkToEvidence
- promoteLeadToClaim
- linkEvidenceToClaim
- linkArtifactToClaim
- linkTerritoryToClaim
- linkPersonToClaim

当前实现为本地 JSON action 脚本。所有 promotion 都必须生成 AuditRecord。

回滚方式：
1. 查看 AuditRecord。
2. 根据 before/after 定位变更。
3. 手工或脚本恢复 JSON。
4. 重新运行 `npm run validate:data`。
