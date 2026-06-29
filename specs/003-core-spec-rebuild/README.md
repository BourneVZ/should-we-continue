# 003 Core Spec Rebuild

更新时间：2026-06-28

本目录用于重建 `should-we-continue` 的产品主线。

## 这次重建解决什么问题

旧版 `001-core-functionality` 把太多目标塞进了第一阶段：

- 决策支持
- 医学与安全红旗
- 9 维现实支持度分析
- 深入问卷
- 伴侣共同讨论
- 分享授权
- 地区政策与成本
- LLM 报告生成

结果是“主玩法不够强，产品记忆点不够尖锐，角色系统反而沦为附属模块”。

本轮重建的方向很明确：

- 删除：伴侣讨论、分享授权、伴侣独立问卷、共同版报告。
- 降级：隐私/安全/政策/专业边界不再占据主流程，只保留最低限度的产品边界说明。
- 聚焦：把“围绕怀孕与养育场景的 SBTI 风格类型测试”变成唯一主玩法。
- 雪藏：9 维现实支持度与行动建议模块暂不做产品主线，后续作为第二阶段扩展。

## 当前文档

- [spec.md](/Z:/Users/BVZ/WorkSpace/101Doodle/VibeCoding/should-we-continue/specs/003-core-spec-rebuild/spec.md)
  最终核心规格，定义产品边界与整体结构。
- [research.md](/Z:/Users/BVZ/WorkSpace/101Doodle/VibeCoding/should-we-continue/specs/003-core-spec-rebuild/research.md)
  专业依据与建模边界。
- [questionnaire.md](/Z:/Users/BVZ/WorkSpace/101Doodle/VibeCoding/should-we-continue/specs/003-core-spec-rebuild/questionnaire.md)
  30 题与 15 维的问卷结构。
- [scoring.md](/Z:/Users/BVZ/WorkSpace/101Doodle/VibeCoding/should-we-continue/specs/003-core-spec-rebuild/scoring.md)
  连续向量、类型原型匹配与第 25 型触发规则。
- [personas.md](/Z:/Users/BVZ/WorkSpace/101Doodle/VibeCoding/should-we-continue/specs/003-core-spec-rebuild/personas.md)
  24+1 类型系统与家族层说明。
- [report.md](/Z:/Users/BVZ/WorkSpace/101Doodle/VibeCoding/should-we-continue/specs/003-core-spec-rebuild/report.md)
  结果页结构规范。
- [persona-sample-ctrl.md](/Z:/Users/BVZ/WorkSpace/101Doodle/VibeCoding/should-we-continue/specs/003-core-spec-rebuild/persona-sample-ctrl.md)
  单类型文案与视觉设定样板。
- [type-description-prompt-template.md](/Z:/Users/BVZ/WorkSpace/101Doodle/VibeCoding/should-we-continue/specs/003-core-spec-rebuild/type-description-prompt-template.md)
  类型描述离线生成模板，定义结构化输入、输出 schema、知识卡和审校规则。
- [type-description-sample-ctrl.md](/Z:/Users/BVZ/WorkSpace/101Doodle/VibeCoding/should-we-continue/specs/003-core-spec-rebuild/type-description-sample-ctrl.md)
  `CTRL` 类型的模板填充示例，包含示范输入、示范 prompt 拼装和示范输出。

## 代码清理边界

当前仓库按 `003` 的产品边界做过一轮主线清理：

- 直接删除：伴侣共同讨论、伴侣独立问卷、分享授权、共同版报告、安全/医学主流程、地区政策与成本、LLM 报告生成及其 API。
- 保留最低声明：首页与结果页底部仍保留一句固定边界说明。
- 雪藏而非继续运行：旧版“9 维现实支持度 + 行动建议”只保留在 `specs/001-core-functionality/` 作为后续扩展参考，不再保留运行时代码入口。

## 与旧版的关系

本目录不是 `001-core-functionality` 的补丁，而是新的产品基线。

- `001` 可视为“旧方向完整稿”
- `003` 可视为“新方向重开稿”

如果两者冲突，后续讨论与实现应以 `003` 为准。

## 当前确认状态

以下核心决策已经确认，不再视为待讨论项：

- `30` 题
- `15` 维
- `5` 分量表
- 内部连续向量匹配
- `24` 个标准类型 + `1` 个兜底型
- 内部 `8 x 3` 家族组织
- 前台弱化家族层
- 首页与结果页采用轻毒舌但不冒犯的语气
