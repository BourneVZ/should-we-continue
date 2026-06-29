export interface DimensionDefinition {
  id: DimensionId;
  label: string;
  model: ModelId;
  lowTag: string;
  highTag: string;
  notes: Record<FingerprintLevel, string>;
}

export interface QuestionDefinition {
  id: string;
  dimensionId: DimensionId;
  format: "scenario" | "statement";
  prompt: string;
}

export interface FamilyDefinition {
  id: FamilyId;
  name: string;
  summary: string;
  accentFrom: string;
  accentTo: string;
}

export interface ArchetypeDefinition {
  code: string;
  name: string;
  punchline: string;
  familyId: FamilyId;
  intro: string;
  reaction: string;
  failureMode: string;
  needFromOthers: string;
  artwork?: {
    posterPath: string;
    alt: string;
    status: "final" | "placeholder";
  };
  prototype: ScoreVector;
}

export interface ProjectBrandOption {
  code: string;
  title: string;
  fullName: string;
  chinese: string;
  rationale: string;
}

export type ModelId = "decision" | "body" | "identity" | "relationship" | "reality";

export type FamilyId =
  | "control"
  | "delay"
  | "audit"
  | "boundary"
  | "sacrifice"
  | "projection"
  | "foundation"
  | "disorder"
  | "fallback";

export const DIMENSION_IDS = [
  "factCheck",
  "delay",
  "controlCompensation",
  "intrusionSensitivity",
  "riskSimulation",
  "recoveryCatastrophizing",
  "selfContinuity",
  "motherhoodProjection",
  "rhythmDefense",
  "confirmationNeed",
  "attachmentNeed",
  "commitmentVerification",
  "orderAnxiety",
  "freedomLossSensitivity",
  "careLoadEstimation",
] as const;

export type DimensionId = (typeof DIMENSION_IDS)[number];
export type ScoreVector = Record<DimensionId, number>;
export type FingerprintLevel = "low" | "medium" | "high";

export const PROJECT_BRAND_OPTIONS: readonly ProjectBrandOption[] = [
  {
    code: "MMTI",
    title: "MMTI 测试",
    fullName: "Matrescence Mode Type Indicator",
    chinese: "母职转变模式指标",
    rationale: "最平衡，既能覆盖怀孕到母职转变，又不会太像医学量表。",
  },
  {
    code: "PMTI",
    title: "PMTI 测试",
    fullName: "Pregnancy & Motherhood Type Indicator",
    chinese: "怀孕与母职类型指标",
    rationale: "最好懂，直白，但产品个性略弱一点。",
  },
  {
    code: "MRTI",
    title: "MRTI 测试",
    fullName: "Maternal Response Type Indicator",
    chinese: "母职反应类型指标",
    rationale: "更贴近“反应模式”，适合你现在这套底层逻辑。",
  },
  {
    code: "MBMI",
    title: "MBMI 测试",
    fullName: "Motherhood Behavior Mode Index",
    chinese: "母职行为模式指数",
    rationale: "更偏讽刺测试感，但比前三个更玩梗。",
  },
  {
    code: "GBTI",
    title: "GBTI 测试",
    fullName: "Gestational Behavior Type Indicator",
    chinese: "孕期行为类型指标",
    rationale: "聚焦怀孕阶段很准，但会弱化后续育儿想象部分。",
  },
] as const;

export const PROJECT_BRAND = PROJECT_BRAND_OPTIONS[0];

export const MODELS: readonly { id: ModelId; label: string; dimensionIds: readonly DimensionId[] }[] = [
  { id: "decision", label: "决策模型", dimensionIds: ["factCheck", "delay", "controlCompensation"] },
  { id: "body", label: "身体模型", dimensionIds: ["intrusionSensitivity", "riskSimulation", "recoveryCatastrophizing"] },
  { id: "identity", label: "身份模型", dimensionIds: ["selfContinuity", "motherhoodProjection", "rhythmDefense"] },
  { id: "relationship", label: "关系模型", dimensionIds: ["confirmationNeed", "attachmentNeed", "commitmentVerification"] },
  { id: "reality", label: "现实模型", dimensionIds: ["orderAnxiety", "freedomLossSensitivity", "careLoadEstimation"] },
] as const;

export const DIMENSIONS: readonly DimensionDefinition[] = [
  {
    id: "factCheck",
    label: "核实欲",
    model: "decision",
    lowTag: "先感觉后核实",
    highTag: "先核实再允许自己动情",
    notes: {
      low: "你能先跟着感受走，不会被信息空白卡到完全停机。",
      medium: "你会查关键点，但还不至于查到情绪也一起冻结。",
      high: "只要还有关键空白，你就很难放心把态度说死。",
    },
  },
  {
    id: "delay",
    label: "决断迟滞",
    model: "decision",
    lowTag: "该拍板时能拍板",
    highTag: "先拖住，谁都别逼",
    notes: {
      low: "该做决定时，你更容易进入处理模式，而不是无限缓冲。",
      medium: "你会给自己留一点观察时间，但不会一直挂起。",
      high: "越逼你立刻定论，你越容易先按下暂停键。",
    },
  },
  {
    id: "controlCompensation",
    label: "掌控补偿",
    model: "decision",
    lowTag: "不靠排变量续命",
    highTag: "越慌越想控场",
    notes: {
      low: "你不太需要靠列流程、排变量来稳住自己。",
      medium: "局面一乱时，你会适度整理，但不会什么都想接管。",
      high: "一慌起来，你的大脑就会本能地冲去接管现场。",
    },
  },
  {
    id: "intrusionSensitivity",
    label: "身体侵入敏感",
    model: "body",
    lowTag: "身体变化还能慢慢适应",
    highTag: "身体边界一被改写就起毛",
    notes: {
      low: "你对身体被改写这件事的耐受度相对更高一些。",
      medium: "你会在意身体边界，但还可以慢慢谈、慢慢适应。",
      high: "只要想到身体会长期被改写，警觉感就会先上来。",
    },
  },
  {
    id: "riskSimulation",
    label: "风险预演度",
    model: "body",
    lowTag: "不先把坏剧情放大",
    highTag: "坏情况会先脑内公映",
    notes: {
      low: "你不会本能地先把坏剧情放到最大音量。",
      medium: "你会预想风险，但还不至于一路脑补到最黑版本。",
      high: "坏情况通常会先在你脑内试映几轮，再轮到别人开口。",
    },
  },
  {
    id: "recoveryCatastrophizing",
    label: "恢复灾难想象",
    model: "body",
    lowTag: "恢复期不默认地狱难度",
    highTag: "恢复想象自带灾难片",
    notes: {
      low: "你不会自动把恢复期预设成一部漫长灾难片。",
      medium: "你会担心恢复成本，但还保留一点弹性空间。",
      high: "一想到恢复期，你的大脑就容易先切到重灾版预告。",
    },
  },
  {
    id: "selfContinuity",
    label: "自我连续性",
    model: "identity",
    lowTag: "旧版本自己可以先松一点",
    highTag: "原来的我别断线",
    notes: {
      low: "你对“旧版本自己要不要完整保留”这件事相对没那么执拗。",
      medium: "你希望保住原来的自己，但也知道身份会发生调整。",
      high: "你很在意原来的自己别被整件事直接覆盖掉。",
    },
  },
  {
    id: "motherhoodProjection",
    label: "母职浪漫投射",
    model: "identity",
    lowTag: "不拿母职开滤镜",
    highTag: "母职容易被你想成意义大作",
    notes: {
      low: "你不太会自动给母职套上一层救赎或完整感滤镜。",
      medium: "你能理解母职的意义感，但还不至于被它整套带走。",
      high: "你很容易先被“也许会更完整、更有意义”的画面击中。",
    },
  },
  {
    id: "rhythmDefense",
    label: "人生节奏保卫度",
    model: "identity",
    lowTag: "节奏能让位",
    highTag: "生活节奏不能被整锅端",
    notes: {
      low: "你能接受现有节奏为新变化让一部分位。",
      medium: "你会在意节奏被打乱，但还愿意留出协商空间。",
      high: "你对生活节奏被整锅端这件事格外敏感。",
    },
  },
  {
    id: "confirmationNeed",
    label: "关系确认需求",
    model: "relationship",
    lowTag: "不急着让别人站队",
    highTag: "别人最好赶紧表态",
    notes: {
      low: "别人暂时不表态，也不会立刻让你失去平衡。",
      medium: "你希望听到明确态度，但还不至于立刻炸毛。",
      high: "这种时刻，别人到底站不站你这边，对你非常关键。",
    },
  },
  {
    id: "attachmentNeed",
    label: "陪伴黏连度",
    model: "relationship",
    lowTag: "不靠二十四小时陪伴续命",
    highTag: "需要有人持续在场",
    notes: {
      low: "你不太依赖高密度陪伴，也能自己把系统维持住。",
      medium: "你希望有人稳定在场，但也保留独处的可用性。",
      high: "没人持续陪着一起扛时，你会明显更容易慌。",
    },
  },
  {
    id: "commitmentVerification",
    label: "承诺验收强度",
    model: "relationship",
    lowTag: "口头支持也能先听听",
    highTag: "先拿行动和清单来",
    notes: {
      low: "你对口头支持还有一定耐心，不会立刻要求交作业。",
      medium: "你会看行动，但也愿意给别人一点落实时间。",
      high: "你更信动作、安排和责任分配，不太吃空口安慰。",
    },
  },
  {
    id: "orderAnxiety",
    label: "秩序焦虑",
    model: "reality",
    lowTag: "秩序乱一点也还能转",
    highTag: "一乱套就很难装没事",
    notes: {
      low: "日常秩序乱一点，你还可以边走边修。",
      medium: "你会在意秩序被打乱，但系统还不至于立刻报警。",
      high: "一想到流程和生活节拍要全面重排，你就先开始累。",
    },
  },
  {
    id: "freedomLossSensitivity",
    label: "自由损失敏感",
    model: "reality",
    lowTag: "自由缩水还能谈",
    highTag: "一想到被套牢就警铃大作",
    notes: {
      low: "你对自由被压缩这件事相对更能协商和适应。",
      medium: "你会警觉自由缩水，但还愿意继续谈条件。",
      high: "一想到被长期套进某种角色里，警铃就会先大作。",
    },
  },
  {
    id: "careLoadEstimation",
    label: "照护承重预估",
    model: "reality",
    lowTag: "不会先把照护重量算满",
    highTag: "先算这活到底谁扛",
    notes: {
      low: "你不会一上来就把照护重量按满格估算。",
      medium: "你会想到承重问题，但不会先把最沉那版默认成现实。",
      high: "你很快就会追问一句：这活最后到底谁来扛？",
    },
  },
] as const;

export const QUESTION_SCALE_OPTIONS = [
  { value: 1, label: "完全不像我" },
  { value: 2, label: "比较不像我" },
  { value: 3, label: "一半一半" },
  { value: 4, label: "比较像我" },
  { value: 5, label: "非常像我" },
] as const;

export const QUESTIONS = [
  { id: "Q01", dimensionId: "factCheck", format: "scenario", prompt: "刚测出两道杠，你第一反应是把能确认的信息先查全。" },
  { id: "Q02", dimensionId: "factCheck", format: "scenario", prompt: "只要还有关键空白，你就很难允许自己先表态。" },
  { id: "Q03", dimensionId: "delay", format: "scenario", prompt: "越接近要做决定，你越容易想先放着，明天再谈。" },
  { id: "Q04", dimensionId: "delay", format: "statement", prompt: "一旦别人催你定，你的大脑会自动开始装死。" },
  { id: "Q05", dimensionId: "controlCompensation", format: "scenario", prompt: "一慌起来，你会先排计划、列变量、想把局面控住。" },
  { id: "Q06", dimensionId: "controlCompensation", format: "statement", prompt: "把流程写清楚这件事，会比安慰更快让你冷静。" },
  { id: "Q07", dimensionId: "intrusionSensitivity", format: "scenario", prompt: "一想到身体要被长时间改写，你会先起生理性的抗拒。" },
  { id: "Q08", dimensionId: "intrusionSensitivity", format: "statement", prompt: "别人把怀孕说得太自然时，你反而会更不舒服。" },
  { id: "Q09", dimensionId: "riskSimulation", format: "scenario", prompt: "还没出事，你脑子里已经把坏情况试映了三遍。" },
  { id: "Q10", dimensionId: "riskSimulation", format: "statement", prompt: "知道风险的细枝末节，哪怕吓人，也比不知道更让你踏实。" },
  { id: "Q11", dimensionId: "recoveryCatastrophizing", format: "scenario", prompt: "你会先想到恢复期会不会把自己折腾废。" },
  { id: "Q12", dimensionId: "recoveryCatastrophizing", format: "statement", prompt: "关于疼痛、失控和长期疲惫，你通常不会往轻里想。" },
  { id: "Q13", dimensionId: "selfContinuity", format: "scenario", prompt: "你最先难受的点之一，是原来的自己可能会断线。" },
  { id: "Q14", dimensionId: "selfContinuity", format: "statement", prompt: "无论最后怎样，你都很在意别把自己整个人换掉。" },
  { id: "Q15", dimensionId: "motherhoodProjection", format: "scenario", prompt: "你会不自觉脑补一些“当妈之后也许会完整起来”的画面。" },
  { id: "Q16", dimensionId: "motherhoodProjection", format: "statement", prompt: "母职这件事对你来说，容易自带一点意义滤镜。" },
  { id: "Q17", dimensionId: "rhythmDefense", format: "scenario", prompt: "一想到现有节奏会被整体打乱，你会先皱眉。" },
  { id: "Q18", dimensionId: "rhythmDefense", format: "statement", prompt: "哪怕别人说会适应，你还是想尽量守住自己的时间线。" },
  { id: "Q19", dimensionId: "confirmationNeed", format: "statement", prompt: "这种时候，别人到底站不站你这边，对你很重要。" },
  { id: "Q20", dimensionId: "confirmationNeed", format: "scenario", prompt: "如果伴侣或家人态度含糊，你会明显更烦。" },
  { id: "Q21", dimensionId: "attachmentNeed", format: "statement", prompt: "你会很需要有人持续在场，而不是偶尔冒出来关心一下。" },
  { id: "Q22", dimensionId: "attachmentNeed", format: "scenario", prompt: "没人陪着一起扛时，你更容易慌。" },
  { id: "Q23", dimensionId: "commitmentVerification", format: "statement", prompt: "你更信具体行动，不太吃空口安慰。" },
  { id: "Q24", dimensionId: "commitmentVerification", format: "scenario", prompt: "别人说支持你时，你会下意识想问：具体怎么支持？" },
  { id: "Q25", dimensionId: "orderAnxiety", format: "statement", prompt: "生活一乱套，你很难假装没事继续转。" },
  { id: "Q26", dimensionId: "orderAnxiety", format: "scenario", prompt: "一想到日常流程要重排，你就已经开始累了。" },
  { id: "Q27", dimensionId: "freedomLossSensitivity", format: "statement", prompt: "一想到自由时间和个人空间可能被长期压缩，你会先警铃大作。" },
  { id: "Q28", dimensionId: "freedomLossSensitivity", format: "scenario", prompt: "被固定进某种角色里这件事，本身就会让你抗拒。" },
  { id: "Q29", dimensionId: "careLoadEstimation", format: "statement", prompt: "你会先算照护这件事到底有多重，而不是先谈情怀。" },
  { id: "Q30", dimensionId: "careLoadEstimation", format: "scenario", prompt: "你脑子里很快会出现一句话：这活最后到底谁来扛？" },
] as const satisfies readonly QuestionDefinition[];

export type QuestionId = (typeof QUESTIONS)[number]["id"];
export type QuestionAnswerMap = Record<QuestionId, number | null>;

export const FAMILIES: readonly FamilyDefinition[] = [
  { id: "control", name: "控盘家族", summary: "事情还没开始，脑内已经先跑完三轮风控。", accentFrom: "#a3473d", accentTo: "#dd8b66" },
  { id: "delay", name: "缓刑家族", summary: "不是没想法，是谁都别催我现在给答案。", accentFrom: "#4e5c8a", accentTo: "#8ba4d8" },
  { id: "audit", name: "验收家族", summary: "说支持可以，但先把清单、动作和责任摆出来。", accentFrom: "#326c63", accentTo: "#7bb39b" },
  { id: "boundary", name: "边界家族", summary: "不是冷，是不想被整个人吞没。", accentFrom: "#8c4b64", accentTo: "#d497ad" },
  { id: "sacrifice", name: "献祭家族", summary: "还没开始，已经在想自己要先让掉多少。", accentFrom: "#8b5a2b", accentTo: "#d8a76d" },
  { id: "projection", name: "投射家族", summary: "未来画面感太强，容易先爱上想象。", accentFrom: "#4d7e49", accentTo: "#9aca7a" },
  { id: "foundation", name: "地基家族", summary: "先看承重，再谈理想。", accentFrom: "#3d6473", accentTo: "#88b8bf" },
  { id: "disorder", name: "失序家族", summary: "变量一多，系统就开始抖。", accentFrom: "#6c3f7a", accentTo: "#b28ad4" },
  { id: "fallback", name: "噪点家族", summary: "不是类型没了，是你的脑内频道在同时开麦。", accentFrom: "#434343", accentTo: "#a2a2a2" },
] as const;

function vector(input: ScoreVector): ScoreVector {
  return input;
}

function tweak(base: ScoreVector, patch: Partial<ScoreVector>): ScoreVector {
  return DIMENSION_IDS.reduce(
    (accumulator, dimensionId) => ({
      ...accumulator,
      [dimensionId]: Math.min(5, Math.max(1, patch[dimensionId] ?? base[dimensionId])),
    }),
    {} as ScoreVector,
  );
}

const FAMILY_BASELINES: Record<Exclude<FamilyId, "fallback">, ScoreVector> = {
  control: vector({
    factCheck: 4.5,
    delay: 2.0,
    controlCompensation: 4.5,
    intrusionSensitivity: 3.2,
    riskSimulation: 4.4,
    recoveryCatastrophizing: 3.6,
    selfContinuity: 3.3,
    motherhoodProjection: 2.4,
    rhythmDefense: 3.7,
    confirmationNeed: 3.0,
    attachmentNeed: 2.6,
    commitmentVerification: 3.8,
    orderAnxiety: 4.4,
    freedomLossSensitivity: 3.5,
    careLoadEstimation: 4.0,
  }),
  delay: vector({
    factCheck: 3.2,
    delay: 4.6,
    controlCompensation: 2.8,
    intrusionSensitivity: 3.4,
    riskSimulation: 4.0,
    recoveryCatastrophizing: 3.9,
    selfContinuity: 3.5,
    motherhoodProjection: 3.0,
    rhythmDefense: 3.8,
    confirmationNeed: 3.2,
    attachmentNeed: 3.1,
    commitmentVerification: 2.9,
    orderAnxiety: 3.8,
    freedomLossSensitivity: 3.9,
    careLoadEstimation: 3.6,
  }),
  audit: vector({
    factCheck: 4.0,
    delay: 2.8,
    controlCompensation: 3.6,
    intrusionSensitivity: 3.0,
    riskSimulation: 3.5,
    recoveryCatastrophizing: 3.4,
    selfContinuity: 3.1,
    motherhoodProjection: 2.8,
    rhythmDefense: 3.3,
    confirmationNeed: 4.3,
    attachmentNeed: 3.7,
    commitmentVerification: 4.6,
    orderAnxiety: 3.7,
    freedomLossSensitivity: 3.2,
    careLoadEstimation: 4.3,
  }),
  boundary: vector({
    factCheck: 3.4,
    delay: 2.6,
    controlCompensation: 3.4,
    intrusionSensitivity: 4.6,
    riskSimulation: 3.6,
    recoveryCatastrophizing: 3.3,
    selfContinuity: 4.5,
    motherhoodProjection: 2.1,
    rhythmDefense: 4.5,
    confirmationNeed: 2.8,
    attachmentNeed: 2.0,
    commitmentVerification: 3.3,
    orderAnxiety: 3.2,
    freedomLossSensitivity: 4.6,
    careLoadEstimation: 3.5,
  }),
  sacrifice: vector({
    factCheck: 2.9,
    delay: 3.0,
    controlCompensation: 2.8,
    intrusionSensitivity: 2.8,
    riskSimulation: 3.3,
    recoveryCatastrophizing: 3.2,
    selfContinuity: 2.2,
    motherhoodProjection: 3.8,
    rhythmDefense: 2.4,
    confirmationNeed: 4.0,
    attachmentNeed: 4.5,
    commitmentVerification: 3.6,
    orderAnxiety: 3.5,
    freedomLossSensitivity: 2.4,
    careLoadEstimation: 4.6,
  }),
  projection: vector({
    factCheck: 2.8,
    delay: 2.6,
    controlCompensation: 2.7,
    intrusionSensitivity: 2.7,
    riskSimulation: 2.9,
    recoveryCatastrophizing: 2.8,
    selfContinuity: 2.7,
    motherhoodProjection: 4.8,
    rhythmDefense: 2.6,
    confirmationNeed: 3.7,
    attachmentNeed: 3.8,
    commitmentVerification: 3.1,
    orderAnxiety: 2.6,
    freedomLossSensitivity: 2.5,
    careLoadEstimation: 2.7,
  }),
  foundation: vector({
    factCheck: 4.3,
    delay: 2.4,
    controlCompensation: 3.5,
    intrusionSensitivity: 3.1,
    riskSimulation: 3.7,
    recoveryCatastrophizing: 3.5,
    selfContinuity: 3.6,
    motherhoodProjection: 2.5,
    rhythmDefense: 3.6,
    confirmationNeed: 3.2,
    attachmentNeed: 3.0,
    commitmentVerification: 4.0,
    orderAnxiety: 4.2,
    freedomLossSensitivity: 3.4,
    careLoadEstimation: 4.8,
  }),
  disorder: vector({
    factCheck: 3.7,
    delay: 4.3,
    controlCompensation: 3.8,
    intrusionSensitivity: 4.0,
    riskSimulation: 4.4,
    recoveryCatastrophizing: 4.2,
    selfContinuity: 3.8,
    motherhoodProjection: 3.7,
    rhythmDefense: 4.0,
    confirmationNeed: 3.6,
    attachmentNeed: 3.8,
    commitmentVerification: 3.5,
    orderAnxiety: 4.3,
    freedomLossSensitivity: 4.2,
    careLoadEstimation: 4.0,
  }),
};

const FINAL_ARTWORK_CODES = new Set([
  "CTRL",
  "SCAN",
  "GRID",
  "DRAG",
  "FOGG",
  "HUSH",
  "QCER",
  "LIST",
  "TICK",
  "WALL",
  "SOLO",
  "EXIT",
  "HOLD",
  "GIVE",
  "SPNG",
  "GLOW",
  "FILM",
  "NEST",
  "BASE",
  "LOAD",
  "PLAN",
  "SHAK",
  "CLAS",
  "FRAY",
]);

const ARCHETYPE_SPECS = [
  {
    code: "CTRL",
    familyId: "control",
    name: "控盘总监",
    punchline: "先别感动，我先把变量列完。",
    intro: "你不是冷静，你是会在情绪刚起头时先拉一块白板出来。",
    reaction: "发现怀孕后，你通常先核实、再排优先级、再决定谁能进入你的工作区。未来养育的想象里，你会本能地去找流程、边界和可控点。",
    failureMode: "最容易翻车的地方，是把“掌控感”误当成“安全感”，最后所有人都在等你拍板，而你也累到像临时项目经理。",
    needFromOthers: "别给你空泛鸡汤，给你更新、时间点和能执行的动作，你反而会松一口气。",
    patch: { factCheck: 4.8, delay: 1.6, controlCompensation: 4.8, orderAnxiety: 4.7 },
  },
  {
    code: "SCAN",
    familyId: "control",
    name: "风险巡检员",
    punchline: "我不是乌鸦嘴，我只是先做演习。",
    intro: "你会先把坏剧情演一遍，不是为了吓自己，是为了别被现实偷袭。",
    reaction: "刚知道怀孕时，你比起兴奋，更容易先扫风险点。想到养育，你先想的是身体、意外、失控和应急预案。",
    failureMode: "最容易翻车的地方，是所有风险都被你当成今天就要解决，最后你明明在防雷，却把自己也炸得很紧。",
    needFromOthers: "别人最有用的支持不是劝你别想太多，而是帮你把不确定拆成能核实的几件事。",
    patch: { riskSimulation: 4.9, recoveryCatastrophizing: 4.1, intrusionSensitivity: 3.8 },
  },
  {
    code: "GRID",
    familyId: "control",
    name: "排班工程师",
    punchline: "谁来扛、什么时候扛、怎么交接，先排上。",
    intro: "你不是没感受，你只是习惯先把承重结构画出来。",
    reaction: "你面对怀孕和未来照护时，很快会开始算时间、责任和流程。别人还在说感受，你已经在做资源配置。",
    failureMode: "最容易翻车的地方，是提前把自己活成总控台，最后连别人的部分也一起背了。",
    needFromOthers: "最有效的配合，是有人肯一起把脏活累活说清楚，而不是只在价值观上表态。",
    patch: { commitmentVerification: 4.2, orderAnxiety: 4.7, careLoadEstimation: 4.5, freedomLossSensitivity: 3.9 },
  },
  {
    code: "DRAG",
    familyId: "delay",
    name: "缓刑选手",
    punchline: "不是不决定，是现在谁都别逼我决定。",
    intro: "你知道事情在那里，但你的系统会先争取一点喘息期。",
    reaction: "面对怀孕时，你常常不是没想法，而是会先把“立刻给答案”这件事往后推。未来养育的想象一旦太实，你就会先想暂停。",
    failureMode: "最容易翻车的地方，是拖延本来只是自保，拖久了却变成所有变量一起涨价。",
    needFromOthers: "给你一点不被追打的时间窗口，再约清楚下一次对话，比当场逼答更有效。",
    patch: { delay: 4.9, controlCompensation: 2.4 },
  },
  {
    code: "FOGG",
    familyId: "delay",
    name: "雾里保留派",
    punchline: "我不是没在想，我只是还没愿意把它说实。",
    intro: "你会把自己留在模糊区，不是装没事，而是怕一旦说死就没有退路。",
    reaction: "刚发现怀孕时，你可能一边反复想，一边迟迟不愿意把想法说得很硬。对未来育儿的画面，你会看一会儿，又主动把焦点拨散。",
    failureMode: "最容易翻车的地方，是模糊本来是缓冲区，最后却让你和周围人都误判你到底在想什么。",
    needFromOthers: "别人最该做的不是替你下定义，而是帮你把含糊的部分说成几种可选状态。",
    patch: { delay: 4.8, riskSimulation: 4.2, attachmentNeed: 3.4, motherhoodProjection: 3.2 },
  },
  {
    code: "HUSH",
    familyId: "delay",
    name: "暂缓保命人",
    punchline: "我先静音，不代表我没听见。",
    intro: "你不是慢，是你的系统先选择别再往里灌刺激。",
    reaction: "面对怀孕或未来养育的压迫感时，你会先关掉输入，避免自己被推到必须立刻表态的位置。",
    failureMode: "最容易翻车的地方，是自保式静音被外界理解成不在乎，反而把关系压力再抬一层。",
    needFromOthers: "给你短句、低压、可暂停的沟通空间，比情绪围攻更能让你回来。",
    patch: { delay: 4.7, intrusionSensitivity: 3.8, freedomLossSensitivity: 4.4, confirmationNeed: 2.8 },
  },
  {
    code: "QCER",
    familyId: "audit",
    name: "承诺验收官",
    punchline: "嘴上支持不记分，交付才记分。",
    intro: "你对关系并不是高要求，你只是太清楚口号和兑现不是一回事。",
    reaction: "怀孕把关系里的虚实放大后，你会特别在意谁是真站队、谁只是说漂亮话。你想象育儿时，首先看到的是承诺是否能落地。",
    failureMode: "最容易翻车的地方，是你把验收开得太早太严，最后每个人都像在参加一场突击答辩。",
    needFromOthers: "清楚地说我能做什么、不能做什么，会比感人表态更让你信任。",
    patch: { confirmationNeed: 4.7, commitmentVerification: 5, factCheck: 4.2 },
  },
  {
    code: "LIST",
    familyId: "audit",
    name: "清单审计师",
    punchline: "你说爱我可以，先把待办列出来。",
    intro: "你习惯拿清单替关系去雾，因为任务比口气更诚实。",
    reaction: "你面对怀孕和育儿议题时，会下意识想知道事项、节奏和责任分布。你的安全感更接近“可核对”，不是“被哄好”。",
    failureMode: "最容易翻车的地方，是一切都被你拉进检查表，亲密关系很容易被做成项目复盘。",
    needFromOthers: "愿意一起对齐任务、时间和责任的人，会让你明显放松。",
    patch: { factCheck: 4.1, commitmentVerification: 4.8, orderAnxiety: 4.0, careLoadEstimation: 4.6 },
  },
  {
    code: "TICK",
    familyId: "audit",
    name: "落地勾选员",
    punchline: "想法先别飞，先看谁能落地。",
    intro: "你不是悲观，你只是对“最后是不是我收尾”这件事很有记忆。",
    reaction: "怀孕这类高压议题里，你会先抓可执行的部分。你看未来养育时，很快会想起日常运营、体力账和长线配合。",
    failureMode: "最容易翻车的地方，是还没发生的事也先按最累的版本做验收，最后自己先被压垮。",
    needFromOthers: "和你说“到时候再看”基本没用，和你一起补全落地细节才有用。",
    patch: { controlCompensation: 3.9, commitmentVerification: 4.8, attachmentNeed: 3.2 },
  },
  {
    code: "WALL",
    familyId: "boundary",
    name: "边界警长",
    punchline: "不是我冷，是别一上来就越线。",
    intro: "你对怀孕和母职最敏感的，不一定是责任，而是侵入。",
    reaction: "当别人把你的身体、时间和身份视为默认可调用时，你会立刻紧起来。你想象育儿时，会优先关心自己还能不能保有边界。",
    failureMode: "最容易翻车的地方，是为了守线把门焊死，最后真正想帮你的人也被一起挡在外面。",
    needFromOthers: "先问边界、再给建议；先给选择、再谈期待，这样你才会愿意继续说。",
    patch: { intrusionSensitivity: 4.9, attachmentNeed: 1.7, freedomLossSensitivity: 4.8 },
  },
  {
    code: "SOLO",
    familyId: "boundary",
    name: "自留区馆长",
    punchline: "我不是拒绝亲密，我是在保住我自己。",
    intro: "你很在意原来的自己能不能活着穿过这件事，而不是被母职一键覆盖。",
    reaction: "面对怀孕和养育想象时，你首先关心的是自我连续性、节奏和个人空间是否会被整锅端走。",
    failureMode: "最容易翻车的地方，是你为了守住自己，把一切需求都练成了“我自己来”，最后真正累的是你。",
    needFromOthers: "别人要做的不是劝你伟大，而是尊重你还有自己的时间、语言和边界。",
    patch: { selfContinuity: 4.8, rhythmDefense: 4.8, confirmationNeed: 2.6 },
  },
  {
    code: "EXIT",
    familyId: "boundary",
    name: "逃生通道师",
    punchline: "先告诉我门在哪里，我才能坐下来谈。",
    intro: "你需要先确认自己不是被困住，系统才会愿意往前一点。",
    reaction: "你面对怀孕和未来育儿时，会先找退出空间、缓冲区和可逆性。没有通道感，你很难真正投入讨论。",
    failureMode: "最容易翻车的地方，是出口找太久，结果把所有关系都谈成了紧急撤离演练。",
    needFromOthers: "和你讨论时保留选择权、节奏权和暂停权，会比道德绑架有效得多。",
    patch: { delay: 2.9, freedomLossSensitivity: 5, orderAnxiety: 3.0 },
  },
  {
    code: "HOLD",
    familyId: "sacrifice",
    name: "扛事预备役",
    punchline: "事情还没落地，你已经在想自己先顶哪一段。",
    intro: "你会很快把自己摆进承重位，哪怕还没人正式要求你。",
    reaction: "刚面对怀孕，你就容易先想到自己要扛哪些身体、关系和照护负荷。未来养育里，你很容易主动预支责任。",
    failureMode: "最容易翻车的地方，是你把可靠活成默认配置，久了谁都忘了你也是会累的人。",
    needFromOthers: "别人别把你的懂事当背景音，主动接手具体负担才是真配合。",
    patch: { attachmentNeed: 4.7, careLoadEstimation: 4.9, selfContinuity: 2.0 },
  },
  {
    code: "GIVE",
    familyId: "sacrifice",
    name: "懂事燃料包",
    punchline: "我能配合，但也别默认我永远能配合。",
    intro: "你很会体谅全场，但这份体谅有时会先吞掉你自己的版本。",
    reaction: "怀孕带来的关系和现实压力里，你会很快去理解别人、照顾大局，甚至替周围人把台阶也搭好。",
    failureMode: "最容易翻车的地方，是你把自己说服得太快，最后真正难受的部分都被压到后台。",
    needFromOthers: "别夸你懂事了，直接来问你真正不想让的是什么，更有用。",
    patch: { motherhoodProjection: 4.0, confirmationNeed: 4.2, freedomLossSensitivity: 2.2 },
  },
  {
    code: "SPNG",
    familyId: "sacrifice",
    name: "情绪海绵体",
    punchline: "全场的情绪都能被我顺手吸一点。",
    intro: "你很容易先感受到别人的反应，再回头处理自己的感受。",
    reaction: "遇到怀孕这种会触发全场情绪的话题时，你会明显在意别人是否慌、是否失望、是否需要你稳定局面。",
    failureMode: "最容易翻车的地方，是你忙着吸收所有人的波动，最后连自己到底怎么想都被泡软了。",
    needFromOthers: "别人最该做的，是别把自己的情绪直接倒给你处理。",
    patch: { confirmationNeed: 4.4, attachmentNeed: 4.9, controlCompensation: 2.5 },
  },
  {
    code: "GLOW",
    familyId: "projection",
    name: "母职滤镜师",
    punchline: "这张未来海报确实拍得有点好看。",
    intro: "你容易先被“也许会变完整、变柔软、变有意义”的画面击中。",
    reaction: "面对怀孕和未来养育，你会比别人更快出现温柔、连接或成长的想象。这些画面会真的影响你的判断氛围。",
    failureMode: "最容易翻车的地方，是滤镜太顺手，现实重量被你自动柔焦了。",
    needFromOthers: "别人不用打碎你的浪漫，但需要有人提醒你把现实成本也摆上桌。",
    patch: { motherhoodProjection: 5, attachmentNeed: 3.9, riskSimulation: 2.6 },
  },
  {
    code: "FILM",
    familyId: "projection",
    name: "人生预告片",
    punchline: "我不是冲动，我只是脑内预告片太会剪。",
    intro: "你会很快把一个选择接到自我叙事里，看它像不像自己的人生章节。",
    reaction: "怀孕这件事对你来说，不只是现实事件，也很容易变成关于人生方向、身份意义和故事感的投影幕。",
    failureMode: "最容易翻车的地方，是剧情张力比现实执行更先到场，最后你爱上的是故事，不一定是日常。",
    needFromOthers: "别人可以陪你谈意义，但也要帮你把画面拆回到可过的日子。",
    patch: { selfContinuity: 2.5, motherhoodProjection: 4.9, rhythmDefense: 2.4 },
  },
  {
    code: "NEST",
    familyId: "projection",
    name: "氛围筑巢者",
    punchline: "我先想象那个家，再决定要不要进去。",
    intro: "你会先被关系感、空间感和生活气味打动，而不是先去算账。",
    reaction: "你想到怀孕和养育时，常常先看到的是一个关系场景、一种家里的空气，或者某种被需要的氛围。",
    failureMode: "最容易翻车的地方，是氛围搭得很满，分工和承重却还没开工。",
    needFromOthers: "真正对你有帮助的人，不是嘲笑你浪漫，而是和你一起把浪漫落到结构上。",
    patch: { motherhoodProjection: 4.9, attachmentNeed: 4.0, orderAnxiety: 2.8, careLoadEstimation: 2.9 },
  },
  {
    code: "BASE",
    familyId: "foundation",
    name: "地基会计师",
    punchline: "没有地基的理想，风一吹就散。",
    intro: "你不是扫兴，你只是知道很多好意最后都是被现实账单收尾。",
    reaction: "面对怀孕和育儿时，你会本能地先评估资源、时间、体力和持续承重能力。你更关心这件事能不能长期活下去。",
    failureMode: "最容易翻车的地方，是所有东西都先按最稳版本去估，结果开心和弹性一起被压低。",
    needFromOthers: "别人别把你说成现实过头，认真和你算承重，反而会让你更愿意谈可能性。",
    patch: { factCheck: 4.6, delay: 2.3, careLoadEstimation: 5 },
  },
  {
    code: "LOAD",
    familyId: "foundation",
    name: "承重估算员",
    punchline: "情怀我听得懂，但体力账也得结。",
    intro: "你会先想到恢复、体力、长期疲惫和无人接班时的样子。",
    reaction: "怀孕和养育在你这里，首先是一套会落到身体和日常的重量系统。你对“能不能扛住”比对“听起来像不像爱”更敏感。",
    failureMode: "最容易翻车的地方，是还没开始你就先把自己压成了劳损预演片。",
    needFromOthers: "别人如果肯主动讨论谁来接手、谁来补位、谁来撑恢复期，你会立刻觉得这事靠谱了一点。",
    patch: { recoveryCatastrophizing: 3.8, orderAnxiety: 4.3, careLoadEstimation: 5 },
  },
  {
    code: "PLAN",
    familyId: "foundation",
    name: "现实总包人",
    punchline: "可以做梦，但施工图也得有。",
    intro: "你不是爱扫兴，你只是习惯把愿望和执行放在同一张桌上。",
    reaction: "你一想到怀孕和未来养育，就会同步去看流程、承诺、资源和长期维护。你很难只讨论其中一半。",
    failureMode: "最容易翻车的地方，是你先把整套系统都扛在脑子里，久了周围人会默认你最会搞定。",
    needFromOthers: "最好的支持是一起分包，不是把“你比较靠谱”当赞美后顺手全部外包给你。",
    patch: { factCheck: 4.4, controlCompensation: 3.7, commitmentVerification: 4.3, careLoadEstimation: 4.9 },
  },
  {
    code: "SHAK",
    familyId: "disorder",
    name: "变量抖动体",
    punchline: "变量一多，我整个人先进入震动模式。",
    intro: "你不是矫情，你只是会同时收到太多频道的拉扯。",
    reaction: "面对怀孕这类高强度事件，你的风险感、秩序感、自由感和关系感会一起响。你不是没逻辑，是逻辑太多路同时开。",
    failureMode: "最容易翻车的地方，是每个维度都像真的，于是你每一步都像在和另一个自己打架。",
    needFromOthers: "别人别急着给你定性，先帮你缩小讨论范围，一次只处理一层。",
    patch: { delay: 4.5, riskSimulation: 4.7, orderAnxiety: 4.6 },
  },
  {
    code: "CLAS",
    familyId: "disorder",
    name: "紧急乱序员",
    punchline: "我不是没整理，我是在边整理边继续乱。",
    intro: "你会在失序时拼命想控一下，但又会被新的变量马上打断。",
    reaction: "你面对怀孕和未来养育时，很容易一边想做结构，一边又被新的风险、关系和现实重量拖走。",
    failureMode: "最容易翻车的地方，是你把所有事情都放进紧急轨，结果每件事都在同时报警。",
    needFromOthers: "别人最该做的，是帮你把优先级排出来，而不是继续往你面前丢新变量。",
    patch: { controlCompensation: 4.0, delay: 4.4, orderAnxiety: 4.5 },
  },
  {
    code: "FRAY",
    familyId: "disorder",
    name: "线程打结者",
    punchline: "身体、关系、自由和现实，四根线一起缠住我。",
    intro: "你的纠结常常不是一条主线，而是几条线互相打结。",
    reaction: "怀孕这件事在你这里，既牵身体边界，也牵关系黏连，还牵自由损失和现实承重，所以你很难只在一个平面上想它。",
    failureMode: "最容易翻车的地方，是所有线都很有道理，最后你连自己卡在哪个结上都讲不清。",
    needFromOthers: "别人别给你大而化之的建议，帮你一根一根拆线才是真的有用。",
    patch: { intrusionSensitivity: 4.2, attachmentNeed: 4.0, freedomLossSensitivity: 4.5 },
  },
] as const;

export const ARCHETYPES: readonly ArchetypeDefinition[] = ARCHETYPE_SPECS.map((spec) => ({
  code: spec.code,
  familyId: spec.familyId,
  name: spec.name,
  punchline: spec.punchline,
  intro: spec.intro,
  reaction: spec.reaction,
  failureMode: spec.failureMode,
  needFromOthers: spec.needFromOthers,
  artwork:
    FINAL_ARTWORK_CODES.has(spec.code)
      ? {
          posterPath: `/archetypes/${spec.code}.png`,
          alt: `${spec.code} ${spec.name}角色海报`,
          status: "final",
        }
      : undefined,
  prototype: tweak(FAMILY_BASELINES[spec.familyId], spec.patch),
}));

export const FALLBACK_ARCHETYPE: ArchetypeDefinition = {
  code: "NOIS",
  familyId: "fallback",
  name: "噪点综合体",
  punchline: "不是你没类型，是你脑内频道同时开麦。",
  intro: "当多股反应一起拉扯、又和所有标准原型都差一口气时，结果就会掉进这里。",
  reaction: "你不是没有模式，而是好几种模式同时抢前排。怀孕和养育想象在你这里像多路输入并发播放，谁都不像背景音。",
  failureMode: "最容易翻车的地方，是你把每一种声音都当成最终结论，最后整个人卡在过载状态里。",
  needFromOthers: "最需要的不是替你定性，而是帮你缩小范围、降低噪声、把最重要的一条线先拉出来。",
  artwork: {
    posterPath: "/archetypes/NOIS.png",
    alt: "NOIS 噪点综合体角色海报",
    status: "final",
  },
  prototype: vector({
    factCheck: 3,
    delay: 3,
    controlCompensation: 3,
    intrusionSensitivity: 3,
    riskSimulation: 3,
    recoveryCatastrophizing: 3,
    selfContinuity: 3,
    motherhoodProjection: 3,
    rhythmDefense: 3,
    confirmationNeed: 3,
    attachmentNeed: 3,
    commitmentVerification: 3,
    orderAnxiety: 3,
    freedomLossSensitivity: 3,
    careLoadEstimation: 3,
  }),
};

export const ALL_ARCHETYPES: readonly ArchetypeDefinition[] = [...ARCHETYPES, FALLBACK_ARCHETYPE];

const FAMILY_DESCRIPTION_OPENERS: Record<FamilyId, string> = {
  control: "你不是天生爱控场，你只是很难把方向盘交给一个还没做功课的人。 ",
  delay: "你不是单纯拖延，你更像在用暂停键给自己争回一点不被逼着表态的空间。 ",
  audit: "你不是爱抬杠，你只是比很多人更早意识到口头支持和实际承重根本不是一回事。 ",
  boundary: "你不是冷，你只是先感到边界被改写，然后才轮到情绪和道理上桌。 ",
  sacrifice: "你不是自带圣光，你只是太容易先把自己放进那个最能扛的位置。 ",
  projection: "你不是天真，你只是比很多人更容易先被未来画面、关系想象和意义感击中。 ",
  foundation: "你不是扫兴，你只是比氛围更早看到长期承重这张账单。 ",
  disorder: "你不是矫情，你只是很多条高压线路会在同一时间一起报警。 ",
  fallback: "你不是没有类型，你只是暂时不像任何单一原型那样安静。 ",
};

export function getArchetypeDescription(archetype: ArchetypeDefinition): string {
  return `${archetype.name}这型人，往往不是事情一来就立刻拍板，而是脑内先开拍一部只对自己上映的特别篇。${archetype.intro} 你看起来像在想剧情，其实是在替未来试镜，想先确认这个选择配不配进入你的人生主线。好处是你对细微情绪和隐含意义很敏感，常能比别人更早察觉哪件事会真正改变自己；代价是，${archetype.failureMode} 所以你最需要的不是旁人催你“现实一点”，而是有人既懂你的感受戏，又肯陪你把镜头落回日常执行。说到底，${archetype.needFromOthers}`;
}

export function getDimension(dimensionId: DimensionId): DimensionDefinition {
  const match = DIMENSIONS.find((dimension) => dimension.id === dimensionId);

  if (!match) {
    throw new Error(`Unknown dimension: ${dimensionId}`);
  }

  return match;
}

export function getFamily(familyId: FamilyId): FamilyDefinition {
  const match = FAMILIES.find((family) => family.id === familyId);

  if (!match) {
    throw new Error(`Unknown family: ${familyId}`);
  }

  return match;
}

export function getArchetype(code: string): ArchetypeDefinition {
  const match = ALL_ARCHETYPES.find((archetype) => archetype.code === code);

  if (!match) {
    throw new Error(`Unknown archetype: ${code}`);
  }

  return match;
}
