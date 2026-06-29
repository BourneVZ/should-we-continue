# Type Description Sample: CTRL

更新时间：2026-06-29

本文档演示如何使用 [type-description-prompt-template.md](/Z:/Users/BVZ/WorkSpace/101Doodle/VibeCoding/should-we-continue/specs/003-core-spec-rebuild/type-description-prompt-template.md) 为 `CTRL / 控盘总监` 生成一版新的类型说明初稿。

目标不是证明模型一定正确，而是给后续 `24+1` 类型批量生成提供一份可复用样板。

## 1. 类型基础信息

- 代号：`CTRL`
- 中文名：控盘总监
- 家族：控盘家族
- punchline：先别感动，我先把变量列完。

## 2. 示例输入 JSON

```json
{
  "archetype": {
    "code": "CTRL",
    "name": "控盘总监",
    "familyId": "control",
    "familyName": "控盘家族",
    "punchline": "先别感动，我先把变量列完。"
  },
  "prototypeVector": {
    "factCheck": 4.8,
    "delay": 1.6,
    "controlCompensation": 4.8,
    "intrusionSensitivity": 3.2,
    "riskSimulation": 3.8,
    "recoveryCatastrophizing": 3.3,
    "selfContinuity": 3.2,
    "motherhoodProjection": 2.6,
    "rhythmDefense": 3.5,
    "confirmationNeed": 3.0,
    "attachmentNeed": 2.8,
    "commitmentVerification": 4.2,
    "orderAnxiety": 4.7,
    "freedomLossSensitivity": 3.4,
    "careLoadEstimation": 3.8
  },
  "dimensionSignals": {
    "dominantHigh": [
      "factCheck",
      "controlCompensation",
      "orderAnxiety"
    ],
    "notableHigh": [
      "commitmentVerification",
      "riskSimulation",
      "careLoadEstimation"
    ],
    "notableLow": [
      "delay",
      "motherhoodProjection",
      "attachmentNeed"
    ],
    "tensions": [
      {
        "id": "CTRL-T1",
        "summary": "更容易先进入核实、接管和流程化处理，而不是先停下来体会情绪。"
      },
      {
        "id": "CTRL-T2",
        "summary": "对失控和混乱特别敏感，但又不太愿意把自己放进被安抚或被照顾的位置。"
      }
    ]
  },
  "dimensionGlossary": {
    "factCheck": "先核实再允许自己动情",
    "delay": "该拍板时能拍板",
    "controlCompensation": "越慌越想控场",
    "intrusionSensitivity": "身体边界一被改写就起毛",
    "riskSimulation": "坏情况会先脑内公映",
    "recoveryCatastrophizing": "恢复想象自带灾难片",
    "selfContinuity": "原来的我别断线",
    "motherhoodProjection": "母职容易被你想成意义大作",
    "rhythmDefense": "生活节奏不能被整锅端",
    "confirmationNeed": "别人最好赶紧表态",
    "attachmentNeed": "需要有人持续在场",
    "commitmentVerification": "先拿行动和清单来",
    "orderAnxiety": "一乱套就很难装没事",
    "freedomLossSensitivity": "一想到被套牢就警铃大作",
    "careLoadEstimation": "先算这活到底谁扛"
  },
  "dimensionNotes": {
    "factCheck": {
      "low": "你能先跟着感受走，不会被信息空白卡到完全停机。",
      "medium": "你会查关键点，但还不至于查到情绪也一起冻结。",
      "high": "只要还有关键空白，你就很难放心把态度说死。"
    },
    "delay": {
      "low": "该做决定时，你更容易进入处理模式，而不是无限缓冲。",
      "medium": "你会给自己留一点观察时间，但不会一直挂起。",
      "high": "越逼你立刻定论，你越容易先按下暂停键。"
    },
    "controlCompensation": {
      "low": "你不太需要靠列流程、排变量来稳住自己。",
      "medium": "局面一乱时，你会适度整理，但不会什么都想接管。",
      "high": "一慌起来，你的大脑就会本能地冲去接管现场。"
    },
    "intrusionSensitivity": {
      "low": "你对身体被改写这件事的耐受度相对更高一些。",
      "medium": "你会在意身体边界，但还可以慢慢谈、慢慢适应。",
      "high": "只要想到身体会长期被改写，警觉感就会先上来。"
    },
    "riskSimulation": {
      "low": "你不会本能地先把坏剧情放到最大音量。",
      "medium": "你会预想风险，但还不至于一路脑补到最黑版本。",
      "high": "坏情况通常会先在你脑内试映几轮，再轮到别人开口。"
    },
    "recoveryCatastrophizing": {
      "low": "你不会自动把恢复期预设成一部漫长灾难片。",
      "medium": "你会担心恢复成本，但还保留一点弹性空间。",
      "high": "一想到恢复期，你的大脑就容易先切到重灾版预告。"
    },
    "selfContinuity": {
      "low": "你对旧版本自己要不要完整保留这件事相对没那么执拗。",
      "medium": "你希望保住原来的自己，但也知道身份会发生调整。",
      "high": "你很在意原来的自己别被整件事直接覆盖掉。"
    },
    "motherhoodProjection": {
      "low": "你不太会自动给母职套上一层救赎或完整感滤镜。",
      "medium": "你能理解母职的意义感，但还不至于被它整套带走。",
      "high": "你很容易先被也许会更完整、更有意义的画面击中。"
    },
    "rhythmDefense": {
      "low": "你能接受现有节奏为新变化让一部分位。",
      "medium": "你会在意节奏被打乱，但还愿意留出协商空间。",
      "high": "你对生活节奏被整锅端这件事格外敏感。"
    },
    "confirmationNeed": {
      "low": "别人暂时不表态，也不会立刻让你失去平衡。",
      "medium": "你希望听到明确态度，但还不至于立刻炸毛。",
      "high": "这种时刻，别人到底站不站你这边，对你非常关键。"
    },
    "attachmentNeed": {
      "low": "你不太依赖高密度陪伴，也能自己把系统维持住。",
      "medium": "你希望有人稳定在场，但也保留独处的可用性。",
      "high": "没人持续陪着一起扛时，你会明显更容易慌。"
    },
    "commitmentVerification": {
      "low": "你对口头支持还有一定耐心，不会立刻要求交作业。",
      "medium": "你会看行动，但也愿意给别人一点落实时间。",
      "high": "你更信动作、安排和责任分配，不太吃空口安慰。"
    },
    "orderAnxiety": {
      "low": "日常秩序乱一点，你还可以边走边修。",
      "medium": "你会在意秩序被打乱，但系统还不至于立刻报警。",
      "high": "一想到流程和生活节拍要全面重排，你就先开始累。"
    },
    "freedomLossSensitivity": {
      "low": "你对自由被压缩这件事相对更能协商和适应。",
      "medium": "你会警觉自由缩水，但还愿意继续谈条件。",
      "high": "一想到被长期套进某种角色里，警铃就会先大作。"
    },
    "careLoadEstimation": {
      "low": "你不会一上来就把照护重量按满格估算。",
      "medium": "你会想到承重问题，但不会先把最沉那版默认成现实。",
      "high": "你很快就会追问一句，这活最后到底谁来扛？"
    }
  },
  "knowledgeCards": [
    {
      "id": "KB-AMBIVALENCE-01",
      "sourceType": "psychology",
      "allowedUse": "mixed_reactions",
      "summary": "怀孕相关态度通常不是单一愿望，而会混合失控感、现实权衡、他人影响和自我保护。"
    },
    {
      "id": "KB-MATRESCENCE-01",
      "sourceType": "psychology",
      "allowedUse": "multi_system_change",
      "summary": "围绕怀孕与未来养育的反应往往同时牵动身体、身份、关系和现实秩序，不只是单纯情绪波动。"
    },
    {
      "id": "KB-CARELOAD-01",
      "sourceType": "sociology",
      "allowedUse": "care_and_support",
      "summary": "现实分工、关系兑现和可执行支持方式会显著影响一个人如何想象未来养育。"
    },
    {
      "id": "KB-MEDICAL-BOUNDARY-01",
      "sourceType": "medical_boundary",
      "allowedUse": "body_change_boundary",
      "summary": "身体变化与恢复成本会影响人的反应姿态，但不能据此推出医疗或心理结论。"
    }
  ],
  "styleConstraints": {
    "tone": [
      "幽默",
      "轻微毒舌",
      "自嘲",
      "口语化",
      "有画面感"
    ],
    "avoid": [
      "病理化",
      "说教",
      "医疗建议",
      "道德评判",
      "吓唬用户"
    ]
  }
}
```

## 3. 示例 Prompt 拼装

### 3.1 System Prompt

```text
你是一个“类型描述文案生成器”，服务于一个围绕怀孕与未来养育想象的娱乐型类型测试产品。

你的任务不是判断用户是否应该继续妊娠，也不是做医学、心理、法律或伦理建议。
你只能基于给定的：
1. 类型基础信息
2. 15维原型向量
3. 维度短解释
4. 维度高低说明
5. 重点维度与张力
6. 已批准的专业知识卡
来生成“该类型的固定说明文案”。

你的写作目标：
- 写出“模式”，不是“本质”
- 让用户感觉“像我”
- 保持幽默、轻微自嘲、娱乐性
- 同时保留专业边界，不病理化，不装专家

你必须遵守以下规则：
- 不得输出任何医学建议、药物建议、手术建议、风险等级、法律结论
- 不得输出心理诊断、人格定性、依恋类型诊断、创伤判断
- 不得暗示“你不适合做母亲”
- 不得发明未提供的维度、事实、研究结论或评分逻辑
- 必须优先使用 `dimensionGlossary` 和 `dimensionNotes` 理解维度，不得按英文变量名自行脑补
- 必须体现输入中最主要的高值/低值/矛盾维度
- 必须体现输入中的知识卡，但只能做轻量转译，不能扩展成专业宣告
- 语言要口语化，有画面感，有一点自嘲，但不过度刻薄

请输出严格符合 schema 的 JSON。
```

### 3.2 User Prompt

```text
请根据下面的结构化输入，为该类型生成固定文案初稿。

写作要求：
1. `intro` 用 1-2 句抓住该类型的主模式
2. `typicalReaction` 必须同时覆盖“发现怀孕当下”和“想象未来养育时”的典型反应
3. `failureMode` 必须写该模式最容易把自己或关系带偏的代价
4. `howToSupport` 必须写“别人怎么和她互动更有效”，用关系语言写，不写行动清单
5. 文案不能彼此重复，不能只是把类型名换个说法
6. 必须把重点维度转译成可感知的生活反应，而不是只复述抽象词
7. `evidenceTrace` 只做内部审校用途，不面向用户

结构化输入如下：

{{CTRL_INPUT_JSON}}
```

## 4. 示例输出

以下示例输出代表“可以进入人工审校”的初稿，不代表最终定稿。

```json
{
  "intro": "消息一落地，你的大脑通常不会先哭也不会先飘，而是先把看不见的白板啪地一声拉出来。怀孕这种事到了你这里，很难先变成什么命运感、母性滤镜或者温柔片头，它更像一封没抄送完整的紧急邮件，第一时间触发的不是感动，是排查。你会本能地先确认时间点、身体状态、风险项、信息缺口、谁的话算数、哪一步最容易失手，再顺手把最坏情况在脑子里过一遍。你像 CTRL，不是因为你爱控制别人，而是因为你太熟悉局面一糊、责任一飘、最后默认你兜底这套老剧情，所以每次风一吹，你就会条件反射把自己顶成临时项目经理。黑色幽默也在这里：你明明也想被安慰，最后却总因为太会稳住场面，被所有人误判成那个最不需要被照顾的人。",
  "typicalReaction": "发现怀孕时，你往往不是先哭也不是先浪漫，而是先确认时间点、身体状态、风险项、接下来谁该知道、先做哪一步。等别人还在试图用情绪命名这件事时，你已经在心里把流程拖成了第二页。想到未来养育时，你也更容易先看长期秩序能不能撑住、承诺是不是能兑现、照护重量最后会落到谁身上，而不是先被“也许会很幸福”这类画面带走。",
  "failureMode": "你这套模式真正容易翻车的地方，不是太理性，而是太早把自己活成临时总包。你本来只是想先把局面控住，结果控着控着，别人开始默认你最会安排、最能扛、最不需要被照顾。最后事情确实没那么乱了，但你自己像被长期挂在后台高负荷运行。",
  "howToSupport": "对你最有用的配合，不是催你放轻松，也不是用一锅鸡汤绕过现实。更有效的是：给清楚的信息边界，给能验证的更新，给明确的分工，给说到做到的动作。你不是不需要情绪支持，你只是很难在一堆没落地的话里放心把自己交出来。",
  "evidenceTrace": {
    "usedDimensions": [
      "factCheck",
      "controlCompensation",
      "orderAnxiety",
      "commitmentVerification",
      "riskSimulation",
      "careLoadEstimation",
      "delay"
    ],
    "usedKnowledgeCardIds": [
      "KB-AMBIVALENCE-01",
      "KB-MATRESCENCE-01",
      "KB-CARELOAD-01",
      "KB-MEDICAL-BOUNDARY-01"
    ],
    "reasoningSummary": "文案重点围绕高核实欲、高掌控补偿和高秩序焦虑展开，同时吸收怀孕反应并非单一情绪、而是会牵动身体、关系与现实承重的知识卡。低延迟和较低浪漫投射帮助限制文案不滑向拖延型或投射型表达。"
  }
}
```

## 5. 这份样板为什么可用

### 5.1 它不是只按类型名写

这版初稿明确吃进了：

- `factCheck`
- `controlCompensation`
- `orderAnxiety`
- `commitmentVerification`
- `careLoadEstimation`

而不是只把“控盘总监”翻译成“喜欢控制的人”。

### 5.2 它吃进了专业知识，但没有越界

它借了以下知识边界：

- 怀孕相关反应是混合的，不是单一态度
- 反应会牵动身体、身份、关系和现实秩序
- 现实分工与承重会影响未来养育想象

但没有把这些内容写成：

- 医学建议
- 心理诊断
- 用户命运判断

### 5.3 它保留了产品文风

这版输出保留了：

- 口语化
- 画面感
- 轻微自嘲
- 有一点刺

但没有滑向恶毒或病理化。

## 6. 人工审校时重点看什么

对于 `CTRL`，审校时建议重点看：

1. 是否把“控场”写得太像人格本质，而不是临场模式。
2. 是否把“核实”和“接管”写成了夸大版职场 stereotype。
3. 是否把“身体风险”写成了医疗恐吓。
4. `howToSupport` 是否已经滑向 checklist。
5. 文案是否和现有 `reaction / failureMode / needFromOthers` 过度重复，导致新模板没有增益。

## 7. 下一步批量生成建议

复制这份样板到其他类型时，优先做这几步：

1. 先本地提炼每型的 `dominantHigh / notableLow / tensions`
2. 每型只配 `2-4` 张最相关知识卡
3. 先批量生成，再统一审校同家族是否撞文风
4. 审校通过后再替换 `model.ts` 中的静态文案
