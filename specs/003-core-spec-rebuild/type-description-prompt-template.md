# Type Description Prompt Template

更新时间：2026-06-29

本文档定义 `003-core-spec-rebuild` 的类型文案离线生成模板，用于生成每个类型的固定资产：

- `intro`
- `sections[]`
- `evidenceTrace`

目标不是让模型自由发挥，而是让它在受控输入下，把 `15` 维信息、批准知识卡和本产品的家庭场景翻译成可审校、可迭代、可追溯的文案。

## 1. 使用边界

本模板只用于离线生成固定类型文案，不用于：

- 运行时按用户答案即兴写作
- 医学建议、药物建议、手术建议
- 心理诊断或人格诊断
- 法律判断
- 对“是否应该继续妊娠”做裁决

## 2. 核心原则

### 2.1 先结构，后文风

先给模型喂清楚类型、向量、重点维度、维度解释、知识卡和业务场景，再谈幽默、自嘲和娱乐性。

### 2.2 先受控知识，后表达

模型只能使用输入里的：

- `prototypeVector`
- `dimensionSignals`
- `dimensionGlossary`
- `dimensionNotes`
- `knowledgeCards`
- `businessContext`
- `sectionDefinitions`

不能自行脑补心理学、社会学、医学事实。

### 2.3 写模式，不写本质

必须写成“你更容易进入这种反应模式”，不能写成“你天生就是这样的人”。

### 2.4 一次只生成一个类型

批量生产时，必须按类型逐个独立生成；每生成完一个类型，就清空上下文或新开会话，再生成下一个。  
禁止在同一上下文里连写多个类型后再微调，因为这会显著提高句式串味和 boilerplate 复用概率。

## 3. 业务场景要求

所有文案都必须优先落在以下真实场景，而不是悬空的人格散文：

- 发现或确认怀孕当下
- 想到是否继续妊娠时
- 想到产检、恢复期、照护婴儿、夜里起床、日常育儿时
- 和老公或伴侣沟通、协商、失望、拉扯、分工时
- 家里已有孩子时，想到陪伴公平、精力分配、家庭节奏和手足关系时
- 长辈介入、边界变化、家务与照护承重重新分配时

## 4. 输入结构建议

输入必须是结构化 JSON，至少包含：

```json
{
  "archetype": {
    "code": "CTRL",
    "name": "控盘总监",
    "familyId": "control",
    "punchline": "先别感动，我先把变量列完。"
  },
  "prototypeVector": {
    "factCheck": 4.8,
    "delay": 1.6,
    "controlCompensation": 4.8,
    "intrusionSensitivity": 3.2,
    "riskSimulation": 3.8,
    "recoveryCatastrophizing": 3.1,
    "selfContinuity": 3.3,
    "motherhoodProjection": 2.2,
    "rhythmDefense": 3.9,
    "confirmationNeed": 3.0,
    "attachmentNeed": 2.6,
    "commitmentVerification": 4.2,
    "orderAnxiety": 4.7,
    "freedomLossSensitivity": 3.5,
    "careLoadEstimation": 3.8
  },
  "dimensionSignals": {
    "dominantHigh": ["factCheck", "controlCompensation", "orderAnxiety"],
    "notableHigh": ["commitmentVerification", "riskSimulation"],
    "notableLow": ["delay", "motherhoodProjection"],
    "tensions": [
      {
        "id": "T1",
        "summary": "会先进入核实和控场模式，而不是先被氛围带走"
      }
    ]
  },
  "dimensionGlossary": {
    "factCheck": "先核实再允许自己动情",
    "controlCompensation": "越慌越想控场",
    "orderAnxiety": "一乱套就很难装没事"
  },
  "dimensionNotes": {
    "factCheck": {
      "low": "不会太被信息空白卡住。",
      "medium": "会查关键点，但不至于完全冻结。",
      "high": "关键空白没补上前，很难放心说死态度。"
    }
  },
  "knowledgeCards": [
    {
      "id": "KB-AMBIVALENCE-01",
      "sourceType": "psychology",
      "allowedUse": "mixed_reactions",
      "summary": "怀孕相关态度经常是混合反应，不是单线情绪。"
    },
    {
      "id": "KB-CARELOAD-01",
      "sourceType": "sociology",
      "allowedUse": "care_and_support",
      "summary": "对未来养育的反应常受现实承重、关系兑现和支持方式影响。"
    }
  ],
  "businessContext": {
    "productScene": "围绕怀孕、是否继续妊娠、未来养育与家庭协作的娱乐型类型测试"
  },
  "sectionDefinitions": [
    {
      "id": "first_reaction",
      "title": "你第一反应通常先去哪",
      "writingGoal": "写她在发现或确认怀孕当下，注意力先扑向哪里。"
    }
  ]
}
```

## 5. 为什么必须补维度解释

只给 `15` 维变量名，不够稳。

- `dimensionGlossary` 负责告诉模型每个维度大概在说什么
- `dimensionNotes` 负责告诉模型该维度高、中、低时分别会像什么
- `dimensionSignals` 负责把这一型真正重要的高值、低值和张力明确提出来

这三层一起给，能显著降低模型按英文变量名、日常词义或类型代号瞎猜的风险。

## 6. 反重复硬约束

这是当前版本最重要的约束，必须留存在 prompt 中。

### 6.1 禁止复用句骨架

禁止对所有类型反复使用相同的句式框架，例如：

- “一遇到怀孕、和老公谈分工、带宝宝或顾及已有孩子节奏时，这套模式就会上线”
- “消息一落地……你通常先盯这里”
- “它和你在 X、Y、Z 维度上的高敏感有关”

模型必须为每个类型单独换场景入口、句子节奏、比喻和落点。

### 6.2 intro 与 sections 都要独立开头

- 每个类型的 `intro` 开头都必须不同
- 同一 section 标题下，不同类型的段落开头也必须不同
- 不允许只换几个名词，保留原句骨架

### 6.3 每段都必须吃进该类型专属信息

每一段至少要显式吸收以下内容中的 `2-3` 项：

- 重点高值维度
- 重点低值维度
- 张力说明
- 知识卡
- 该类型在家庭场景中的独特触发点

如果某段去掉类型名后，能直接贴到别的类型身上，说明失败。

### 6.4 类型代号写法

输出里如果出现类型代号，直接写 `CTRL`、`SCAN` 这种纯文本。  
禁止写成 `` `CTRL` `` 这种带反引号的形式。

## 7. 推荐 System Prompt

```text
你是一个“类型描述文案生成器”，服务于一个围绕怀孕、是否继续妊娠、未来养育和家庭协作的娱乐型类型测试产品。

你的任务不是做医学、心理、法律或伦理判断，也不是建议用户继续或中止妊娠。
你只能基于输入中给出的：
1. 类型基础信息
2. 15维原型向量
3. 重点维度与张力
4. 维度短解释
5. 维度高低说明
6. 已批准知识卡
7. 业务场景定义
8. section 写作目标
来生成该类型的固定说明文案。

你必须遵守以下规则：
- 只能写“更容易进入的模式”，不能写成人格本质或命运结论
- 不得输出医学建议、药物建议、手术建议、心理诊断、法律判断
- 不得发明输入里没有的事实、研究、维度或评分逻辑
- 必须优先通过 dimensionGlossary、dimensionNotes、dimensionSignals 理解维度，不得只按变量名字面猜
- 必须把维度翻译成怀孕、养育、和老公或伴侣互动、已有孩子、家庭分工与边界里的生活反应
- 文风可以幽默、轻微毒舌、自嘲、娱乐，但不能病理化、羞辱化、说教化

反重复要求是硬约束：
- 当前只生成一个类型，不参考别的类型文案，不模仿别的类型句式
- 禁止复用通用开头、通用场景串联句、通用收尾句
- intro 和每个 section 都要用该类型独有的入口、比喻和落点
- 如果一句话去掉类型名后还能贴给多数类型，说明它太空泛，必须重写

输出中如果出现类型代号，直接写 CTRL 这类纯文本，不要加反引号。

请输出严格符合 schema 的 JSON。
```

## 8. 推荐 User Prompt

```text
请只为当前这一个类型生成固定文案初稿，不要联想其他类型，不要参考历史会话中的其他文案。

写作任务：
1. 生成一个 intro
2. 按 sectionDefinitions 生成 6 个 sections
3. 生成 evidenceTrace 供内部审校

写作要求：
- intro 必须是一整段，控制在 200-300 个中文字符
- 每个 section body 必须是一整段，控制在 100-200 个中文字符
- 开头不能雷同，句子骨架不能复用
- 每段都必须落到以下至少一个真实场景：
  - 发现或确认怀孕
  - 是否继续妊娠
  - 产检、恢复期、带宝宝、夜里照护
  - 和老公或伴侣协商、分工、失望、拉扯
  - 家里已有孩子时的陪伴、公平、节奏与安排
  - 长辈介入和家庭边界
- 不能只说“你怕失控”“你重视安全感”这种抽象话，必须写成生活化反应
- 不能出现医学建议、心理诊断、法律判断
- 不能为了避免重复而胡编乱造；所有内容都必须能追溯到输入中的 15 维信息和知识卡
- 如果出现类型代号，直接写 CTRL，不要加反引号

请输出 JSON：
{
  "intro": "",
  "sections": [
    {
      "id": "",
      "title": "",
      "body": ""
    }
  ],
  "evidenceTrace": {
    "usedDimensions": [],
    "usedKnowledgeCardIds": [],
    "reasoningSummary": ""
  }
}

结构化输入如下：

{{INPUT_JSON}}
```

## 9. Section 写作目标

- `first_reaction`：写她在发现或确认怀孕当下，注意力第一时间扑向哪里，是先看身体、先看关系、先看边界、先看现实安排，还是先看已有孩子会不会被冲击。
- `mental_preview`：写她想到是否继续妊娠、恢复期、宝宝出生后、家庭节奏变化和已有孩子时，脑内最常先预演哪类剧情。
- `core_concern`：写她表面像在纠结某个决定，其实底层真正卡住的是哪类心理、关系、身份、边界或现实承重点。
- `self_pressure`：写她在怀孕、养育想象、和老公协商、顾及已有孩子或维持家庭运转时，最容易怎样把自己顶上去。
- `distortion_trigger`：写什么家庭场景最容易让她过载、控场、退避、炸毛、装没事或明显失真。
- `effective_support`：写老公、伴侣或家人怎样说话、怎样配合、怎样分担，她会更容易放下防御。

## 10. 审校与测试建议

每次生成后，至少检查：

1. 文案里是否真的能看出 `2-4` 个核心维度，而不是只看见类型名气质。
2. 是否真的引用了批准知识卡，而不是在套鸡汤。
3. 是否落在怀孕、养育、伴侣、已有孩子、家庭分工等业务场景里。
4. 是否把“模式”写成了“本质”。
5. 是否混入医学、心理、法律或道德裁决。
6. intro 与 sections 之间是否重复。
7. 同一 section 标题在不同类型间是否出现重复句骨架。
8. 是否出现了 `` `CTRL` `` 这种错误写法。

推荐把上述检查固化成自动化查重测试，不通过则整段重写。
