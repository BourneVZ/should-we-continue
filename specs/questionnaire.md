# Questionnaire Spec

更新时间：2026-06-26

本文档定义 `should-we-continue` MVP 的问卷结构、题型、跳题逻辑、敏感题处理、核心题目草案和深入问卷推荐机制。本文档不定义最终评分权重；评分、红旗优先级和等级映射由 `specs/scoring.md` 定义。

依据来源：`specs/research.md`

## 1. 问卷目标

问卷的目标是帮助早早孕女性在不被系统替代决策的前提下，完成以下工作：

- 识别身体、心理、胁迫和安全红旗。
- 确认怀孕状态、医学信息完整度和需要线下就医确认的问题。
- 梳理本人真实倾向、价值冲突、人生节奏和长期影响。
- 梳理伴侣态度、尊重程度、具体承诺和已验证行动。
- 梳理家庭支持、经济条件、政策信息、已有子女和照护网络。
- 生成个人决策支持报告。
- 为后续伴侣共同讨论版提供可选分享材料。

问卷不得做以下事情：

- 不输出“应该继续妊娠”或“应该中止妊娠”。
- 不提供医疗、药物、手术、法律或心理诊断建议。
- 不用大模型自由发明题目、评分规则、红旗规则或角色类型。
- 不包含占卜、预测或类似功能。

## 2. 总体结构

MVP 采用“核心问卷 + 系统推荐深入问卷”的结构。

### 2.0 首次进入与填写进度

首次进入时，先显示一屏简短说明：本工具用于决策支持、不替代线下专业支持、回答默认保存于当前浏览器本地；完成核心问卷后会先获得深入补充建议，最终报告会提供角色化的决策支持理解，但不展示任何预判角色或插画。用户确认开始后，第一步必须进入“安全与自主检查”，不得先展示角色、路径比较或趣味化内容。

问卷填写过程显示精确题数和百分比进度。跳题、可选深入模块和已跳过的题目必须反映在当前可答题数中，不能用固定总题数制造错误进度。

安全与自主检查中的每一题单独显示，避免敏感问题与普通题混排。核心问卷的其余模块以每页 3-5 题的紧凑题组呈现，以减少移动端翻页次数，同时保持题目易读和可跳过状态清晰。

每完成一个核心模块，显示简短模块间歇页：当前模块已完成、总体进度和一个“继续”按钮；不得在此显示分析、评分、角色线索或路径倾向。

所有已访问的问卷页均可返回修改，修改后自动保存到浏览器本地。返回不重置后续答案；如修改会影响跳题条件、深入推荐或已生成报告，系统必须标记相关结果需要更新，而不静默删除用户已有内容。用户中途关闭页面后，下次从首页点击“继续填写”时回到上次未完成位置。

若浏览器本地存储不可用、空间不足或当前写入失败，必须显示明确的保存失败提示，并阻止继续切换问卷页面、执行“稍后继续”、离开填写流程或生成报告，直到当前回答成功保存。当前页面中已填写的内容应保留在内存中供用户重试，但不得被表示为已保存。

除自动保存外，问卷页始终提供明确的“稍后继续”操作。该操作只退出当前填写界面，不清除任何本机草稿；用户下次进入后可从首页的“继续填写”恢复。

除红旗和安全提示外，普通题目填写期间不显示即时分析、小结、路径倾向或角色线索；用户完成核心问卷后先查看深入模块建议，完成推荐模块或明确跳过后再统一查看最终报告。

问卷题干和模块引导使用温和、直接、非幽默的语言，避免调侃、暗示性措辞或角色化表达。轻幽默只可出现在完成后的角色与报告模块，并受 `specs/personas.md` 的禁区约束。

### 2.1 核心问卷

核心问卷实际作答项总数最多可为 80 项；不对完成时长作固定承诺，始终显示已答题数、当前可答题数和百分比进度。需要更多信息时仍优先推荐深入模块，而不是无边界扩张核心问卷。

核心问卷必须覆盖红旗识别、9 个一级维度、最终报告和深入模块推荐所需信息。

核心问卷包含 11 个模块：

1. 安全与隐私检查
2. 怀孕状态与医学基础信息
3. 当前真实倾向与不确定性
4. 心理状态与情绪承载力
5. 个人发展与人生节奏
6. 伴侣关系与具体承诺
7. 家庭与社会支持
8. 经济与政策准备度
9. 已有子女与照护负担
10. 价值观、遗憾承受与不可量化因素
11. 自由补充与分享偏好

### 2.2 深入问卷

目标追加时间：15-25 分钟，可选。

深入问卷的重点是减少短视决策，而不是堆题量。用户完成核心问卷后，系统根据回答推荐 2-3 个最值得补充的深入模块；用户也可以手动选择其他模块。此时不生成常规基础报告：用户完成推荐模块，或明确选择跳过后，才生成最终个人报告。

如果用户未完成深入问卷，系统仍可生成个人报告，但报告顶部必须提示“长远影响校验不足，部分结论确定性较低”。

深入问卷模块：

1. 医疗路径与信息缺口
2. 心理与情绪支持细化
3. 详细经济预算
4. 伴侣承诺细化
5. 个人发展细化
6. 照护网络细化
7. 价值澄清与未来生育规划
8. 决定后支持计划
9. 安全与自主保护，仅在相关风险触发时推荐
10. 角色化类型细化

用户进入任一深入模块前，显示该模块的预计题数和用途；深入模块的题数不并入已完成的核心问卷百分比。

## 3. 题型策略

### 3.1 量表

核心问卷以 1-5 量表为主：

1. 完全不同意
2. 有点不同意
3. 不确定 / 说不清
4. 有点同意
5. 非常同意

深入问卷可以少量使用 1-7 量表，用于需要更细分的题目，例如伴侣承诺可信度、个人发展影响程度、价值冲突强度。

### 3.2 选择题

选择题用于：

- 状态确认，例如是否确认怀孕。
- 跳题逻辑，例如是否已有孩子。
- 红旗识别，例如是否有剧烈腹痛或被胁迫。
- 单选倾向，例如当前更接近继续、中止、拉扯、不确定。

### 3.3 自由文本

自由文本只用于少数关键位置：

- 还有什么没有被问到。
- 此刻最害怕的事。
- 最希望伴侣理解的事。
- 对未来自己的提醒。

自由文本默认标记为 `private`。

所有自由文本输入默认折叠，用户主动点击后才展开填写；留空不影响继续填写或报告生成。

### 3.4 不确定与不想回答

必须区分：

- `3 = 不确定 / 说不清`：参与不确定性分析，可能触发澄清问题或深入模块推荐。
- `暂时不想回答`：不参与评分，标记为缺失或敏感回避。

### 3.5 决策风格与正式角色测评

核心问卷不新增人格或角色测评页面。角色输入仅来自深入模块中的 12 个启发式题；它们只用于理解更需要的信息、陪伴、空间、承诺或长期复盘，不得参与红旗、医学判断、九个 `supportScore` 或去留条件清单。

`specs/measures.md` 当前将 PHQ-2、GAD-2、PHQ-9、GAD-7、IPIP-50、GDMS-25 和 ECR-RS-9 全部锁定为 `unavailable`。因此 MVP 不含 96 题完整角色测评、不含任何正式量表题项或分数；“角色化类型细化”仅含本节定义的 12 个产品启发式题。日后不得以英文题项、项目自译或模型翻译替代。

## 3.6 Phase 0 规范题库目录

本节为后续实现、评分、跳题和报告的唯一机器可读来源；前文“题目草案”仅用于解释意图，如与本节冲突，以本节为准。规则只能引用 `answerKey`、选项 code 和本节的可见条件，不能引用题干、数组下标或自由文本。

### 3.6.1 通用回答与元数据约定

- 回答状态固定为 `answered`、`uncertain`、`deferred`、`unanswered`。`deferred` 是用户明确选择“暂时不想回答”，不是空值，也不得按负面答案或 `uncertain` 计分。
- `required` 表示必须得到一个允许的 `answered` 或 `uncertain` 选项；除表中明确 `canDefer: true` 的题目外，`deferred` 不满足必答。`optional` 允许保留 `unanswered` 或选择 `deferred`。
- `sensitivity` 取 `standard | sensitive | safety_critical`；`shareDefault` 固定为 `private`，除非表中明确为 `shareable_summary`。即使是 `shareable_summary`，共同讨论页也必须经用户逐项授权。
- `type` 取 `single`、`multi`、`scale5`、`number`、`date`、`text`。所有 `scale5` 使用 `SD`、`D`、`U`、`A`、`SA`；`U` 是有意义的不确定回答，`deferred` 仍为独立状态。
- `source` 为 `sourceId` 或产品规格依据。`SPEC-QUESTIONNAIRE` 表示本项目的非医学启发式题；它不能被解释成正式量表。

通用选项集如下；表中只允许引用这些 code 或明确列出的枚举 code：

| optionSet | 允许 code |
| --- | --- |
| `SAFE` | `safe`, `uncertain`, `unsafe` |
| `CONCERN` | `none`, `some`, `high`, `uncertain` |
| `URGENCY` | `none`, `mild`, `clear`, `severe`, `uncertain` |
| `YES_NO_UNKNOWN` | `yes`, `no`, `unknown` |
| `SD_D_U_A_SA` | `SD`, `D`, `U`, `A`, `SA` |
| `NONE_SOME_HIGH` | `none`, `some`, `high`, `uncertain` |
| `PROGRESS` | `confirmed`, `pending`, `deferred` |

### 3.6.2 核心题库

| answerKey | 题目/用途 | type / 选项 | required、sensitivity、shareDefault | 可见条件 | module | source |
| --- | --- | --- | --- | --- | --- |
| `Q-SAFE-FREE-ANSWER` | 能否安全、独自、自由填写 | `single: SAFE` | `required`; `safety_critical`; `private` | 始终 | safety | `SRC-ACOG-IPV` |
| `Q-SAFE-PRIVACY-RISK` | 担心他人看到回答的风险 | `single: CONCERN` | `required`; `safety_critical`; `private` | 始终 | safety | `SRC-ACOG-IPV` |
| `Q-SAFE-COERCION` | 是否被要求继续或中止妊娠 | `single: none, pressure_no_fear, pressure_or_fear, uncertain` | `required`; `safety_critical`; `private` | 始终 | safety | `SRC-ACOG-REPRO-COERCION` |
| `Q-SAFE-SELF-HARM` | 自伤、自杀或无法保证安全的念头 | `single: none, passing_but_safe, unsafe_now, uncertain` | `required`; `safety_critical`; `private` | 始终 | safety | `SRC-ACOG-CPG-2023` |
| `Q-SAFE-URGENT-SYMPTOM` | 严重腹痛、出血、晕厥、胸痛、呼吸困难等急症 | `single: URGENCY` | `required`; `safety_critical`; `private` | 始终 | safety | `SRC-CDC-UMWS` |
| `Q-MED-PREGNANCY-CONFIRMED` | 是否确认怀孕 | `single: confirmed, possible, unknown` | `required`; `sensitive`; `private` | 始终 | medical | `SRC-NHC-MATERNAL-CARE` |
| `Q-MED-CONFIRMATION-METHOD` | 确认方式 | `multi: test, blood, ultrasound, clinician, other` | `optional`; `sensitive`; `private`; `canDefer: true` | `Q-MED-PREGNANCY-CONFIRMED=confirmed` | medical | `SRC-NHC-MATERNAL-CARE` |
| `Q-MED-LMP-KNOWN` | 末次月经日期的掌握程度 | `single: exact_date, approximate, unknown, irregular` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | medical | `SRC-NICE-NG126` |
| `Q-MED-LMP-DATE` | 末次月经日期 | `date` | `optional`; `sensitive`; `private`; `canDefer: true` | `Q-MED-LMP-KNOWN=exact_date` | medical | `SRC-NICE-NG126` |
| `Q-MED-GESTATION-ESTIMATE` | 估计孕周 | `single: under4, week4to6, week7to8, week9to12, over12, unknown` | `required`; `sensitive`; `private` | 始终 | medical | `SRC-NHC-MATERNAL-CARE` |
| `Q-MED-INTRAUTERINE-CONFIRMED` | 是否确认宫内妊娠 | `single: confirmed, not_confirmed, not_yet_confirmable, unknown` | `required`; `sensitive`; `private` | 始终 | medical | `SRC-NICE-NG126` |
| `Q-MED-ABDOMINAL-PAIN` | 过去 48 小时腹痛程度 | `single: none, mild, clear_or_persistent, severe_or_one_sided, uncertain` | `required`; `safety_critical`; `private` | 始终 | medical | `SRC-NICE-NG126` |
| `Q-MED-BLEEDING` | 过去 48 小时出血程度 | `single: none, small, clear, heavy_or_with_pain_dizziness, uncertain` | `required`; `safety_critical`; `private` | 始终 | medical | `SRC-NICE-NG126` |
| `Q-MED-ASSOCIATED-SYMPTOMS` | 肩尖痛、头晕、晕厥、发热或明显虚弱 | `single: none, mild_one, clear_one_or_more, uncertain` | `required`; `safety_critical`; `private` | 始终 | medical | `SRC-NHS-ECTOPIC` |
| `Q-MED-CLINICIAN-RISK` | 医生是否提示高风险或尽快复查 | `single: none, unclear, urgent_follow_up, not_seen` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | medical | `SRC-NHC-MATERNAL-CARE` |
| `Q-MED-CARE-PLAN` | 是否已有就诊计划 | `single: booked, plan_to_book, none, unknown` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | medical | `SRC-NHC-FULL-CARE` |
| `Q-MED-CLINICIAN-DISCLOSURE` | 是否有需告知医生的既往情况 | `single: none, possible, clinician_flagged, uncertain` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | medical | `SRC-NHC-MATERNAL-CARE` |
| `Q-WILL-CURRENT-DIRECTION` | 不考虑他人期待时的当前状态 | `single: lean_continue, lean_end, conflicted, no_direction, deferred` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | will | `SRC-OTTAWA-ODSF` |
| `Q-WILL-SELF-VS-OTHERS` | 能否区分自身想法和外界期待 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | will | `SRC-OTTAWA-ODSF` |
| `Q-WILL-INFORMATION-BLOCK` | 主要卡在信息不足 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | will | `SRC-IPDAS` |
| `Q-WILL-VALUE-CONFLICT` | 主要卡在价值冲突 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | will | `SRC-OTTAWA-ODSF` |
| `Q-WILL-DECISION-TIME` | 是否有足够时间不仓促决定 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | will | `SRC-NICE-NG197` |
| `Q-WILL-MAIN-BLOCK-TEXT` | 最影响判断的一件事 | `text` | `optional`; `sensitive`; `private` | 用户主动展开 | will | `SPEC-QUESTIONNAIRE` |
| `Q-MH-MOOD-LOW` | 当前低落、兴趣下降的支持需要 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | mental | `SRC-ACOG-PMH-SCREENING` |
| `Q-MH-WORRY-HIGH` | 当前紧张、担忧难以放下的支持需要 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | mental | `SRC-ACOG-PMH-SCREENING` |
| `Q-MH-FUNCTION-IMPACT` | 睡眠、进食、工作或日常生活受影响 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | mental | `SRC-NICE-CG192` |
| `Q-MH-SAFE-CONTACT` | 是否有可安全倾诉的人 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | mental | `SRC-ACOG-PMH-SCREENING` |
| `Q-MH-REGRET-WORRY` | 后悔担忧的强度 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | mental | `SPEC-QUESTIONNAIRE` |
| `Q-MH-NEED-NOW` | 此刻最需要的支持 | `single: medical_info, emotional_support, partner_commitment, family_boundary, financial_plan, time_alone, unclear` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | mental | `SPEC-QUESTIONNAIRE` |
| `Q-LIFE-PLAN-IMPORTANCE` | 未来 1–3 年的重要发展计划 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | life | `SPEC-QUESTIONNAIRE` |
| `Q-LIFE-CONTINUE-IMPACT` | 继续妊娠会影响发展计划 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | life | `SPEC-QUESTIONNAIRE` |
| `Q-LIFE-END-IMPACT` | 中止妊娠也会有个人影响 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | life | `SPEC-QUESTIONNAIRE` |
| `Q-LIFE-FREEDOM-IMPORTANCE` | 生活自由和个人空间的重要性 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | life | `SPEC-QUESTIONNAIRE` |
| `Q-LIFE-IDENTITY-PREPARED` | 对身份和重心变化的准备 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | life | `SPEC-QUESTIONNAIRE` |
| `Q-LIFE-PARTNER-SUPPORT` | 伴侣愿为个人发展提供实际支持 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | life | `SPEC-QUESTIONNAIRE` |
| `Q-LIFE-NONNEGOTIABLE` | 当前最不想牺牲的事项 | `single: career, study, body, time_freedom, relationship, family_rhythm, financial_security, unclear` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | life | `SPEC-QUESTIONNAIRE` |
| `Q-PARTNER-AWARE` | 伴侣是否知道 | `single: aware, unaware, unsure_tell, deferred` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | partner | `SPEC-QUESTIONNAIRE` |
| `Q-PARTNER-DIRECTION` | 伴侣当前倾向 | `single: lean_continue, lean_end, unclear, unaware, deferred` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | partner | `SPEC-QUESTIONNAIRE` |
| `Q-PARTNER-RESPECT-AUTONOMY` | 尊重身体自主与本人意愿 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | partner | `SRC-ACOG-REPRO-COERCION` |
| `Q-PARTNER-SAFE-TO-SPEAK` | 能否安全表达真实想法 | `scale5: SD_D_U_A_SA` | `optional`; `safety_critical`; `private`; `canDefer: true` | 始终 | partner | `SRC-ACOG-IPV` |
| `Q-PARTNER-CONCRETE-COMMITMENT` | 是否有具体责任承诺 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | partner | `SPEC-QUESTIONNAIRE` |
| `Q-PARTNER-PAST-RELIABILITY` | 过去压力事件中的可靠性 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | partner | `SPEC-QUESTIONNAIRE` |
| `Q-PARTNER-CONTROL-RISK` | 施压、控制、威胁或害怕 | `single: none, pressure_no_fear, pressure_or_fear, uncertain` | `required`; `safety_critical`; `private` | 始终 | partner | `SRC-ACOG-IPV` |
| `Q-PARTNER-COMMITMENT-CATEGORIES` | 已明确的承诺类别 | `multi: medical, financial, labor, boundary, emotional, long_term_parenting, childcare, contingency, none` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | partner | `SPEC-QUESTIONNAIRE` |
| `Q-FAMILY-SUPPORT-SOURCES` | 可提供实际支持的人 | `multi: own_parents, partner_parents, friends, relatives, employer, professional, none` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | family | `SPEC-QUESTIONNAIRE` |
| `Q-FAMILY-SUPPORT-TYPES` | 可用支持的类型 | `multi: money, appointment, recovery_care, childcare, household, emotional, housing, other` | `optional`; `sensitive`; `private`; `canDefer: true` | `Q-FAMILY-SUPPORT-SOURCES!=none` | family | `SPEC-QUESTIONNAIRE` |
| `Q-FAMILY-SUPPORT-STABILITY` | 支持稳定可靠 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | family | `SPEC-QUESTIONNAIRE` |
| `Q-FAMILY-BOUNDARY-PRESSURE` | 支持会带来控制、指责或边界压力 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | family | `SRC-ACOG-IPV` |
| `Q-FAMILY-REFUSAL-CONSEQUENCE` | 拒绝家人意见的严重后果 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | family | `SRC-ACOG-REPRO-COERCION` |
| `Q-FAMILY-ACCEPT-SUPPORT` | 愿意接受可获得支持 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | family | `SPEC-QUESTIONNAIRE` |
| `Q-FIN-INCOME-STABLE` | 收入总体稳定 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | finance | `SRC-NBS-STAT-2024` |
| `Q-FIN-SAVINGS-BUFFER` | 储蓄缓冲足够 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | finance | `SPEC-QUESTIONNAIRE` |
| `Q-FIN-FIXED-COST-PRESSURE` | 固定支出压力 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | finance | `SPEC-QUESTIONNAIRE` |
| `Q-FIN-INSURANCE-KNOWN` | 医保、商业险或生育险掌握程度 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | finance | `SRC-HZ-MEDICAL-INSURANCE` |
| `Q-FIN-CONTINUE-INCOME-IMPACT` | 继续妊娠的收入中断影响 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | finance | `SPEC-QUESTIONNAIRE` |
| `Q-FIN-POLICY-KNOWN` | 杭州/单位政策掌握程度 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | finance | `SRC-ZJ-POPULATION-LAW-FTU` |
| `Q-FIN-CONTINUE-BUDGET` | 继续妊娠相关预算可承受性 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | finance | `SPEC-QUESTIONNAIRE` |
| `Q-FIN-END-BUDGET` | 中止妊娠相关预算可承受性 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | finance | `SPEC-QUESTIONNAIRE` |
| `Q-CHILD-COUNT` | 是否已有子女 | `single: none, one, two, three_plus` | `required`; `sensitive`; `private` | 始终 | childcare | `SPEC-QUESTIONNAIRE` |
| `Q-CHILD-AGE-BANDS` | 子女年龄段 | `multi: age0to3, age3to6, primary, secondary_plus` | `optional`; `sensitive`; `private`; `canDefer: true` | `Q-CHILD-COUNT!=none` | childcare | `SPEC-QUESTIONNAIRE` |
| `Q-CHILD-SPECIAL-NEEDS` | 是否有明显额外照护需要 | `single: none, mild, clear, uncertain` | `optional`; `sensitive`; `private`; `canDefer: true` | `Q-CHILD-COUNT!=none` | childcare | `SPEC-QUESTIONNAIRE` |
| `Q-CHILD-PRIMARY-CARER` | 当前主要照护者 | `single: self, partner, shared, grandparents, service, other` | `optional`; `sensitive`; `private`; `canDefer: true` | `Q-CHILD-COUNT!=none` | childcare | `SPEC-QUESTIONNAIRE` |
| `Q-CHILD-CONTINUE-CARE-IMPACT` | 继续妊娠对现有孩子照护影响 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | `Q-CHILD-COUNT!=none` | childcare | `SPEC-QUESTIONNAIRE` |
| `Q-CHILD-END-RECOVERY-CARE` | 中止后的短期照护安排 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | `Q-CHILD-COUNT!=none` | childcare | `SPEC-QUESTIONNAIRE` |
| `Q-VALUE-AUTONOMY-SAFETY` | 身体自主与心理安全的重要性 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | values | `SRC-IPDAS` |
| `Q-VALUE-FAMILY-CONTINUITY` | 家庭延续或迎接新生命的重要性 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | values | `SRC-IPDAS` |
| `Q-VALUE-SHARED-RESPONSIBILITY` | 关系稳定和共同承担的重要性 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | values | `SRC-IPDAS` |
| `Q-VALUE-LIFE-RHYTHM` | 人生节奏和个人发展的重要性 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | values | `SRC-IPDAS` |
| `Q-VALUE-CONTINUE-REGRET` | 能否想象继续后的可能遗憾 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | values | `SRC-OTTAWA-ODSF` |
| `Q-VALUE-END-REGRET` | 能否想象中止后的可能遗憾 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | values | `SRC-OTTAWA-ODSF` |
| `Q-VALUE-BOUNDARIES-KNOWN` | 是否知道不可接受的底线 | `scale5: SD_D_U_A_SA` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | values | `SRC-OTTAWA-ODSF` |
| `Q-VALUE-PRIORITIES` | 最希望被认真对待的前三项 | `multi(max=3): autonomy, family, relationship, life, finance, childcare, health, unclear` | `optional`; `sensitive`; `private`; `canDefer: true` | 始终 | values | `SRC-IPDAS` |
| `Q-VALUE-FUTURE-NOTE` | 给未来自己的提醒 | `text` | `optional`; `sensitive`; `private` | 用户主动展开 | values | `SPEC-QUESTIONNAIRE` |
| `Q-FREE-OTHER-TEXT` | 其他重要内容 | `text` | `optional`; `sensitive`; `private` | 用户主动展开 | free | `SPEC-QUESTIONNAIRE` |
| `Q-FREE-PARTNER-UNDERSTAND-TEXT` | 希望伴侣理解的一句话 | `text` | `optional`; `sensitive`; `private` | 用户主动展开 | free | `SPEC-QUESTIONNAIRE` |
| `Q-SHARE-INTENT` | 是否愿意之后逐项选择分享 | `single: willing, maybe_with_selection, not_now` | `optional`; `standard`; `private`; `canDefer: true` | 始终 | sharing | `SPEC-REPORT-SHARING` |

### 3.6.3 深入、伴侣与角色启发式题库

深入题全部 `optional`、`sensitive`、`private` 且 `canDefer: true`；它们只在用户主动进入模块后可见。除非对应条目明确授权，均不进入伴侣共享包。

| answerKey | 题目/用途 | type / 选项 | 模块与可见条件 | source |
| --- | --- | --- | --- | --- |
| `Q-DEEP-MED-NEXT-STEPS` | 是否明确下一步需要确认的医学问题 | `single: yes, no, unknown` | medical-deep；用户进入 | `SRC-NHC-FULL-CARE` |
| `Q-DEEP-MED-APPOINTMENT-SUPPORT` | 就医陪同与请假安排 | `single: arranged, partly_arranged, none, unknown` | medical-deep；用户进入 | `SRC-NHC-MATERNAL-CARE` |
| `Q-DEEP-MED-EMERGENCY-PLAN` | 出现急症时的线下求助安排 | `single: arranged, partly_arranged, none, unknown` | medical-deep；用户进入 | `SRC-CDC-UMWS` |
| `Q-DEEP-MED-CLINICIAN-QUESTIONS` | 希望询问线下医生的问题 | `text` | medical-deep；用户主动展开 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-MH-SUPPORT-HISTORY` | 既往心理支持概览 | `single: none, prior_support, current_support, prefer_not_say` | mental-deep；用户进入 | `SRC-NICE-CG192` |
| `Q-DEEP-MH-REST-PLAN` | 当前休息、减负与安全倾诉安排 | `single: arranged, partly_arranged, none, unknown` | mental-deep；用户进入 | `SRC-ACOG-PMH-SCREENING` |
| `Q-DEEP-MH-PROFESSIONAL-QUESTION` | 希望在线下确认的问题 | `text` | mental-deep；用户主动展开 | `SRC-NICE-CG192` |
| `Q-DEEP-FIN-INCOME` | 可用于规划的月收入 | `number` | finance-deep；用户进入 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-FIN-SAVINGS` | 可用于规划的储蓄 | `number` | finance-deep；用户进入 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-FIN-FIXED-COST` | 固定支出与债务 | `number` | finance-deep；用户进入 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-FIN-CHILDCARE-BUDGET` | 可承受的照护预算 | `number` | finance-deep；用户进入 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-FIN-INCOME-GAP-MONTHS` | 可能的收入中断月数 | `number` | finance-deep；用户进入 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-PARTNER-COMMITMENT-EVIDENCE` | 八类承诺是否已有行动证明 | `multi: medical, financial, labor, boundary, emotional, long_term_parenting, childcare, contingency, none` | partner-deep；用户进入 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-PARTNER-COMMITMENT-TIMELINE` | 是否有承诺时间表 | `single: yes, partly, no, unknown` | partner-deep；用户进入 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-PARTNER-COMMITMENT-TRUST` | 对承诺可执行性的信任 | `scale5: SD_D_U_A_SA` | partner-deep；用户进入 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-LIFE-PLANS` | 1、3、5 年计划概览 | `text` | life-deep；用户主动展开 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-LIFE-REPLACEABILITY` | 哪些计划不可替代 | `text` | life-deep；用户主动展开 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-LIFE-PARTNER-TRADEOFF` | 伴侣是否愿承担发展代价 | `single: yes, partly, no, unknown` | life-deep；用户进入 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-CARE-RECOVERY` | 恢复期照护安排 | `single: arranged, partly_arranged, none, unknown` | care-deep；用户进入 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-CARE-NIGHT` | 夜间照护安排 | `single: arranged, partly_arranged, none, unknown` | care-deep；用户进入 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-CARE-BACKUP` | 支持撤回后的备选方案 | `single: arranged, partly_arranged, none, unknown` | care-deep；用户进入 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-VALUE-FUTURE-FERTILITY` | 本次与未来生育计划的区分 | `single: clear, partly_clear, unclear, deferred` | values-deep；用户进入 | `SRC-OTTAWA-ODSF` |
| `Q-DEEP-VALUE-REVIEW` | 1 周、1 月、1 年、5 年复盘 | `multi: week1, month1, year1, year5` | values-deep；用户进入 | `SRC-OTTAWA-ODSF` |
| `Q-DEEP-AFTER-CONTINUE-PLAN` | 继续路径的支持计划 | `text` | aftercare-deep；用户主动展开 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-AFTER-END-PLAN` | 中止路径的支持计划 | `text` | aftercare-deep；用户主动展开 | `SPEC-QUESTIONNAIRE` |
| `Q-DEEP-SAFETY-DELETE-ABILITY` | 能否安全清除本机记录 | `single: yes, no, unknown` | safety-deep；仅 `Q-SAFE-PRIVACY-RISK!=none` 或安全规则命中 | `SRC-ACOG-IPV` |
| `Q-DEEP-SAFETY-TRUSTED-CONTACT` | 是否有可信赖的线下联系人 | `single: yes, no, unknown` | safety-deep；仅 `Q-SAFE-PRIVACY-RISK!=none` 或安全规则命中 | `SRC-ACOG-IPV` |
| `Q-DEEP-SAFETY-SHARING-AVOID` | 是否应避免生成共同讨论页 | `single: yes, no, unknown` | safety-deep；仅安全规则命中 | `SRC-ACOG-REPRO-COERCION` |
| `Q-ROLE-FACT-CHECK` | 决定前核实事实的需要 | `scale5: SD_D_U_A_SA` | persona-deep；用户进入 | `SPEC-PERSONAS` |
| `Q-ROLE-PLAN-LIST` | 把现实安排写成清单的需要 | `scale5: SD_D_U_A_SA` | persona-deep；用户进入 | `SPEC-PERSONAS` |
| `Q-ROLE-CHANGE-SENSITIVITY` | 对环境变化与他人意见的敏感度 | `scale5: SD_D_U_A_SA` | persona-deep；用户进入 | `SPEC-PERSONAS` |
| `Q-ROLE-NEED-SUPPORT` | 被陪伴、被倾听的需要 | `scale5: SD_D_U_A_SA` | persona-deep；用户进入 | `SPEC-PERSONAS` |
| `Q-ROLE-EMOTION-EXPRESSION` | 表达复杂感受的需要 | `scale5: SD_D_U_A_SA` | persona-deep；用户进入 | `SPEC-PERSONAS` |
| `Q-ROLE-NEED-SPACE` | 独处与留白的需要 | `scale5: SD_D_U_A_SA` | persona-deep；用户进入 | `SPEC-PERSONAS` |
| `Q-ROLE-SHARED-PARTICIPATION` | 需要共同参与的程度 | `scale5: SD_D_U_A_SA` | persona-deep；用户进入 | `SPEC-PERSONAS` |
| `Q-ROLE-COMMITMENT-EVIDENCE` | 看重具体承诺与行动证据 | `scale5: SD_D_U_A_SA` | persona-deep；用户进入 | `SPEC-PERSONAS` |
| `Q-ROLE-BOUNDARY-NEED` | 看重家庭边界保护 | `scale5: SD_D_U_A_SA` | persona-deep；用户进入 | `SPEC-PERSONAS` |
| `Q-ROLE-LONG-TERM-REVIEW` | 看重长期影响复盘 | `scale5: SD_D_U_A_SA` | persona-deep；用户进入 | `SPEC-PERSONAS` |
| `Q-ROLE-LIFE-CONTINUITY` | 看重自我发展连续性 | `scale5: SD_D_U_A_SA` | persona-deep；用户进入 | `SPEC-PERSONAS` |
| `Q-ROLE-RESOURCE-CAPACITY` | 看重现实资源承载 | `scale5: SD_D_U_A_SA` | persona-deep；用户进入 | `SPEC-PERSONAS` |
| `Q-PARTNER-SUPPORT-PREFERENCE` | 伴侣自己的沟通偏好 | `multi: facts, empathy, checklist, gradual, space` | partner-independent；伴侣主动开始 | `SPEC-QUESTIONNAIRE` |
| `Q-PARTNER-OFFER-CATEGORIES` | 伴侣愿意提供的支持类别 | `multi: medical, financial, labor, boundary, emotional, long_term_parenting, childcare, contingency` | partner-independent；伴侣主动开始 | `SPEC-QUESTIONNAIRE` |
| `Q-PARTNER-DISCUSS-TOPICS` | 伴侣愿意讨论的事项 | `multi: medical, finance, labor, boundary, emotional, future, childcare` | partner-independent；伴侣主动开始 | `SPEC-QUESTIONNAIRE` |
| `Q-PARTNER-SHARE-SUMMARY` | 伴侣是否主动分享摘要 | `single: share, do_not_share` | partner-independent；伴侣完成自己摘要后 | `SPEC-REPORT-SHARING` |

正式量表条目不会出现在本题库。伴侣不完成任何人格、依恋或量表测评；其独立流程仅包含上表四个自述与主动共享选择。

## 4. 必答、跳过与缺失规则

### 4.1 必答题

以下题目必须回答，或至少选择“不确定”：

- 当前是否能安全独自填写。
- 是否存在身体急症。
- 是否存在自伤或自杀念头。
- 是否存在被迫继续或被迫中止。
- 是否已确认怀孕。
- 是否有腹痛、出血、肩尖痛、晕厥、发热等症状。
- 是否确认宫内妊娠。

### 4.2 可跳过题

以下题目允许选择“暂时不想回答”：

- 真实倾向。
- 心理状态细节。
- 伴侣可靠性担忧。
- 家庭暴力或胁迫细节。
- 价值观和遗憾想象。
- 自由文本。

除安全与医学状态题外，核心问卷的其他题目均允许选择“暂时不想回答”。跳过不视为负面答案，必须按信息缺失和确定性规则处理。

### 4.3 信息不足

如果用户跳过过多核心题，仍可生成报告，但报告必须：

- 标记信息不足的维度。
- 降低对应维度的确定性表达。
- 优先列出需要补充的信息。
- 不用缺失信息推断结论。

## 5. 本地草稿与敏感题

MVP 默认使用本地浏览器保存草稿。

规则：

- 默认保存所有回答，包括敏感题。
- 不做账号、不上传云端、不使用云端数据库。
- 首次进入敏感模块前提示：回答会保存在本机浏览器，可能被同设备使用者看到。
- 始终提供本机数据清除入口，允许分别清除用户数据、伴侣数据或全部本机数据。
- 不提供单独隐私模式。
- 伴侣共同版仍只包含用户主动勾选愿意分享的内容。

敏感题默认标记为 `private`，包括：

- 自伤或自杀念头。
- 被胁迫、暴力、控制或监控。
- 当前真实倾向。
- 对伴侣可靠性的担忧。
- 对家庭支持的拒绝、害怕或冲突。
- 自由文本。

## 6. 核心问卷模块

### 6.1 安全与隐私检查

目的：先确认用户能安全填写，并识别需要立即线下支持的红旗。

引用依据：`research.md` 第 3、4 节。

题目草案：

1. 你现在是否能安全、独自、自由地填写这份问卷？
   - 可以
   - 不太确定
   - 不可以

2. 你是否担心伴侣、家人或其他人看到你的回答后会产生风险？
   - 不担心
   - 有点担心
   - 很担心
   - 暂时不想回答

3. 是否有人正在要求你必须继续妊娠，或必须中止妊娠？
   - 没有
   - 有，但不是强迫
   - 有，并让我感到压力或害怕
   - 暂时不想回答

4. 你现在是否有伤害自己、结束生命，或觉得自己无法保证安全的念头？
   - 没有
   - 偶尔闪过，但我现在安全
   - 有，而且我担心自己不安全
   - 暂时不想回答

5. 你现在是否有严重腹痛、大量出血、晕厥、胸痛、呼吸困难或其他明显急症？
   - 没有
   - 有轻微不适
   - 有明显或严重症状
   - 不确定

跳题：

- 如果命中严重身体急症、自伤风险、胁迫或暴力风险，立即显示优先线下支持提示；不等待问卷完成。
- 提示显示后仍允许用户继续填写当前问卷，不强制阻断或要求完成报告；普通分析和角色化内容必须后置，R3/R4 的最终报告仍由线下支持优先页面覆盖。

### 6.2 怀孕状态与医学基础信息

目的：确认医学信息完整度和需要线下确认的问题。

引用依据：`research.md` 第 2 节。

题目草案：

1. 你目前是否已经确认怀孕？
   - 已确认
   - 可能怀孕，但还未确认
   - 不确定

2. 你通过什么方式确认？
   - 早孕试纸
   - 验血
   - B 超
   - 医生确认
   - 还未确认
   - 其他

3. 你的末次月经日期是否记得？
   - 记得，填写日期
   - 只记得大概
   - 不记得
   - 月经本来就不规律

4. 目前估计孕周是？
   - 4 周以内
   - 4-6 周
   - 7-8 周
   - 9-12 周
   - 12 周以上
   - 不确定

5. 是否已经确认宫内妊娠？
   - 已确认
   - 尚未确认
   - 医生说暂时无法确认
   - 不知道这是什么意思

6. 过去 48 小时内是否有腹痛？
   - 没有
   - 轻微
   - 明显或持续
   - 剧烈或单侧明显

7. 过去 48 小时内是否有阴道出血？
   - 没有
   - 少量
   - 明显
   - 大量或伴随疼痛/头晕

8. 是否有肩尖痛、明显头晕、晕厥、发热或明显虚弱？
   - 没有
   - 有其中一项，但轻微
   - 有明显症状
   - 不确定

9. 医生是否已经提示存在高风险情况？
   - 没有
   - 有，但我不清楚细节
   - 有，且需要尽快复查或处理
   - 尚未就诊

10. 是否已有就诊计划或固定医院？
    - 已预约
    - 计划预约
    - 暂时没有
    - 不知道该去哪

11. 是否有医生曾提示需要在本次妊娠中额外关注的既往疾病、用药或妊娠经历？
    - 没有
    - 有，但我不清楚是否相关
    - 有，且医生曾提醒需要关注
    - 不确定
    - 暂时不想回答

### 6.3 当前真实倾向与不确定性

目的：中性询问她本人的当前状态，同时保护隐私。

题目默认 `private`。

题目草案：

1. 如果暂时不考虑任何人的期待，只看你自己的身体、生活和内心，你此刻更接近哪种状态？
   - 更倾向继续妊娠
   - 更倾向中止妊娠
   - 两边都很强烈，正在拉扯
   - 还没有形成倾向
   - 我不想现在回答

2. 我能分清“我自己的想法”和“别人希望我怎么做”。
   - 1-5 量表

3. 我现在主要卡在信息不足，而不是价值冲突。
   - 1-5 量表

4. 我现在主要卡在价值冲突，而不是信息不足。
   - 1-5 量表

5. 我感觉自己有足够时间做一个不仓促的决定。
   - 1-5 量表

6. 此刻最影响我判断的一件事是：
   - 自由文本，private，可跳过

### 6.4 心理状态与情绪承载力

目的：使用简短、非诊断性的启发式题识别当前情绪支持需要，并结合功能影响和支持可及性决定是否推荐线下支持或深入补充。

引用依据：`research.md` 第 3 节。

题目草案：

1. 当前低落、兴趣下降的支持需要（产品启发式，不是 PHQ-2）。

2. 当前紧张、担忧难以放下的支持需要（产品启发式，不是 GAD-2）。

3. 这件事已经明显影响我的睡眠、进食、工作或日常生活。
   - 1-5 量表

4. 我能找到至少一个可以安全倾诉的人。
   - 1-5 量表

5. 我担心自己之后会后悔，而且这种担心很强烈。
   - 1-5 量表

6. 我害怕被评价、责备或孤立。
   - 1-5 量表

7. 我现在最需要的是：
   - 医学信息
   - 情绪支持
   - 伴侣明确承诺
   - 家庭边界
   - 经济计划
   - 时间独处
   - 暂时说不清

`specs/measures.md` 未将任何心理量表列为可用，因此本模块不计算或展示 PHQ/GAD 筛查结果。任一启发式题未完成时，相关维度仅标记为信息不完整；报告提示“情绪信息尚不完整”，不以缺失内容推断风险。

### 6.5 个人发展与人生节奏

目的：将事业、学习、生活自由、自我感和身份变化作为重点维度，不埋入经济模块。

题目草案：

1. 未来 1-3 年，我有重要的事业、学习或人生计划。
   - 1-5 量表

2. 如果继续妊娠，我担心这些计划会被明显推迟或改变。
   - 1-5 量表

3. 如果中止妊娠，我担心自己也会承受心理、关系或身体上的影响。
   - 1-5 量表

4. 我很在意生活自由、个人空间、社交、旅行或兴趣是否会被长期改变。
   - 1-5 量表

5. 我对“成为母亲后身份和生活重心改变”已经有一定心理准备。
   - 1-5 量表

6. 如果继续妊娠，我希望伴侣为我的事业/学习/个人发展做出实际支持。
   - 1-5 量表

7. 当前最不想牺牲的是：
   - 事业机会
   - 学习/考试/升学
   - 身体状态
   - 时间自由
   - 亲密关系
   - 已有家庭节奏
   - 经济安全
   - 暂时说不清

### 6.6 伴侣关系与具体承诺

目的：不只问态度，而是问尊重、承诺、已验证行动和风险。

引用依据：`research.md` 第 4 节。

题目草案：

1. 伴侣是否知道你怀孕或可能怀孕？
   - 知道
   - 不知道
   - 我不确定是否要告诉他
   - 暂时不想回答

2. 你认为伴侣当前更倾向于：
   - 继续妊娠
   - 中止妊娠
   - 还不确定
   - 他还不知道
   - 我不想回答

3. 伴侣尊重“最终需要以我的身体和自主意愿为核心”。
   - 1-5 量表

4. 我可以安全地对伴侣说出真实想法。
   - 1-5 量表

5. 伴侣已经明确说出愿意承担具体责任，而不只是表达态度。
   - 1-5 量表

6. 伴侣过去在压力事件中是可靠的。
   - 1-5 量表

7. 是否存在伴侣施压、控制、威胁或让我害怕的情况？
   - 没有
   - 有压力，但没有让我害怕
   - 有，并让我害怕或不敢说真话
   - 暂时不想回答

8. 伴侣承诺覆盖哪些方面？可多选。
   - 医学陪伴
   - 经济承担
   - 时间与劳动
   - 边界保护
   - 情绪支持
   - 长期共同养育
   - 已有子女照护
   - 突发情况预案
   - 还没有明确承诺

8 类承诺定义：

- 医学陪伴：确认怀孕、产检、异常症状就医、若中止的就医陪伴。
- 经济承担：产检、分娩、中止、恢复、育儿、托育、收入中断兜底。
- 时间与劳动：家务、夜间照护、喂养、接送、请假、陪月子。
- 边界保护：面对双方父母意见时保护她的选择和隐私。
- 情绪支持：焦虑、恐惧、犹豫、后悔时稳定陪伴。
- 长期共同养育：育儿理念、教育责任、职业牺牲如何分摊。
- 已有子女照护：照顾现有孩子、接送、学习、情绪陪伴。
- 突发情况预案：急症就医、临时请假、父母冲突、经济断档。

### 6.7 家庭与社会支持

目的：区分可用支持和有压力的支持。

题目草案：

1. 哪些人可能提供实际支持？可多选。
   - 她的父母
   - 伴侣的父母
   - 朋友
   - 亲戚
   - 同事/单位
   - 社区/医院/专业机构
   - 暂时没有

2. 可用支持包括哪些？可多选。
   - 钱
   - 陪诊
   - 月子/恢复照护
   - 带孩子
   - 做饭家务
   - 情绪支持
   - 住房
   - 其他

3. 这些支持稳定可靠。
   - 1-5 量表

4. 这些支持可能带来控制、指责、育儿观念冲突或边界压力。
   - 1-5 量表

5. 如果我拒绝家人意见，可能会有严重冲突或后果。
   - 1-5 量表

6. 我愿意接受目前可获得的家庭支持。
   - 1-5 量表

### 6.8 经济与政策准备度

目的：核心问卷只问准备度等级，具体金额放入深入问卷。

引用依据：`research.md` 第 6 节。

题目草案：

1. 当前家庭收入总体稳定。
   - 1-5 量表

2. 当前储蓄可以覆盖至少 3-6 个月基本生活开支。
   - 1-5 量表

3. 房贷、房租、债务或其他固定支出让我感到明显压力。
   - 1-5 量表

4. 我大致知道自己是否有医保、商业保险或生育保险。
   - 1-5 量表

5. 如果继续妊娠，产假或收入中断会明显影响生活。
   - 1-5 量表

6. 我大致知道杭州/单位可用的产假、生育津贴、补贴或托育资源。
   - 1-5 量表

7. 如果继续妊娠，我们大致能承担产检、分娩、育儿和托育支出。
   - 1-5 量表

8. 如果中止妊娠，我们大致能承担医疗、请假恢复和心理支持成本。
   - 1-5 量表

### 6.9 已有子女与照护负担

目的：已有孩子时评估时间、情绪、经济和照护影响；无孩子则跳过。

题目草案：

1. 你们目前是否已有孩子？
   - 没有
   - 有 1 个
   - 有 2 个
   - 有 3 个或以上

2. 孩子年龄段是？可多选。
   - 0-3 岁
   - 3-6 岁
   - 小学
   - 初中及以上

3. 是否有特殊照护、健康、教育或情绪需求？
   - 没有
   - 有轻度需要
   - 有明显需要
   - 暂时不想回答

4. 当前主要照护者是谁？
   - 我
   - 伴侣
   - 双方共同
   - 老人
   - 保姆/托育/机构
   - 其他

5. 如果继续妊娠，我担心现有孩子的照护质量受到影响。
   - 1-5 量表

6. 如果中止妊娠，我也需要安排短期恢复期的孩子照护。
   - 1-5 量表

### 6.10 价值观、遗憾承受与不可量化因素

目的：帮助用户澄清生命观、伦理观、遗憾承受和底线。

题目草案：

1. 对我来说，身体自主和心理安全是非常核心的价值。
   - 1-5 量表

2. 对我来说，家庭延续或迎接新生命是非常核心的价值。
   - 1-5 量表

3. 对我来说，关系稳定和共同承担比单独判断更重要。
   - 1-5 量表

4. 对我来说，未来几年的人生节奏和个人发展非常重要。
   - 1-5 量表

5. 我能想象继续妊娠后可能后悔的点。
   - 1-5 量表

6. 我能想象中止妊娠后可能后悔的点。
   - 1-5 量表

7. 我知道哪些条件是自己不可接受的底线。
   - 1-5 量表

8. 如果未来的自己回看今天，我最希望她理解的是：
   - 自由文本，private，可跳过

9. 在以上价值中，如果愿意，请选择此刻最希望被认真对待的前三项。
   - 可跳过，最多选择 3 项
   - 仅用于报告聚焦和共同讨论议题，不改变任何路径条件、红旗或去留结论

### 6.11 自由补充与分享偏好

目的：收集未覆盖内容，并为伴侣共同版做 opt-in 分享准备。

题目草案：

1. 还有什么重要内容没有被问到？
   - 自由文本，private，可跳过

2. 此刻最希望伴侣理解的一句话是：
   - 自由文本，private，可跳过

3. 生成个人报告后，你是否愿意选择一部分内容生成伴侣共同讨论版？
   - 愿意
   - 可能愿意，但需要我逐项选择
   - 暂时不愿意

## 7. 深入问卷模块

### 7.1 推荐机制

核心问卷结束后，系统根据以下规则推荐深入模块：

- 医学信息不完整、未确认宫内妊娠、无就诊计划：推荐“医疗路径与信息缺口”。
- `Q-MH-MOOD-LOW`、`Q-MH-WORRY-HIGH`、`Q-MH-FUNCTION-IMPACT` 的支持需要较高，或功能影响明显：推荐“心理与情绪支持细化”。
- 经济压力高、收入中断风险高、政策不了解：推荐“详细经济预算”。
- 伴侣承诺不明确、可靠性低、具体承诺少：推荐“伴侣承诺细化”。
- 个人发展冲突强：推荐“个人发展细化”。
- 家庭支持不稳定、有照护缺口、已有子女：推荐“照护网络细化”。
- 倾向不清晰、后悔担忧强、价值冲突强：推荐“价值澄清与未来生育规划”。
- 用户担心决定后无人支持：推荐“决定后支持计划”。
- 胁迫、暴力、隐私风险：推荐“安全与自主保护”。
- “角色化类型细化”中的 12 题启发式模块始终作为孕妇本人的额外推荐项展示，不依赖角色确定性，也不计入下方 2-3 个针对性推荐模块的上限。

推荐页并列展示 2-3 个最值得补充的模块，标明各自的推荐原因、预计题数和预计时间；另行固定展示孕妇本人的 12 题角色化类型细化。用户自行决定完成顺序，也可以手动添加其他模块。

推荐页不显示九维等级、分数、路径倾向或低确定性维度名称；这些内容只在完成推荐模块或明确跳过后生成的最终报告中呈现。

核心问卷结束、进入深入推荐页前，只显示各模块的“已完成 / 有跳过”状态；不提供完整回答复查，不回显具体作答。

用户选择跳过全部推荐模块时，必须先明确提示“最终报告的部分维度和长期影响判断确定性会降低”，确认后才可生成最终报告。不得强制至少完成一个模块。

任一深入模块支持保存本地进度并在稍后继续。未完成模块的答案不参与最终报告、角色映射、维度等级或路径条件清单；完成后才纳入重新生成的报告。

### 7.2 医疗路径与信息缺口

不问治疗方案，只问现实准备：

- 是否知道下一步要确认哪些医学信息。
- 是否知道去哪家医院或科室咨询。
- 是否已有陪同人。
- 是否能请假。
- 如果出现急症，是否知道去哪里。
- 哪些问题准备问医生。
- 用户愿意补充的既往疾病、用药、既往妊娠或医生已提示风险的概览；不要求填写完整病历，不解释其医学意义。
既往医疗史使用少量可跳过类别，再提供自由文本补充：

- 既往妊娠、分娩、流产或宫外孕等经历中，医生曾提示需要关注的内容。
- 长期疾病、近期重大疾病、手术或正在接受的治疗中，可能需要告知医生的内容。
- 正在使用或近期使用、可能需要告知医生的药物或其他治疗。
- 已知过敏或既往不良反应中，可能影响就医安排的内容。
- 其他希望带去线下咨询的问题。

各类别均允许“没有 / 不确定 / 暂时不想回答 / 简短补充”。系统不解释这些信息的医学意义，也不据此提供治疗方案。

### 7.3 心理与情绪支持细化

仅在核心启发式情绪支持题显示支持需要较高，或功能影响明显时推荐；用户也可手动进入。模块包括：

- 不引入 `PHQ-9` 或 `GAD-7`；详见本文件 3.6.3 的三个启发式支持与线下咨询准备题。
- 可跳过的既往心理支持概览：是否曾接受心理咨询、精神科/身心科诊疗、相关用药或有希望告知线下医生的经历；不要求疾病名称、时间线或具体病历。
- 当前可获得的情绪支持、休息空间与实际减负安排。
- 希望在线下咨询中确认的问题。

该模块不替代独立安全题，不根据既往经历自动推断当前风险、诊断或妊娠去留建议。

### 7.4 详细经济预算

使用具体金额输入和 1-7 量表：

- 月收入、储蓄、房贷/房租、债务。
- 可承受的月育儿预算。
- 产检和分娩预算。
- 中止妊娠相关医疗和恢复预算。
- 可能的收入中断月份。
- 父母或伴侣可明确支持金额。
- 托育、育儿嫂、老人照护的可用性和成本。

MVP 可显示固定的杭州滨江区本地成本参考区间，例如托育、照护或可获得补助的预算提示。用户可以修改、忽略或不使用参考区间；最终评估以用户填写的实际收入、储蓄、支出和可承受预算为主，不以系统预估替代个人事实。

### 7.5 伴侣承诺细化

对 8 类承诺逐项询问：

- 是否已经明确说出口。
- 是否有具体行动证明。
- 是否有时间表。
- 是否愿意写成清单或共同计划。
- 她对该承诺可信度的 1-7 评分。

### 7.6 个人发展细化

重点覆盖：

- 事业/学习机会。
- 当前工作、学习或待业状态，以及请假、合同、考试或关键节点带来的现实限制。
- 生活自由与自我感。
- 长期身份变化。
- 未来 1 年、3 年、5 年规划。
- 哪些计划可以延后，哪些不可替代。
- 伴侣是否愿意为她的发展付出具体代价。

### 7.7 照护网络细化

重点覆盖：

- 月子或恢复期谁照护。
- 夜间谁负责。
- 产检或就医谁陪同。
- 0-3 岁阶段托育或老人照护是否可用。
- 已有孩子谁接送、陪伴、处理突发情况。
- 如果父母支持撤回，是否有备选方案。
- 支持者能否在就医、恢复、夜间照护或突发事件时实际到场，而非仅口头支持。

### 7.8 价值澄清与未来生育规划

重点覆盖：

- 这次是否继续，与未来是否想要孩子分开讨论。
- 此次怀孕是否属于近期计划，以及这一背景如何影响当下的感受与后续规划。
- 理想生育时间。
- 如果这次中止，未来是否希望再备孕。
- 如果这次继续，未来是否还希望有更多孩子。
- 对未来遗憾的承受方式。
- 不可接受底线。
- 未来的自己可能怎么看今天的决定。

### 7.9 决定后支持计划

分别覆盖两条路径：

- 如果继续妊娠，未来 1 周、1 个月、3 个月、1 年需要谁做什么。
- 如果中止妊娠，未来 1 周、1 个月、3 个月需要谁做什么。
- 身体恢复、心理波动、关系沟通、工作安排、家庭边界。
- 谁负责预约、陪同、请假、照护、费用、复盘和后续支持。

### 7.10 安全与自主保护

仅在相关风险触发时推荐。

内容包括：

- 是否能安全删除本机记录。
- 是否有可信赖的人知道当前情况。
- 是否需要避免生成伴侣共同版。
- 是否需要优先联系线下安全、法律、医疗或心理支持。
- 是否有安全离开、就医或求助的现实方案。

### 7.11 角色化类型细化

本模块的目标是解释决策风格、支持需求和沟通偏好，不做人格诊断，也不判断是否适合生育。

#### 用户本人流程

1. 核心问卷不计算角色；只有完成深入模块中的角色启发式题后才可进行角色映射，也不在填写过程中显示角色说明。
2. “角色化类型细化”作为深入模块推荐之一显示；用户可以完成或明确跳过。未完成时，最终报告必须提示角色解释仍在校准中。
3. 角色化类型细化固定为 12 题：全部为产品启发式题，不是人格、依恋或决策风格正式量表。
4. 该模块每页固定显示 4 题；支持中途退出与恢复；不展示任何累计分数或人格分数。
5. 测评结果仅输出为主角色、可选次角色、状态标签、沟通提示和行动建议，具体规则见 `specs/personas.md`。

#### 伴侣独立流程

1. 伴侣独立、可选的测评入口仅出现在伴侣讨论页中；用户先完成个人报告、选择分享内容并生成初始共同讨论页后，才可点击“交给伴侣填写”。首页不显示伴侣测评入口。
2. 伴侣流程只包含 4 项支持与承诺短问卷：沟通偏好、可提供的支持、愿意讨论的事项和是否主动分享摘要；不包含量表、人格或互动风格测评。
3. 伴侣先查看自己的非诊断性沟通与支持摘要；伴侣不生成十二个主角色、次角色、角色插画或量表明细。
4. 伴侣的原始答案和沟通摘要默认只属于伴侣本人。伴侣可主动选择分享摘要；分享后，该摘要可进入用户个人报告的“伴侣视角”区，并可作为共同讨论页的伴侣侧输入。
5. 用户的个人角色结果也不得因伴侣完成问卷而自动共享。两人的本地数据仅在同一设备、同一浏览器配置文件中独立保存；伴侣流程不会在用户个人报告之前单独启动，也不会自动创建共同讨论页。
6. 共同版只使用用户和伴侣各自主动分享的沟通偏好、可执行承诺和讨论议题，不显示诊断式人格结论或原始量表数据。

#### 结构化角色补充题

12 题补充题以 1-5 量表为主，覆盖：

- 决定前核实事实的需要。
- 把经济、时间、照护和工作安排写清单的需要。
- 对外界变化与他人意见的敏感度。
- 被陪伴、被倾听、独处留白的需要。
- 对具体承诺、陪诊、请假和夜间照护分工的重视程度。
- 对家庭边界、自我发展、长期影响和现实资源承载的重视程度。

题目不得询问自伤、自杀、暴力、胁迫、医学急症或医疗史；这些仍只由既有安全和医学模块处理。

## 8. 报告输入要求

问卷输出给报告生成模块的数据必须包含：

- 回答值。
- 题目所属模块。
- 是否敏感。
- 是否 private。
- 是否用户主动标记可分享。
- 是否缺失。
- 是否不确定。
- 是否触发红旗候选。
- 是否来自核心问卷或深入问卷。

伴侣共同版只能读取用户和伴侣各自主动标记可分享的内容。

## 9. 待 `scoring.md` 定义的内容

本文档不定义以下内容：

- 红旗触发阈值。
- 维度等级映射。
- 内部分数和权重。
- 深入模块推荐的具体阈值。
- 信息不足的定量规则。
- 角色化类型匹配规则。

这些必须在 `specs/scoring.md` 和 `specs/personas.md` 中定义。
