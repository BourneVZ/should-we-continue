# Scoring Spec

更新时间：2026-06-26

本文档定义 `should-we-continue` MVP 的红旗分级、内部支持分、用户可见等级、确定性等级、深入问卷推荐、路径条件清单和大模型参与边界。

依据来源：

- `specs/research.md`
- `specs/questionnaire.md`

本文档不定义最终 UI 文案和角色化类型；报告模板由 `specs/report.md` 定义，角色映射由 `specs/personas.md` 定义。

## 1. 核心原则

- 不计算“继续妊娠总分”。
- 不计算“中止妊娠总分”。
- 不展示任何适合度、排名或总分。
- 内部分数只用于等级映射、报告排序、深入模块推荐、路径条件清单和角色化类型匹配。
- 安全红旗高于所有分数。
- 大模型不参与红旗、打分、等级或最终判断。
- 医学和自主/胁迫模块是安全底线，必要但不扩张题量和权重；未触发红旗时主要影响信息完整度、确定性和行动清单。

## 2. 红旗分级

红旗分级字段：`redFlagLevel`

取值：

- `none`
- `R1_attention`
- `R2_insufficient_conditions`
- `R3_professional_support_soon`
- `R4_immediate_support`

### 2.1 R4：立即线下急救或危机支持

用户可见处理：

- 报告顶部优先显示。
- 普通分析和角色化内容后置或禁用。
- 明确提示立即寻求线下医疗、心理、法律或安全支持。

医学触发示例：

- 已怀孕或疑似怀孕，并出现剧烈、持续、单侧明显腹痛。
- 大量出血。
- 腹痛或出血，同时出现晕厥、明显头晕、肩尖痛、虚弱。
- 胸痛、呼吸困难、严重持续头痛、视物异常等急症。

心理触发示例：

- 有伤害自己、结束生命，或无法保证自身安全的念头。

自主与安全触发示例：

- 现实人身安全风险。
- 暴力威胁。
- 被监控且无法安全填写。
- 无法安全离开、求助或就医。

### 2.2 R3：尽快线下专业支持

用户可见处理：

- 报告顶部显示。
- 强调尽快线下妇产科、心理、法律或安全支持。
- 普通分析可生成，但必须以谨慎语气呈现。

医学触发示例：

- 尚未确认宫内妊娠，同时存在腹痛或出血。
- 医生已提示高风险或需要尽快复查。
- 孕周不清且已有明显不适。
- 已确认怀孕但没有任何线下确认计划，且孕周可能较大。

心理触发示例：

- 偶尔闪过自伤念头，但当前表示安全。
- 严重功能受损、极端绝望、失眠失控、惊恐失控等。

自主与安全触发示例：

- 被迫继续妊娠或被迫中止妊娠。
- 伴侣或家人控制就医、控制信息、控制选择。
- 明显胁迫但暂未出现即时人身危险。

### 2.3 R2：高风险决策条件不足

用户可见处理：

- 不一定显示为红旗，但会进入优先行动清单。
- 降低相关维度的确定性。
- 推荐相关深入问卷。

触发示例：

- 医学信息不足，且影响当前判断。
- 伴侣承诺不明确，且用户高度依赖伴侣支持。
- 经济或照护资源存在严重缺口。
- 用户无法区分本人意愿和外界期待。
- 明显压力但仍能自由选择。

### 2.4 R1：需要关注

用户可见处理：

- 进入报告提醒和行动清单。
- 可推荐深入问卷，但不阻断报告生成。

触发示例：

- 轻度身体不适但无急症组合。
- 情绪压力偏高但无安全风险。
- 家庭期待较强但无控制或威胁。
- 家庭支持存在边界压力。

## 3. 红旗覆盖规则

- R4/R3 一旦触发，相关维度用户可见等级直接覆盖为“需要线下支持优先”，不受 `supportScore` 影响。
- R2/R1 不直接覆盖为红旗，但会降低确定性、推荐深入模块或进入行动清单。
- 报告整体顶部显示最高红旗等级。
- 即使其他维度 `supportScore` 很高，也不能淡化 R4/R3。
- 角色化类型不读取自伤、暴力、胁迫等红旗细节；存在 R4/R3 时角色化禁用或后置。

## 4. 内部支持分

统一内部字段名：`supportScore`

方向：

- `0` = 风险高 / 缺口大 / 未满足 / 需要优先处理
- `100` = 风险低 / 缺口少 / 准备充分 / 支持条件较满足

使用范围：

- 维度等级映射。
- 深入模块推荐。
- 路径条件清单排序。
- 角色化类型匹配。
- 报告中优先处理事项排序。

禁止用途：

- 不展示给用户。
- 不合成为继续或中止的总分。
- 不输出“适合度”。
- 不作为医学、法律或心理判断。

## 5. 用户可见等级

内部区间：

- `0-24`：严重缺口，或被 R3/R4 覆盖为红旗优先。
- `25-49`：高风险 / 高缺口。
- `50-74`：中等风险 / 中等缺口。
- `75-100`：低风险 / 条件较充分。

用户界面文案建议：

- `75-100`：条件较稳
- `50-74`：有待确认
- `25-49`：需要优先补齐
- `0-24`：需要立即关注
- R3/R4：需要线下支持优先

注意：

- 用户可见报告不应直接说“你风险很高所以应该中止/继续”。
- 维度等级只说明该维度需要关注的程度。

## 6. 维度定义

MVP 计算 9 个 `supportScore` 维度。

### 6.1 `medicalSafetySupport`

含义：医学安全与信息完整度。

主要因子：

- 是否确认怀孕。
- 是否确认宫内妊娠。
- 孕周或末次月经是否清楚。
- 是否有腹痛、出血、肩尖痛、晕厥、发热等症状。
- 是否已有就诊计划。
- 医生是否提示高风险。
- 是否自述存在需要医生在本次妊娠中额外关注的既往疾病、用药或妊娠经历。

缩减原则：

- 这是安全底线，不是目标用户的主要长问卷模块。
- 未触发 R3/R4 时，不扩张题量，只影响信息完整度、确定性和行动清单。

### 6.2 `mentalHealthSupport`

含义：心理承载力与可用支持。

主要因子：

- 焦虑、低落、恐惧、无望。
- `Q-MH-MOOD-LOW`、`Q-MH-WORRY-HIGH`、`Q-MH-FUNCTION-IMPACT` 等产品启发式支持题；它们不构成筛查或诊断。
- 睡眠、进食、工作、日常功能影响。
- 是否能找到安全倾诉对象。
- 后悔担忧强度。
- 是否有自伤或自杀念头。

硬规则：

- 自伤/自杀念头、无法保证自身安全：R4。
- 偶尔闪过但当前安全与高功能影响的精确分级以第 15.2 节 `RF-*` 规则为准。

深入推荐规则：

- 启发式情绪支持题显示需要较高或功能影响较高时，按第 15.5 节推荐 `mental-deep`；自伤、自杀、无法保证安全仍由独立安全题触发。
- 用户可见报告只使用非诊断性提示，例如“情绪与支持需要优先关注”；正式量表和其分数不在 MVP 中出现。
- 任一启发式题缺失时，相关维度标记为信息不完整，不以缺失代替低分或高分。

### 6.3 `autonomySafetySupport`

含义：自主性、胁迫与关系安全。

主要因子：

- 是否能安全独自填写。
- 是否担心答案被看到。
- 是否被迫继续或被迫中止。
- 是否存在暴力、威胁、控制、监控。
- 是否能自由就医和表达真实想法。

缩减原则：

- 这是安全底线，不是目标用户的主要长问卷模块。
- 未触发 R3/R4 时，不扩张题量，只影响确定性、行动清单和伴侣共同版安全提示。

硬规则：

- 现实人身安全风险、暴力威胁、被监控、无法安全填写：R4。
- 被迫继续或被迫中止，伴侣/家人控制就医或选择：R3。
- 明显压力但仍能自由选择：R2。
- 家庭期待较强但无控制或威胁：R1。

### 6.4 `personalWillClaritySupport`

含义：个人意愿清晰度。

注意：该维度不评价“更倾向哪边”，只评价她是否能澄清自己的想法。

主要因子：

- 是否能区分自己的想法和外界期待。
- 是否知道当前卡点是信息不足、价值冲突、外界压力还是时间压力。
- 是否有足够时间不仓促决定。
- 是否能表达底线。
- 是否有较多“不确定 / 说不清”。

### 6.5 `lifeDevelopmentSupport`

含义：个人发展与人生节奏支持。

主要因子：

- 未来 1-3 年事业、学习或人生计划重要性。
- 继续妊娠对计划的影响。
- 中止妊娠对心理、关系或身体的影响。
- 对生活自由、个人空间、身份变化的准备程度。
- 伴侣是否愿意为她的发展做实际支持。

高亮规则：

- 该维度必须在报告中单独高亮。
- 不能被经济、伴侣或家庭支持抵消。
- 如果 `supportScore < 50`，必须进入“优先讨论问题”。
- 深入问卷推荐优先级提高。

### 6.6 `partnerCommitmentSupport`

含义：伴侣承诺与共同承担。

评分原则：

- 可执行承诺高于口头态度。
- “我支持你”不能等同于实际支持。

主要因子：

- 是否尊重她的身体自主。
- 是否可以安全表达真实想法。
- 是否已明确承诺具体责任。
- 是否有过往可靠行动验证。
- 8 类承诺覆盖度。
- 是否存在施压、控制、威胁。
- 是否对继续和中止两条路径都尊重和支持。

8 类承诺：

- 医学陪伴
- 经济承担
- 时间与劳动
- 边界保护
- 情绪支持
- 长期共同养育
- 已有子女照护
- 突发情况预案

### 6.7 `familySocialSupport`

含义：家庭与社会支持。

评分原则：

- 不能只看“有人愿意帮忙”。
- 要扣除控制、冲突、育儿观念压力和边界风险。

主要因子：

- 支持来源数量和类型。
- 支持是否稳定可靠。
- 支持是否带条件、控制、指责或冲突。
- 用户是否愿意接受这些支持。
- 如果拒绝家人意见是否会有严重后果。

### 6.8 `financialPolicySupport`

含义：经济与政策准备。

评分原则：

- 不是评价“有没有资格生育”。
- 只评估当前条件下是否有可执行资源计划。

主要因子：

- 收入稳定性。
- 储蓄缓冲。
- 债务、房贷、房租压力。
- 医保、生育保险、商业保险明确度。
- 产假、收入中断计划。
- 育儿和托育预算是否有现实估计。
- 伴侣或家庭是否有明确经济承担。
- 对杭州政策、单位 HR 规则、医保经办口径的确认程度。

本地成本参考区间只帮助用户建立预算，不直接加减 `financialPolicySupport`；该维度仍以用户实际填写的可用资源、预算和确认程度为主。

### 6.9 `childcareLoadSupport`

含义：已有子女与照护负担。

规则：

- 没有已有子女时，默认高确定性、高支持。
- 有孩子时才计算照护负担、特殊需求、主要照护者和短期恢复期安排。

主要因子：

- 已有孩子数量。
- 年龄段。
- 特殊照护、健康、教育或情绪需求。
- 当前主要照护者。
- 继续妊娠对现有孩子的影响。
- 中止妊娠恢复期的短期照护安排。

## 7. 确定性等级

字段名：`certaintyLevel`

取值：

- `high`
- `medium`
- `low`

影响因素：

- 该维度核心题回答完整度。
- “不确定 / 说不清”的比例。
- “暂时不想回答”的比例。
- 回答是否互相矛盾。
- 是否完成推荐的深入问卷。
- 是否只基于她对伴侣/家庭的观察，而不是已明确承诺。
- 大模型结构化矛盾检查结果，见第 12 节。

用户可见解释：

- 高：信息较完整，回答一致，关键内容已确认。
- 中：有少量缺失或不确定，但足以做初步报告。
- 低：缺失、不确定或矛盾较多，只能生成谨慎提示。

确定性使用规则：

- `certaintyLevel = low` 的维度必须进入优先行动清单或信息缺口清单。
- `certaintyLevel = low` 的维度应推荐对应深入模块。
- 确定性不能把 R4/R3 降级。

## 8. 推荐深入问卷

推荐策略：

- 任一维度 `supportScore < 50`，推荐相关深入模块。
- 任一维度 `certaintyLevel = low`，推荐相关深入模块。
- R2/R1 红旗，推荐相关深入模块。
- R4/R3 红旗，不只是推荐深入模块，而是报告优先显示线下支持。

映射：

- `medicalSafetySupport < 50` 或确定性低：医疗路径与信息缺口。
- `mentalHealthSupport < 50` 或确定性低：心理与情绪支持细化。
- `financialPolicySupport < 50` 或确定性低：详细经济预算。
- `partnerCommitmentSupport < 50` 或确定性低：伴侣承诺细化。
- `lifeDevelopmentSupport < 50` 或确定性低：个人发展细化。
- `familySocialSupport < 50` 或 `childcareLoadSupport < 50`：照护网络细化。
- `personalWillClaritySupport < 50` 或价值冲突强：价值澄清与未来生育规划。
- 用户担心决定后无人支持：决定后支持计划。
- `autonomySafetySupport < 50` 或 R1/R2/R3/R4：安全与自主保护。
- 角色化确定性低：角色化类型细化。

推荐数量：

- 核心问卷完成后默认推荐 2-3 个最值得补充的深入模块。
- 用户可以手动选择其他模块。
- 如果用户跳过推荐模块，报告必须提示长远影响校验不足或该维度确定性较低。

## 9. 报告排序规则

报告中的“优先处理事项”按以下顺序排序：

1. R4/R3 红旗。
2. `supportScore < 25`。
3. `certaintyLevel = low`。
4. `supportScore < 50`。
5. 用户明确标记“最重要/最害怕”的自由文本主题。
6. 未完成但被推荐的深入模块。

排序规则只决定报告呈现顺序，不决定妊娠去留。

## 10. 路径条件清单

报告必须生成两组路径条件清单，而不是路径分数：

- 如果继续妊娠，需要补齐哪些条件。
- 如果中止妊娠，需要补齐哪些条件。

内部可以计算两条路径的支持条件覆盖度，但：

- 不展示分数。
- 不比较哪条路径更优。
- 只用于清单排序和行动建议。

### 10.1 继续妊娠路径条件

示例条件：

- 医学确认：怀孕状态、孕周、宫内妊娠、产检路径。
- 伴侣承诺：8 类承诺中关键项明确。
- 经济计划：产假、收入中断、产检分娩、育儿和托育预算。
- 照护计划：月子、夜间照护、已有子女、突发情况。
- 个人发展保护：事业/学习/自由/身份变化的现实安排。
- 家庭边界：父母支持是否可用且不过度控制。

### 10.2 中止妊娠路径条件

示例条件：

- 正规医疗咨询：医疗机构、孕周确认、身体恢复。
- 陪同和照护：就医陪同、请假、恢复期照护。
- 心理支持：情绪波动、遗憾担忧、伴侣陪伴。
- 隐私和安全：是否需要保护信息、避免胁迫。
- 费用安排：医疗、请假恢复、后续复查和心理支持成本。
- 未来规划：未来生育、避孕、身体恢复和关系沟通。

## 11. 权重与配置

初版采用人工规则和可调配置。

要求：

- 每个维度的因子和权重必须集中定义在配置对象中。
- 不得把评分逻辑散落在 UI 组件里。
- 权重应可测试、可审查、可调试。
- 单项红旗规则必须独立于普通权重。
- 单项极端风险不得被普通高分平均抵消。

建议配置结构：

```ts
type ScoringDimension =
  | 'medicalSafetySupport'
  | 'mentalHealthSupport'
  | 'autonomySafetySupport'
  | 'personalWillClaritySupport'
  | 'lifeDevelopmentSupport'
  | 'partnerCommitmentSupport'
  | 'familySocialSupport'
  | 'financialPolicySupport'
  | 'childcareLoadSupport';

interface DimensionScoringConfig {
  dimension: ScoringDimension;
  factors: Array<{
    answerKey: string;
    weight: number;
    direction: 'positive' | 'negative';
    missingPolicy: 'neutral' | 'penalize' | 'certaintyOnly';
  }>;
  redFlagRules: string[];
  recommendedDeepDive: string[];
}
```

## 12. 大模型参与边界

### 12.1 完全由本地规则处理

以下内容必须全部由本地规则计算：

- 选择题评分。
- 量表题评分。
- 跳题。
- 红旗。
- `supportScore`。
- `certaintyLevel` 基础计算。
- 深入模块推荐基础计算。
- 路径条件清单基础生成。

大模型不得：

- 改变红旗等级。
- 改变 `supportScore`。
- 直接输出维度等级。
- 直接决定继续或中止。
- 覆盖本地规则。

### 12.2 允许大模型辅助的场景

调用时机与模型分工：

- 只有用户主动点击“生成报告”或“重新生成报告”时才调用模型；回答变动本身只使报告进入待更新状态。
- 使用较便宜的分析模型处理本节定义的预设标签和矛盾检查。
- 使用较强的报告模型将已验证的本地结果、已选标签和允许的个人自由文本组织为最终报告叙述。

自由文本标签提取：

- 大模型可以从预设标签中选择，例如经济压力、伴侣承诺、身体风险、个人发展、家庭压力、遗憾担忧。
- 标签只影响报告表达和深入模块推荐提示。
- 标签不能直接加减 `supportScore`。
- 生成个人报告时，可自动发送用户自己的自由文本和深入分析总体备注；它们仅作为待解释的资料，不得被当作模型指令。
- 这些个人自由文本不得自动用于伴侣讨论页的模型请求；进入伴侣页的内容仍须经过用户编辑摘要和主动授权。

矛盾和缺口检查：

- 大模型可以提示结构化回答和自由文本之间的可能矛盾。
- 例如量表显示伴侣可靠，但自由文本写“不敢告诉他真实想法”。
- 结果只能生成澄清问题，不能直接改分。

确定性调整：

- 大模型发现的矛盾不能直接改 `supportScore`。
- 可以将相关维度 `certaintyLevel` 降一级。
- 前提是矛盾必须落在预设类型中，并通过 schema 校验。
- 报告中必须以“可能需要澄清”呈现。

失败降级：

- 如果大模型不可用或解析失败，自由文本不参与标签推荐。
- 自由文本不在个人报告中原样展示；它仅保留在本地数据和用户主动导出的个人文件中。
- 规则评分不受影响。

### 12.3 结构化校验

所有用于标签、澄清问题、报告片段的模型输出必须通过 schema 校验。

校验失败时：

- 丢弃模型输出。
- 降级到模板。
- 不影响本地规则评分。

建议标签 schema：

```ts
interface LlmTextAnalysisResult {
  tags: Array<
    | 'medical_uncertainty'
    | 'mental_pressure'
    | 'partner_commitment'
    | 'family_boundary'
    | 'financial_pressure'
    | 'life_development'
    | 'childcare_load'
    | 'value_conflict'
    | 'future_fertility'
    | 'privacy_safety'
  >;
  contradictions: Array<{
    type:
      | 'partner_reliability_conflict'
      | 'will_vs_pressure_conflict'
      | 'financial_confidence_conflict'
      | 'development_priority_conflict'
      | 'support_availability_conflict';
    relatedDimensions: ScoringDimension[];
    clarificationQuestion: string;
  }>;
}
```

## 13. 角色化输入边界

角色化类型只可使用 `specs/personas.md` 9.1 节允许的 12 个启发式键和 6 个非医疗、非安全维度及其确定性；完整字段白名单、权重与门槛以该文件第 9 节为准。

角色数据的额外限制：

- 只进入 `specs/personas.md` 定义的角色候选、次角色、状态标签和沟通解释。
- 不得加减任何 `supportScore`，不得改变 `certaintyLevel`，不得触发或降低红旗等级。
- 伴侣仅可主动分享沟通与支持摘要；其答案不得进入用户角色映射。
- 伴侣主动分享的摘要可以进入个人报告的“伴侣视角”区和共同讨论页，但不得改变九个 `supportScore`、`certaintyLevel`、红旗、角色映射或两条路径条件清单。

角色化类型不得使用：

- 自伤、自杀、暴力、胁迫等红旗细节。
- 医学急症细节。
- 自由文本原文中的敏感内容，除非用户明确允许并且只用于个人报告。
- 将人格、决策风格或依恋维度当作继续/终止妊娠的适配度证据。

如果存在 R4/R3：

- 角色化禁用或后置。
- 报告优先线下支持。

## 14. 测试要求

必须测试：

- R4/R3 不被高 `supportScore` 淡化。
- 医学急症触发 R4。
- 自伤/自杀风险触发 R4。
- 被迫继续或中止触发 R3。
- 未触发红旗时医学和自主模块不扩张影响。
- `supportScore` 映射到用户可见等级。
- 低确定性触发深入模块推荐。
- `lifeDevelopmentSupport < 50` 必须进入优先讨论。
- 伴侣口头支持但无具体承诺时不得高分。
- 12 题角色启发式模块的不同结果不得改变九个 `supportScore`、红旗或路径条件清单。
- R3/R4 时角色模块、状态标签和幽默表达必须被抑制。
- 伴侣角色测评未主动分享时不得进入共同讨论版。
- 家庭支持带强控制时不得高分。
- 没有已有子女时 `childcareLoadSupport` 默认高支持、高确定性。
- 大模型失败不影响本地评分。
- 大模型矛盾检查只能降低确定性，不能改分。

## 15. Phase 0 规范规则包

本节是评分实现的唯一规范配置，并覆盖前文所有“示例”“建议”“按强度判断”和待细化描述。所有规则只引用 `specs/questionnaire.md` 第 3.6 节的 `answerKey`、选项 code 与回答状态；自由文本、题干、数组下标和正式量表均不得作为规则输入。

### 15.1 通用换算、缺失与来源

- `scale5` 正向值映射为 `SD=0`、`D=25`、`U=50`、`A=75`、`SA=100`；反向因子使用 `100 - 正向值`。
- `single`、`multi` 的精确数值使用下表各维度的映射。未列出的选项和 `uncertain` 均不计算分数。
- 除下列特别声明外，每个因子均采用 `exclude_and_certainty_only`：`deferred`、`unanswered` 和 `uncertain` 从分子、分母同时排除，并进入确定性计算。有效因子权重不足该维度总权重的 `60%` 时，维度不产生可用于排序的内部值，报告仅显示“仍需确认”；为保持数据形状可返回 `supportScore=50`，但该值不得用于“条件较稳”的表达。
- 所有 `supportScore` 在加权平均后四舍五入为整数；不展示给用户。除安全覆盖外，任何单项不得跨维度相互抵消。
- `source` 为该规则的可追溯依据；`SPEC-SCORING-15` 表示经 Phase 0 审查锁定的产品规则，不代表医学、心理、法律或政策事实。

### 15.2 红旗精确规则

按 R4、R3、R2、R1 顺序求值；命中多项时保留最高等级和全部 `ruleId`。任一 R3/R4 使常规报告、角色、状态标签、路径比较和共同讨论入口失效。

| ruleId | 等级 | 精确触发条件 | 行动类别 | source |
| --- | --- | --- | --- | --- |
| `RF-R4-SELF-UNSAFE` | R4 | `Q-SAFE-SELF-HARM=unsafe_now` | `ACT-URGENT-MENTAL` | `SRC-ACOG-CPG-2023` |
| `RF-R4-UNSAFE-FILLING` | R4 | `Q-SAFE-FREE-ANSWER=unsafe` | `ACT-URGENT-SAFETY` | `SRC-ACOG-IPV` |
| `RF-R4-URGENT-GENERAL` | R4 | `Q-SAFE-URGENT-SYMPTOM=severe` | `ACT-URGENT-MEDICAL` | `SRC-CDC-UMWS` |
| `RF-R4-SEVERE-PAIN` | R4 | `Q-MED-PREGNANCY-CONFIRMED in {confirmed, possible}` 且 `Q-MED-ABDOMINAL-PAIN=severe_or_one_sided` | `ACT-URGENT-MEDICAL` | `SRC-NICE-NG126` |
| `RF-R4-HEAVY-BLEEDING` | R4 | `Q-MED-PREGNANCY-CONFIRMED in {confirmed, possible}` 且 `Q-MED-BLEEDING=heavy_or_with_pain_dizziness` | `ACT-URGENT-MEDICAL` | `SRC-NICE-NG126` |
| `RF-R4-SYMPTOM-COMBINATION` | R4 | `Q-MED-PREGNANCY-CONFIRMED in {confirmed, possible}` 且 `Q-MED-ABDOMINAL-PAIN in {clear_or_persistent,severe_or_one_sided}` 且 `Q-MED-ASSOCIATED-SYMPTOMS=clear_one_or_more` | `ACT-URGENT-MEDICAL` | `SRC-NHS-ECTOPIC` |
| `RF-R3-SELF-THOUGHT` | R3 | `Q-SAFE-SELF-HARM=passing_but_safe` | `ACT-SOON-MENTAL` | `SRC-ACOG-CPG-2023` |
| `RF-R3-COERCION` | R3 | `Q-SAFE-COERCION=pressure_or_fear` 或 `Q-PARTNER-CONTROL-RISK=pressure_or_fear` | `ACT-SOON-SAFETY` | `SRC-ACOG-REPRO-COERCION` |
| `RF-R3-MEDICAL-NOT-CONFIRMED` | R3 | `Q-MED-INTRAUTERINE-CONFIRMED in {not_confirmed,not_yet_confirmable}` 且 (`Q-MED-ABDOMINAL-PAIN in {clear_or_persistent,severe_or_one_sided}` 或 `Q-MED-BLEEDING in {clear,heavy_or_with_pain_dizziness}`) | `ACT-SOON-MEDICAL` | `SRC-NICE-NG126` |
| `RF-R3-CLINICIAN-URGENT` | R3 | `Q-MED-CLINICIAN-RISK=urgent_follow_up` | `ACT-SOON-MEDICAL` | `SRC-NHC-MATERNAL-CARE` |
| `RF-R3-NO-CARE-PLAN` | R3 | `Q-MED-PREGNANCY-CONFIRMED=confirmed` 且 `Q-MED-GESTATION-ESTIMATE=over12` 且 `Q-MED-CARE-PLAN=none` | `ACT-SOON-MEDICAL` | `SRC-NHC-FULL-CARE` |
| `RF-R3-MENTAL-FUNCTION` | R3 | `Q-MH-FUNCTION-IMPACT=SA` 且 (`Q-MH-MOOD-LOW=SA` 或 `Q-MH-WORRY-HIGH=SA`) 且 `Q-MH-SAFE-CONTACT in {SD,D,U}` | `ACT-SOON-MENTAL` | `SRC-NICE-CG192` |
| `RF-R2-AUTONOMY-PRESSURE` | R2 | 无 R3/R4 且 (`Q-SAFE-COERCION=pressure_no_fear` 或 `Q-PARTNER-CONTROL-RISK=pressure_no_fear`) | `ACT-CLARIFY-AUTONOMY` | `SRC-ACOG-REPRO-COERCION` |
| `RF-R2-MEDICAL-GAP` | R2 | 无 R3/R4 且 `Q-MED-PREGNANCY-CONFIRMED in {possible,unknown}`，或 `Q-MED-INTRAUTERINE-CONFIRMED in {not_confirmed,not_yet_confirmable,unknown}` 且 `Q-MED-CARE-PLAN in {none,unknown}` | `ACT-CLARIFY-MEDICAL` | `SRC-NHC-MATERNAL-CARE` |
| `RF-R2-WILL-PRESSURE` | R2 | 无 R3/R4 且 `Q-WILL-SELF-VS-OTHERS in {SD,D}` | `ACT-CLARIFY-WILL` | `SRC-OTTAWA-ODSF` |
| `RF-R2-MENTAL-SUPPORT-GAP` | R2 | 无 R3/R4 且 `Q-MH-FUNCTION-IMPACT in {A,SA}` 且 `Q-MH-SAFE-CONTACT in {SD,D,U}` | `ACT-CLARIFY-MENTAL` | `SRC-ACOG-PMH-SCREENING` |
| `RF-R1-MILD-MEDICAL` | R1 | 无更高等级且任一：`Q-SAFE-URGENT-SYMPTOM=mild`、`Q-MED-ABDOMINAL-PAIN=mild`、`Q-MED-BLEEDING=small`、`Q-MED-ASSOCIATED-SYMPTOMS=mild_one` | `ACT-WATCH-MEDICAL` | `SRC-CDC-UMWS` |
| `RF-R1-PRIVACY` | R1 | 无更高等级且 `Q-SAFE-PRIVACY-RISK in {some,high}` | `ACT-WATCH-PRIVACY` | `SRC-ACOG-IPV` |
| `RF-R1-FAMILY-BOUNDARY` | R1 | 无更高等级且 `Q-FAMILY-BOUNDARY-PRESSURE in {A,SA}` | `ACT-WATCH-BOUNDARY` | `SRC-ACOG-IPV` |
| `RF-R1-EMOTIONAL-PRESSURE` | R1 | 无更高等级且 (`Q-MH-MOOD-LOW in {A,SA}` 或 `Q-MH-WORRY-HIGH in {A,SA}`) | `ACT-WATCH-MENTAL` | `SRC-ACOG-PMH-SCREENING` |

`Q-SAFE-SELF-HARM=uncertain`、安全必答题的 `uncertain`，或任何安全题保存失败时不推定“没有风险”；它们使相应维度确定性为 `low`，并产生 `ACT-CLARIFY-SAFETY`，但不得单独升格为 R3/R4。

### 15.3 九维评分配置

下表中 `+` 为正向映射，`-` 为反向映射，`binary` 按括号中列明的有利 code 为 100、其他已回答 code 为 0。每行权重合计为 100。`U`、`uncertain`、`deferred` 与空值按 15.1 处理。

| dimension | 因子（answerKey：映射；权重） | 缺失策略 | source |
| --- | --- | --- | --- |
| `medicalSafetySupport` | `Q-MED-PREGNANCY-CONFIRMED: binary(confirmed);15`；`Q-MED-INTRAUTERINE-CONFIRMED: binary(confirmed);20`；`Q-MED-GESTATION-ESTIMATE: binary(under4,week4to6,week7to8,week9to12,over12);10`；`Q-MED-CARE-PLAN: booked=100,plan_to_book=70,none=20,unknown=excluded;15`；`Q-MED-ABDOMINAL-PAIN: none=100,mild=70,clear_or_persistent=30,severe_or_one_sided=0;15`；`Q-MED-BLEEDING: none=100,small=70,clear=30,heavy_or_with_pain_dizziness=0;15`；`Q-MED-ASSOCIATED-SYMPTOMS: none=100,mild_one=60,clear_one_or_more=0;10` | `exclude_and_certainty_only` | `SRC-NICE-NG126` |
| `mentalHealthSupport` | `Q-MH-MOOD-LOW:-;20`；`Q-MH-WORRY-HIGH:-;20`；`Q-MH-FUNCTION-IMPACT:-;25`；`Q-MH-SAFE-CONTACT:+;25`；`Q-MH-REGRET-WORRY:-;10` | `exclude_and_certainty_only` | `SRC-ACOG-PMH-SCREENING` |
| `autonomySafetySupport` | `Q-SAFE-FREE-ANSWER: safe=100,unsafe=0;20`；`Q-SAFE-PRIVACY-RISK: none=100,some=60,high=20;15`；`Q-SAFE-COERCION: none=100,pressure_no_fear=30,pressure_or_fear=0;25`；`Q-PARTNER-SAFE-TO-SPEAK:+;20`；`Q-PARTNER-CONTROL-RISK: none=100,pressure_no_fear=30,pressure_or_fear=0;20` | 安全必答未完成时仅 `certainty=low`，不以 50 当作安全 | `SRC-ACOG-IPV` |
| `personalWillClaritySupport` | `Q-WILL-SELF-VS-OTHERS:+;30`；`Q-WILL-INFORMATION-BLOCK:-;15`；`Q-WILL-VALUE-CONFLICT:-;20`；`Q-WILL-DECISION-TIME:+;20`；`Q-VALUE-BOUNDARIES-KNOWN:+;15` | `exclude_and_certainty_only` | `SRC-OTTAWA-ODSF` |
| `lifeDevelopmentSupport` | `Q-LIFE-PLAN-IMPORTANCE:-;10`；`Q-LIFE-CONTINUE-IMPACT:-;25`；`Q-LIFE-END-IMPACT:-;10`；`Q-LIFE-FREEDOM-IMPORTANCE:-;15`；`Q-LIFE-IDENTITY-PREPARED:+;20`；`Q-LIFE-PARTNER-SUPPORT:+;20` | `exclude_and_certainty_only` | `SPEC-SCORING-15` |
| `partnerCommitmentSupport` | `Q-PARTNER-RESPECT-AUTONOMY:+;20`；`Q-PARTNER-SAFE-TO-SPEAK:+;15`；`Q-PARTNER-CONCRETE-COMMITMENT:+;20`；`Q-PARTNER-PAST-RELIABILITY:+;15`；`Q-PARTNER-COMMITMENT-CATEGORIES: count=0→0,1to2→35,3to4→65,5to7→85,8→100;20`；`Q-PARTNER-CONTROL-RISK: none=100,pressure_no_fear=20,pressure_or_fear=0;10` | `exclude_and_certainty_only` | `SRC-ACOG-REPRO-COERCION` |
| `familySocialSupport` | `Q-FAMILY-SUPPORT-SOURCES: none=0,1=45,2=70,3_plus=100;15`；`Q-FAMILY-SUPPORT-TYPES: count=0→0,1to2→40,3to4→70,5_plus→100;15`；`Q-FAMILY-SUPPORT-STABILITY:+;25`；`Q-FAMILY-BOUNDARY-PRESSURE:-;20`；`Q-FAMILY-REFUSAL-CONSEQUENCE:-;15`；`Q-FAMILY-ACCEPT-SUPPORT:+;10` | `exclude_and_certainty_only` | `SPEC-SCORING-15` |
| `financialPolicySupport` | `Q-FIN-INCOME-STABLE:+;15`；`Q-FIN-SAVINGS-BUFFER:+;15`；`Q-FIN-FIXED-COST-PRESSURE:-;15`；`Q-FIN-INSURANCE-KNOWN:+;10`；`Q-FIN-CONTINUE-INCOME-IMPACT:-;15`；`Q-FIN-POLICY-KNOWN:+;10`；`Q-FIN-CONTINUE-BUDGET:+;10`；`Q-FIN-END-BUDGET:+;10` | `exclude_and_certainty_only`；政策卡片或成本参考不得作为因子 | `SRC-HZ-MEDICAL-INSURANCE` |
| `childcareLoadSupport` | 若 `Q-CHILD-COUNT=none`，固定 `score=100`、`certainty=high`；否则 `Q-CHILD-SPECIAL-NEEDS: none=100,mild=60,clear=20;20`；`Q-CHILD-PRIMARY-CARER: shared=100,partner=80,grandparents=70,service=70,self=40,other=50;20`；`Q-CHILD-CONTINUE-CARE-IMPACT:-;30`；`Q-CHILD-END-RECOVERY-CARE:+;30` | 有子女时 `exclude_and_certainty_only`；无子女不得因缺少条件题降分 | `SPEC-SCORING-15` |

分数转用户可见等级的精确映射为：`0–24=needs_immediate_attention`、`25–49=needs_priority_support`、`50–74=needs_confirmation`、`75–100=relatively_steady`。命中 R3/R4 的相关维度显示 `offline_support_first`，不显示上述等级。`lifeDevelopmentSupport < 50` 必须添加行动项 `ACT-LIFE-DEVELOPMENT-PRIORITY`，且不得被其他维度覆盖。

### 15.4 确定性与模型矛盾

对每个维度计算：`coverage = 已计分权重 / 总权重`，`uncertainWeight = U、uncertain 或 unknown 的权重 / 总权重`，`missingWeight = deferred 或 unanswered 的权重 / 总权重`。使用如下固定规则：

- `high`：`coverage >= 0.85`、`uncertainWeight <= 0.15`、`missingWeight <= 0.15`，且无下表矛盾；
- `medium`：`coverage >= 0.60`、`uncertainWeight <= 0.40`、`missingWeight <= 0.40`，且最多一个矛盾；
- `low`：其余全部情况，或安全必答未得到可判定回答。

矛盾只取本地预设类型：`C-WILL`（`Q-WILL-SELF-VS-OTHERS in {SD,D}` 且 `Q-WILL-DECISION-TIME in {A,SA}`）、`C-PARTNER`（`Q-PARTNER-CONCRETE-COMMITMENT in {A,SA}` 且 `Q-PARTNER-PAST-RELIABILITY in {SD,D}`）、`C-FAMILY`（`Q-FAMILY-SUPPORT-STABILITY in {A,SA}` 且 `Q-FAMILY-BOUNDARY-PRESSURE in {A,SA}`）、`C-FINANCE`（`Q-FIN-INCOME-STABLE in {A,SA}` 且 `Q-FIN-CONTINUE-BUDGET in {SD,D}`）、`C-LIFE`（`Q-LIFE-IDENTITY-PREPARED in {A,SA}` 且 `Q-LIFE-CONTINUE-IMPACT in {A,SA}`）。每个维度最多关联一个本地矛盾。

经 schema 校验的模型矛盾只能使用预设类型 `partner_reliability_conflict`、`will_vs_pressure_conflict`、`financial_confidence_conflict`、`development_priority_conflict`、`support_availability_conflict`；每次报告生成中每个相关维度最多从 `high→medium` 或 `medium→low` 降一级，`low` 不再降低。模型不得提高确定性、改变分数、红旗、角色或路径条件。无模型、模型失败或输出未通过校验时不执行该步骤。

### 15.5 深入模块推荐排序

无 R3/R4 时，为每个候选模块计算 `recommendationScore`：基础优先级 + `supportScore<25 ? 30 : supportScore<50 ? 15 : 0` + `certainty=low ? 20 : certainty=medium ? 5 : 0` + `R2 ? 25 : R1 ? 10 : 0`。按分数降序、再按下表 `moduleId` 升序取前 3 个；若最高分低于 15，仍取前 2 个基础模块。角色模块为额外项，不占 2–3 个名额。

| moduleId | 触发维度/规则 | 基础优先级 |
| --- | --- | ---: |
| `safety-deep` | `autonomySafetySupport` 或任意 R1/R2 | 100 |
| `medical-deep` | `medicalSafetySupport` 或 `RF-R1-MILD-MEDICAL` / `RF-R2-MEDICAL-GAP` | 90 |
| `mental-deep` | `mentalHealthSupport` 或 `RF-R1-EMOTIONAL-PRESSURE` / `RF-R2-MENTAL-SUPPORT-GAP` | 80 |
| `partner-deep` | `partnerCommitmentSupport` | 70 |
| `life-deep` | `lifeDevelopmentSupport` | 70 |
| `finance-deep` | `financialPolicySupport` | 60 |
| `care-deep` | `familySocialSupport` 或 `childcareLoadSupport` | 60 |
| `values-deep` | `personalWillClaritySupport` 或 `RF-R2-WILL-PRESSURE` | 60 |
| `aftercare-deep` | `Q-MH-REGRET-WORRY in {A,SA}` 或任一 `Q-DEEP-AFTER-*-PLAN` 未完成 | 45 |

`persona-deep` 总是作为第 4 个、可跳过的附加推荐项。R3/R4 时不生成上述常规清单，只展示对应线下支持行动；用户可在安全条件下继续填写，但报告不将深入模块作为优先事项。

### 15.6 路径条件、行动项与报告排序

路径条件只生成清单，不计算、展示或比较路径分数。每条的初始 `derivedStatus` 只能是 `confirmed` 或 `pending`；用户可在报告中设置独立 `readingStatus=confirmed|pending|deferred`，该操作不回写事实、评分、确定性或红旗。

| conditionId | 路径 | 初始确认谓词（全部满足才为 `confirmed`） | source |
| --- | --- | --- | --- |
| `PC-C-MEDICAL` | continue | `Q-MED-PREGNANCY-CONFIRMED=confirmed`、`Q-MED-INTRAUTERINE-CONFIRMED=confirmed`、`Q-MED-CARE-PLAN in {booked,plan_to_book}` | `SRC-NHC-MATERNAL-CARE` |
| `PC-C-PARTNER` | continue | `Q-PARTNER-RESPECT-AUTONOMY in {A,SA}`、`Q-PARTNER-CONCRETE-COMMITMENT in {A,SA}`、承诺类别至少 4 个 | `SPEC-SCORING-15` |
| `PC-C-FINANCE` | continue | `Q-FIN-INCOME-STABLE in {A,SA}`、`Q-FIN-SAVINGS-BUFFER in {A,SA}`、`Q-FIN-CONTINUE-BUDGET in {A,SA}` | `SPEC-SCORING-15` |
| `PC-C-CARE` | continue | `Q-CHILD-COUNT=none` 或 `Q-CHILD-CONTINUE-CARE-IMPACT in {SD,D,U}` 且 `Q-DEEP-CARE-NIGHT=arranged` | `SPEC-SCORING-15` |
| `PC-C-LIFE` | continue | `Q-LIFE-IDENTITY-PREPARED in {A,SA}` 且 `Q-LIFE-PARTNER-SUPPORT in {A,SA}` | `SPEC-SCORING-15` |
| `PC-C-BOUNDARY` | continue | `Q-WILL-SELF-VS-OTHERS in {A,SA}` 且 `Q-FAMILY-BOUNDARY-PRESSURE in {SD,D,U}` | `SRC-OTTAWA-ODSF` |
| `PC-E-MEDICAL` | end | `Q-MED-PREGNANCY-CONFIRMED=confirmed` 且 `Q-MED-CARE-PLAN in {booked,plan_to_book}` | `SRC-NHC-FAMILY-PLANNING` |
| `PC-E-SUPPORT` | end | `Q-DEEP-MED-APPOINTMENT-SUPPORT in {arranged,partly_arranged}` 或 `Q-MH-SAFE-CONTACT in {A,SA}` | `SPEC-SCORING-15` |
| `PC-E-SAFETY` | end | `Q-SAFE-FREE-ANSWER=safe` 且 `Q-SAFE-COERCION=none` 且 `Q-PARTNER-CONTROL-RISK=none` | `SRC-ACOG-REPRO-COERCION` |
| `PC-E-FINANCE` | end | `Q-FIN-END-BUDGET in {A,SA}` 或 `Q-DEEP-FIN-INCOME` 与 `Q-DEEP-FIN-FIXED-COST` 均已填写 | `SPEC-SCORING-15` |
| `PC-E-AFTERCARE` | end | `Q-DEEP-AFTER-END-PLAN` 已填写，或 `Q-DEEP-CARE-RECOVERY in {arranged,partly_arranged}` | `SRC-NHC-POSTABORTION` |
| `PC-E-FUTURE` | end | `Q-DEEP-VALUE-FUTURE-FERTILITY in {clear,partly_clear}` 或 `Q-DEEP-VALUE-REVIEW` 至少选择 2 项 | `SRC-OTTAWA-ODSF` |

行动项排序键固定为：`rankGroup`（R4=1，R3=2，维度分数<25=3，certainty low=4，维度分数25–49=5，R2=6，R1=7，未完成推荐模块=8）→ 维度分数升序 → `actionId` 升序。用户明确的重要主题只能生成预设标签行动项，位于第 7 组之后；自由文本原文不得进入排序、条件或报告。所有 R3/R4 动作优先使用其 `ACT-*`，并阻止其它普通报告段落。

### 15.7 不可用量表与测试夹具要求

`MEASURE-*` 均为 `unavailable` 时，正式量表题、量表分数、量表阳性阈值、人格维度和互动风格标签必须完全缺席。心理和角色功能仅按本节所列启发式键运行。

后续测试夹具至少覆盖：每条 `RF-*` 的边界；R4/R3 覆盖高分；每个维度权重和缺失阈值；无已有子女默认值；`lifeDevelopmentSupport < 50` 行动；所有推荐分数并列的 `moduleId` 排序；每条 `PC-*` 的 `confirmed/pending`；本地与模型矛盾最多降低一级；以及不可用量表不进入任何计算或展示。
