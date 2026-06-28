# Formal Measure Registry

更新时间：2026-06-26  
状态：Phase 0 锁定版

本文档是 MVP 对正式量表的唯一准入登记册。任何未在此处标记为 `available` 的条目不得出现在题库、评分、报告或伴侣流程中，也不得以英文原题、项目自译或模型翻译的形式补位。

## 1. 准入规则

一个正式量表只有同时具备下列证据才能标记为 `available`：

1. 可追溯的简体中文版本来源和版本标识；
2. 明确的题项全文、原始作答选项、反向计分和维度计分规则；
3. 与 MVP 使用场景相符的许可或使用条件；
4. 可在产品中折叠展示的来源链接与版本信息。

本仓库当前未保存上述任一量表的完整、经确认的简体中文题项与许可证据。本轮也不联网补充。因此以下全部锁定为 `unavailable`。这是可实施的降级决定，不是“以后再填”的占位：MVP 只使用本项目明确标注为启发式的非诊断题，且不再声称实施了这些正式量表。

## 2. 登记表

| measureId | 名称 | 状态 | 已登记依据 | 简体中文版本/许可结论 | 题项、选项、反向计分 | 缺失处理 | MVP 降级策略 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `MEASURE-PHQ-2` | PHQ-2 | `unavailable` | `SRC-PHQ-SCREENERS`、`SRC-ACOG-PMH-IMPLEMENT` | 仓库无可确认简体中文版本、完整使用条件或许可记录 | `itemSet: none`；不得保存、展示或翻译原题、原选项、反向计分 | 不计分；不存在“缺题后补分” | 使用 `Q-MH-MOOD-LOW`、`Q-MH-WORRY-HIGH`、`Q-MH-FUNCTION-IMPACT` 等启发式题，只输出非诊断性支持提示 |
| `MEASURE-GAD-2` | GAD-2 | `unavailable` | `SRC-PHQ-SCREENERS`、`SRC-ACOG-PMH-IMPLEMENT` | 同上 | `itemSet: none`；不得保存、展示或翻译原题、原选项、反向计分 | 不计分 | 同 `MEASURE-PHQ-2` 的启发式情绪与功能支持题 |
| `MEASURE-PHQ-9` | PHQ-9 | `unavailable` | `SRC-PHQ-SCREENERS`、`SRC-ACOG-PMH-IMPLEMENT` | 仓库无可确认简体中文版本、完整使用条件或许可记录 | `itemSet: none`；不得保存、展示或翻译原题、原选项、反向计分 | 不计分；不得作为深入模块题库 | 深入心理模块使用 4 个启发式支持与线下咨询准备题；安全题独立处理 |
| `MEASURE-GAD-7` | GAD-7 | `unavailable` | `SRC-PHQ-SCREENERS`、`SRC-ACOG-PMH-IMPLEMENT` | 仓库无可确认简体中文版本、完整使用条件或许可记录 | `itemSet: none`；不得保存、展示或翻译原题、原选项、反向计分 | 不计分；不得作为深入模块题库 | 同 `MEASURE-PHQ-9` |
| `MEASURE-IPIP-50` | IPIP-50 | `unavailable` | `SRC-IPIP` | 仓库无固定的可确认简体中文 50 题版本及版本锁定记录；公开英文题库不构成中文准入证据 | `itemSet: none`；不得复制英文题、翻译或推断反向计分 | 不计分；不得生成大五维度 | 完整角色测评缩减为 12 个产品启发式题；不展示“人格测量明细” |
| `MEASURE-GDMS-25` | GDMS-25 | `unavailable` | `SRC-GDMS` | 仓库无可确认简体中文 25 题版本、题项许可与计分记录 | `itemSet: none`；不得复制英文题、翻译或推断反向计分 | 不计分；不得生成决策风格量表维度 | 使用 12 个启发式角色补充题中的信息、计划、复盘偏好字段 |
| `MEASURE-ECR-RS-9` | ECR-RS-9 | `unavailable` | `SRC-ECR-RS` | 仓库无可确认简体中文 9 题版本、关系对象说明、许可与计分记录 | `itemSet: none`；不得复制英文题、翻译或推断反向计分 | 不计分；不得生成依恋维度或互动风格标签 | 使用伴侣尊重、自主安全、具体承诺和沟通偏好的启发式题；不贴依恋标签 |

## 3. 规范化元数据形状

当且仅当将来人工审查获得上述准入证据时，新增量表登记必须一次性补齐下列字段后才能改为 `available`：

```text
measureId, status, displayName, language, sourceId, sourceUrl,
version, licenseOrUseCondition, itemSetVersion, responseOptions,
reverseScoredItemKeys, scoringMethod, missingRule, reportDisclosure
```

本文件当前不保存任何正式量表题干、选项文本、计分键、英文占位或机器译文。`available` 不是开发时可临时设置的状态；变更它需要来源与许可的人工复核，并重新取得用户对规则包的确认。

## 4. 报告与共享限制

- 因全部条目为 `unavailable`，MVP 不渲染正式量表名称、维度、原始分数、原始范围或来源明细。
- 不得把启发式题的合计、平均值或标签伪称为 PHQ、GAD、大五、GDMS 或 ECR-RS 结果。
- 启发式题仅用于本地支持需求、报告确定性和角色化需求映射；不用于心理诊断、医疗判断、去留推荐或伴侣人格结论。
- 自伤、自杀、胁迫、暴力和医学急症始终由独立安全规则处理，不得由任何量表或启发式合计分抵消。
