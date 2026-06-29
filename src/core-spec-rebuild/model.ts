import { STATIC_ARCHETYPE_SECTIONS } from "./archetypeSections";

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

export interface ArchetypeSection {
  title: string;
  body: string;
}

export interface ArchetypeDefinition {
  code: string;
  name: string;
  punchline: string;
  familyId: FamilyId;
  intro: string;
  sections: readonly ArchetypeSection[];
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

type ArchetypeContentSeed = {
  firstReaction: string;
  mentalPreview: string;
  coreConcern: string;
  selfPressure: string;
  distortionTrigger: string;
  effectiveSupport: string;
};

const INTRO_OPENERS: Record<string, string> = {
  CTRL: "CTRL 往往不是先慌，是先把总控台亮起来。",
  SCAN: "SCAN 常常不是先高兴，是先跑一轮风险演习。",
  GRID: "GRID 一听到大事，脑内先开工的通常是结构图。",
  DRAG: "DRAG 最先启动的不是答案，而是缓冲区。",
  FOGG: "FOGG 最拿手的不是定论，而是先把雾留住。",
  HUSH: "HUSH 遇到压强太高的话题，先按下的是静音键。",
  QCER: "QCER 一听见承诺，直觉先去看交付口。",
  LIST: "LIST 脑内最先冒出来的，常常不是情绪而是待办。",
  TICK: "TICK 对落地成本的嗅觉，通常比气氛更早上线。",
  WALL: "WALL 真正先响的，多半不是情绪而是边界警报。",
  SOLO: "SOLO 第一反应往往不是靠近，而是先保住自己。",
  EXIT: "EXIT 真正要先确认的，从来都是门还在不在。",
  HOLD: "HOLD 事情还没落地，肩膀已经先预热了。",
  GIVE: "GIVE 常常还没轮到自己，就先在照顾全场。",
  SPNG: "SPNG 的雷达很灵，别人情绪一变你先知道。",
  GLOW: "GLOW 最容易先被点亮的，是那张未来海报。",
  FILM: "FILM 一有重大变化，脑内预告片就开始剪了。",
  NEST: "NEST 对这类议题的入口，常常是一种家的气味。",
  BASE: "BASE 一开局先看的，通常不是浪漫而是地基。",
  LOAD: "LOAD 对重量的感知很具体，几乎一秒就有账。",
  PLAN: "PLAN 很难只聊一半，因为执行表会自动弹出。",
  SHAK: "SHAK 最难受的不是单点问题，而是全频道一起响。",
  CLAS: "CLAS 会一边整理混乱，一边被新混乱继续打断。",
  FRAY: "FRAY 的纠结通常不是一条线，而是一团线。",
  NOIS: "NOIS 像所有频道同时开麦，谁都不肯当背景音。",
};

const INTRO_SCENE_LINES: Record<string, string> = {
  CTRL: "验孕棒刚出线，你先想把信息补齐；话题一拐到分工，脑内白板就已经展开。",
  SCAN: "别人还在消化消息时，你多半已经先去扫身体信号、风险点和可能翻车的环节。",
  GRID: "有些人先感受，你通常先在脑内排谁接哪段、谁补哪班、谁来维持日常运转。",
  DRAG: "消息一落下，你最先做的常常不是表态，而是给自己抢一点别被立刻逼答的缓冲。",
  FOGG: "你会先把结论压住，不急着说死，因为太早定调会让很多退路当场关门。",
  HUSH: "话题一变重，你常会先把外界音量调低，免得系统被推到只能硬撑的程度。",
  QCER: "一说到怀孕和以后怎么带，你先看的不是态度，是谁说了会做、谁只是会说。",
  LIST: "你很容易一边听，一边把事项、节奏和责任人自动整理成待办清单。",
  TICK: "别人想到的是大方向，你先想到的是夜里谁起、杂务谁补、收尾谁认领。",
  WALL: "你最先响起的常常不是母爱滤镜，而是身体、时间和决定权会不会被越线。",
  SOLO: "你会先确认那个原来的自己还在不在，而不是先急着把新角色往身上套。",
  EXIT: "你第一时间更在意门有没有留着，能不能暂停、能不能回头、能不能重新谈。",
  HOLD: "很多人还在讨论愿不愿意，你已经先把最重的那一段默默放到自己肩上试重量。",
  GIVE: "你常常会先想别人能不能顺下来，晚一点才轮到自己到底愿不愿意让这么多。",
  SPNG: "房间里只要有人慌、有人愧疚、有人先乱，你的雷达就会比自己的感受更早上线。",
  GLOW: "你很容易先被那张温柔的未来海报点亮，再回头看现实有没有跟上。",
  FILM: "这件事一来，你脑内常会先响起旁白，像人生突然被切进了一个新章节。",
  NEST: "你最先浮出来的通常不是流程，而是那个家到时候像不像一个真的能住人的地方。",
  BASE: "你会先摸地基，再决定要不要往上搭，因为没有承重，浪漫只会更快塌。",
  LOAD: "身体和恢复那笔重账，在你这边往往比氛围更早出现，而且账目还很具体。",
  PLAN: "你很难只聊愿望，因为一聊到未来，执行表、维护表和接班表就会一起弹出。",
  SHAK: "这类话题一来，你不是没逻辑，是太多频道一起抢前排，谁都在催你先听它。",
  CLAS: "你刚想把事情排顺，新的变量又会插队进来，像整理桌面时桌子还在继续长东西。",
  FRAY: "你第一时间就能感觉到这不是一道题，而是身体、关系、自由和现实在同时拉扯。",
  NOIS: "别人的反应像单声道，你这里更像多轨并发，谁都不肯安静排队发言。",
};

const FIRST_REACTION_SCENE_LINES: Record<string, string> = {
  CTRL: "验孕结果一出来，你常先补信息和边界，再决定谁能进你的工作区。",
  SCAN: "你多半会先检查哪里可能出意外，而不是先急着把气氛维持得很好看。",
  GRID: "你会先把人手、班次和交接点过一遍，像系统上线前先看排班表。",
  DRAG: "你第一下更像是往后退半步，先护住自己那点还没被催成答案的空间。",
  FOGG: "你常先把话停在模糊区，免得一句说实以后，整个局面立刻变窄。",
  HUSH: "你的系统会先降噪，不让问题、情绪和别人的意见一起灌进来。",
  QCER: "你通常先看谁是真接招、谁只是姿态漂亮，承诺对你来说得先过验收。",
  LIST: "你很容易先把问题拆成几项、谁负责什么、什么时候回看，而不是先顺着情绪走。",
  TICK: "你第一眼常落在细活和收尾，因为真正累人的通常不是开场，而是长期补位。",
  WALL: "你会先感受身体和自主权有没有被动到，再决定这场对话还能不能继续。",
  SOLO: "你往往先确认自己会不会被整套角色吞掉，而不是先配合大家进入期待模式。",
  EXIT: "你会先找暂停键和回头路，确认这不是一扇只能往前推开的门。",
  HOLD: "你很容易先替未来那段最重的照护和恢复试重量，肩膀比脑子更早进入值班。",
  GIVE: "你经常先盘算怎么让所有人都舒服一点，自己的那份勉强会被往后放。",
  SPNG: "谁先慌、谁先崩、谁先内疚，你会比自己的立场更早接到这些信号。",
  GLOW: "你常常先被那种连接感和新生活的光亮吸住，现实问题会稍后才补进来。",
  FILM: "你会先把这件事接进自己的人生叙事里，像在看它会不会改写整章故事。",
  NEST: "你第一反应通常是去想那个家能不能把人安稳放进去，而不是先做冷计算。",
  BASE: "你常先看承重、资源和长期供给，确认这不是只靠热情撑着的项目。",
  LOAD: "你的注意力经常先落到恢复、疲惫和持续照护这笔身体账上。",
  PLAN: "你会先把愿望和执行并排摆开，看看这套系统到底有没有维护方案。",
  SHAK: "你第一下往往是被多路信号同时拽住，很难只盯一个点先反应。",
  CLAS: "你刚想先分个类，新的变量又冒出来，于是反应本身也被打成乱序。",
  FRAY: "你第一时间就能看见几条线同时打结，所以很难像别人那样只回答一个问题。",
  NOIS: "你会先听见一堆彼此打架的声音一起冲上来，很难马上挑出唯一主线。",
};

const SECTION_SCENE_LINES: Record<
  string,
  {
    mentalPreview: string;
    coreConcern: string;
    selfPressure: string;
    distortionTrigger: string;
    effectiveSupport: string;
  }
> = {
  CTRL: {
    mentalPreview: "你脑内先开的通常不是抒情频道，而是哪个节点会失手、谁会掉线、最后谁来总控。",
    coreConcern: "你表面像在卡一个决定，底下其实在防止整套系统又滚成无人负责的烂局。",
    selfPressure: "最要命的是别人一露出“你比较会搞定”的眼神，你就容易把总控权限默默接回来。",
    distortionTrigger: "你不是逮谁都想控场，而是最怕信息断线、角色浮空、最后全靠临场救火。",
    effectiveSupport: "你吃得下的支持从来不是口号，而是有人把节点、责任和交付一起摆明。",
  },
  SCAN: {
    mentalPreview: "你会一路预演到症状失控、计划变形、补救太晚，像提前把演习手册翻到最后一页。",
    coreConcern: "表面上你像想太多，底下真正卡住的是别在最脆的时候被现实从背后偷袭。",
    selfPressure: "一旦现场有人只会说“别怕”，你反而更容易把所有排雷工作都揽进自己脑子里。",
    distortionTrigger: "真正把你推歪的不是坏消息本身，而是模糊、侥幸和没人肯核实的气氛。",
    effectiveSupport: "最能让你放松的，不是大家一起正能量，而是有人陪你把雷点拆成可核实项。",
  },
  GRID: {
    mentalPreview: "你常会直接想到班表断档、照护脱节、资源没补上，像系统还没上线就先看到缺口。",
    coreConcern: "你嘴上像在追问细节，其实是在确认这不是一栋靠热情硬顶的空心房子。",
    selfPressure: "只要别人开始讲感受不讲执行，你就很容易把施工图、备份表和补位表一起接手。",
    distortionTrigger: "最让你失真的不是压力大，而是责任漂浮、流程悬空、每个人都只讲愿景。",
    effectiveSupport: "真正对你有效的，是有人愿意把分工图一起画完，不让你独自当总包。",
  },
  DRAG: {
    mentalPreview: "你会先演到一旦点头就回不了头，连后面每次被追问的窒息感都能提前感到。",
    coreConcern: "你看着像拖，其实是在守最后那点还能慢一点、想清楚一点的回旋空间。",
    selfPressure: "越怕被立刻逼答，你越可能把每个问题都往后挪，最后连自己都被堆积压住。",
    distortionTrigger: "真正让你变形的，是时间表和他人态度一起往前顶，像把缓冲区整块抽掉。",
    effectiveSupport: "对你最有帮助的不是催成熟，而是先给缓冲，再一起约定下一次落地节点。",
  },
  FOGG: {
    mentalPreview: "你会一路想到哪句话一旦说死、哪条路就会立刻关门，所以脑内总先保留雾面版本。",
    coreConcern: "外人以为你含糊，实际上你是在抵抗过早定性把复杂心情一次压扁。",
    selfPressure: "最累的是你一边想保留弹性，一边又得处理别人逼你给清晰答复的拉扯。",
    distortionTrigger: "你最容易失真时，往往正是别人非要把灰区掰成黑白、还要求你马上站队的时候。",
    effectiveSupport: "真正帮到你的，是有人承认现在可以先不定论，再慢慢把雾拆成几种状态。",
  },
  HUSH: {
    mentalPreview: "你的脑内会先演到再多一点输入就死机，所以预演本身常带着明显的降噪需求。",
    coreConcern: "表面像沉默，底下更像是在守住一个还没有被外界吵碎的思考空间。",
    selfPressure: "越怕失控，你越容易把感受压成静音，结果连求助也一起压薄了。",
    distortionTrigger: "真正让你切到自保模式的，通常是信息过密、情绪过吵、每个人都来抢话筒。",
    effectiveSupport: "对你有效的配合是轻声、短句、留暂停口，而不是一群人围上来帮忙分析。",
  },
  QCER: {
    mentalPreview: "你脑里会直接跳到谁口头答应、谁中途掉线、谁会把承诺拖成售后纠纷。",
    coreConcern: "你像在挑刺，其实是在核对这段关系到底有没有真实可兑现的承重能力。",
    selfPressure: "只要感觉交付要掉线，你就会把亲密关系开成质检现场，连自己也不放过。",
    distortionTrigger: "最容易把你逼到尖锐模式的，是漂亮话很多、责任却始终没有人签收。",
    effectiveSupport: "最有用的方式不是感动你，而是把能做、不能做、何时做一次讲明白。",
  },
  LIST: {
    mentalPreview: "你会先想到事情会不会越滚越散、待办会不会失控、最后谁来负责长期维护。",
    coreConcern: "别人觉得你太任务导向，你自己知道没清单的关系最容易在现实里漏风。",
    selfPressure: "一旦现场变散，你就会自动想把每个人、每件事、每个时间点都重新排进表里。",
    distortionTrigger: "真正让你炸毛的，不是工作量，而是讨论飘着、分工虚着、待办永远没人认领。",
    effectiveSupport: "别人越能陪你把事项摊平、时间线对齐，你越不用一个人拿清单救火。",
  },
  TICK: {
    mentalPreview: "你会直接演到夜里谁起、白天谁接、杂务谁补，像把长期收尾镜头先全部看完。",
    coreConcern: "你不像在泼冷水，更像在提醒大家最累的从来不是决定本身，而是长期补位。",
    selfPressure: "一旦没人主动认领收尾，你就会先按最累版本验收，顺手把压力提前背上。",
    distortionTrigger: "最让你过载的是那种“到时候再说”的轻飘口气，因为你知道最后会有人长期接盘。",
    effectiveSupport: "对你有用的不是宏大愿景，而是有人把那些最碎最累的日常细活先摊开来谈。",
  },
  WALL: {
    mentalPreview: "你脑里常先响起的是边界后退版剧情，像别人一步一步把你的决定权挤出门外。",
    coreConcern: "你看似冷下来，实际是在确认身体、时间和同意权会不会被亲密关系顺手接管。",
    selfPressure: "你为了不被越线，常会把门一下关得很死，连本来能谈的空间也一起锁住。",
    distortionTrigger: "真正逼你变硬的，通常不是分歧本身，而是擅自安排和价值绑架混着来。",
    effectiveSupport: "最能让你松一点的，是别人先问边界再提期待，而不是先替你决定什么算为你好。",
  },
  SOLO: {
    mentalPreview: "你脑内常会先演到角色越套越紧，最后那个原来的自己被挤成背景板。",
    coreConcern: "你表面像在躲亲密，其实更在意的是别把自我连续性赔给一整套默认剧本。",
    selfPressure: "最隐蔽的压力是你总想证明自己不用麻烦别人，结果什么都练成单兵作战。",
    distortionTrigger: "最容易让你退开的，是那种默认你该牺牲私人空间、顺势长成某种标准模板的气氛。",
    effectiveSupport: "对你真正有用的配合，是保留独处、节奏和表达权，不把靠近写成吞并。",
  },
  EXIT: {
    mentalPreview: "你的脑子会先把所有出口扫一遍，确认每一扇门是不是都还能推得开。",
    coreConcern: "别人以为你想跑，实际你是在检查选择权有没有还在桌上，而不是只剩单行道。",
    selfPressure: "越怕被困住，你越会把每场对话都过成撤离演练，连放松都像预备撤退。",
    distortionTrigger: "最让你失真的，是没有暂停权、没有缓冲、也没有重新谈判余地的推进方式。",
    effectiveSupport: "对你最关键的支持，是把暂停键和重谈的门保留下来，而不是一路把你往前推。",
  },
  HOLD: {
    mentalPreview: "你脑里会直接演到身体、恢复、喂养和情绪全压到自己这边，像提前值完整个长班。",
    coreConcern: "你看起来像太会扛，实际上是在防那个没人接手时只能自己顶上的老剧本。",
    selfPressure: "只要现场出现空位，你就会本能往前补，连还没发生的重活也先替它占坑。",
    distortionTrigger: "最容易让你垮的，是大家都夸你懂事，却没人真的把重量从你肩上搬走。",
    effectiveSupport: "对你有用的不是称赞可靠，而是别人真的把具体照护和恢复期负担分走一块。",
  },
  GIVE: {
    mentalPreview: "你会先演到如果自己再让一点、再懂事一点，也许全场就不会这么难看。",
    coreConcern: "外人会说你没主见，实际上你卡的是怎么顾全别人又别把自己整块让没。",
    selfPressure: "最难的是你总能先理解别人，结果很多本该替自己争的东西都被你主动吞回去。",
    distortionTrigger: "你最容易失真时，往往正遇上愧疚施压、家庭期待和伴侣先崩同时来敲门。",
    effectiveSupport: "真正帮到你的，是有人先问你最不想让掉什么，而不是默认你最会体谅。",
  },
  SPNG: {
    mentalPreview: "你常先演到如果自己不稳住，房间里别人的慌乱就会一层一层往外炸开。",
    coreConcern: "你不是没立场，而是太容易先接收到别人的波动，自己的声音反而被冲淡。",
    selfPressure: "只要现场有人先崩，你就会把自己的版本泡软，腾地方去接别人的情绪洪水。",
    distortionTrigger: "最让你过载的不是决定难，而是所有人的慌、愧疚和失望一起朝你涌过来。",
    effectiveSupport: "对你有效的配合，是别人把自己的情绪先收一收，不把你当默认缓冲垫。",
  },
  GLOW: {
    mentalPreview: "你会先演到那个更完整、更温柔的新生活版本，像未来感先把现实灯光打亮。",
    coreConcern: "你看着像被浪漫带跑，其实你卡的是怎么保住那份光，又不让它骗过现实。",
    selfPressure: "越被意义感点亮，你越可能默认这份心动已经足够替现实兜底。",
    distortionTrigger: "最容易让你翻车的，是温暖叙事一直加码，现实账本却始终没被摊开。",
    effectiveSupport: "对你最有用的不是泼冷水，而是有人陪你把浪漫和成本放在同一张桌上。",
  },
  FILM: {
    mentalPreview: "你会先演到命运转场、关系升级、人生章节改写，像预告片比执行表更早开播。",
    coreConcern: "别人觉得你戏多，你自己知道你真正卡的是别让故事感盖过日子本身。",
    selfPressure: "一旦剧情张力太好看，你就容易先爱上意义，再把执行成本往后挪。",
    distortionTrigger: "最容易把你带偏的，是象征意味很满、现实细节却一直不上镜的局面。",
    effectiveSupport: "真正帮到你的，是有人陪你谈意义，也有耐心把故事拆回一餐一饭的日子。",
  },
  NEST: {
    mentalPreview: "你会先演到那个家的气味、空间和关系感能不能把人安顿住，而不只是勉强运转。",
    coreConcern: "你不像在纠结形式，实际更在意的是这是不是一段真的可居住的日常。",
    selfPressure: "你很容易先忙着把氛围搭好，结果把承重结构和现实支撑拖到后面才看。",
    distortionTrigger: "最让你失真的，是画面很暖、关系很软，却没人回答这个家到底怎么撑。",
    effectiveSupport: "对你有效的支持，是有人能把家的感觉翻译成作息、分工和长期维护。",
  },
  BASE: {
    mentalPreview: "你常会直接演到承重、供给和长期稳定那一层，像先把地基图翻出来核算一遍。",
    coreConcern: "你不是故意扫兴，只是更早看见系统能不能活，远比场面好不好看重要。",
    selfPressure: "只要资源有点悬，你就会自动把标准拉到最稳版本，连弹性都一起收紧。",
    distortionTrigger: "真正让你紧起来的，是收入不稳、支援缺位、却还要求你只谈希望和爱。",
    effectiveSupport: "最能帮你放下防御的，是有人认真跟你算长期承重，而不是嫌你现实。",
  },
  LOAD: {
    mentalPreview: "你会先演到睡不够、接不上班、身体一直亏着的版本，像劳损明细先跳出来。",
    coreConcern: "你表面像总往重处想，实际上是在替那副身体提前争一口别被透支的气。",
    selfPressure: "一旦没人认真看待恢复和照护重量，你就会先把最坏版本在脑里全部扛一遍。",
    distortionTrigger: "最让你失真的，不是辛苦本身，而是身体已经很重了，周围人还在装轻松。",
    effectiveSupport: "对你有效的不是抽象心疼，而是把恢复期、接手人和轮班安排先落下来。",
  },
  PLAN: {
    mentalPreview: "你会先演到谁维护、谁补洞、谁接班，像还没开工就已经看到后期运维表。",
    coreConcern: "你表面像控制欲上线，实际上只是太清楚没有施工图的理想很容易烂尾。",
    selfPressure: "一旦大家只想聊愿景，你就会把整套执行和维护都提前打包进自己脑子里。",
    distortionTrigger: "真正让你失真的是理想很满、变量持续加码、却没人肯谈怎么长期维护。",
    effectiveSupport: "最能帮到你的，是有人愿意一起分包，而不是把靠谱两个字当外包申请单。",
  },
  SHAK: {
    mentalPreview: "你会一路演到每条分支都可能失控，像脑内同时开着好几版互相打架的未来。",
    coreConcern: "别人看到的是你难定，只有你自己知道是太多拉扯同时在抢主导权。",
    selfPressure: "最折磨人的不是没有答案，而是每个自己都像有道理，于是轮番上来辩论。",
    distortionTrigger: "你最容易被推歪的时候，通常正是新变量一层层叠上来、范围还越谈越大。",
    effectiveSupport: "对你最有用的是帮你一次只收窄一层，不要一口气把整锅问题全端上来。",
  },
  CLAS: {
    mentalPreview: "你会先演到优先级刚排好又被新警报打断，像脑内一直有人在不断刷新待处理列表。",
    coreConcern: "表面像你整理得不够快，实情更像秩序刚搭出来就又被新变量冲散。",
    selfPressure: "你越想尽快理清，就越容易把所有事一起拖进紧急轨，结果每件事都像火警。",
    distortionTrigger: "最容易让你明显失真的是输入不断、问题并发、每件事都说自己最急。",
    effectiveSupport: "对你有帮助的是先停新增噪音，再陪你把顺序排出来，而不是继续加题。",
  },
  FRAY: {
    mentalPreview: "你会先演到身体、关系、自由和现实彼此绊脚，像每根线都在扯另外几根线。",
    coreConcern: "别人嫌你钻，实际上你卡的是多种真相同时成立，没法粗暴归成一个答案。",
    selfPressure: "你很容易为了讲清每一根线，把自己解释到脱力，还怕别人嫌你复杂。",
    distortionTrigger: "最让你变形的是一句话硬盖全局，逼你把一团结拆成单选题来回答。",
    effectiveSupport: "真正对你有用的，是有人肯陪你一根一根拆，而不是大而化之地下定义。",
  },
  NOIS: {
    mentalPreview: "你会先演到每个版本都像有理，却又互相打架，像所有频道都想抢主旋律。",
    coreConcern: "别人觉得你没主线，实际上你是在噪声里努力找那条不被淹掉的真感受。",
    selfPressure: "最累的是你把每个信号都当真，结果脑内像一直开着一场没有主席的会议。",
    distortionTrigger: "最容易把你推过载的，不是单一坏消息，而是低匹配和高拉扯一起扩音。",
    effectiveSupport: "对你最有用的，是有人先帮你降噪，再陪你拉出最重要的那一条线。",
  },
};

export const EXTENDED_SECTION_TITLES = [
  "你第一反应通常先去哪",
  "你脑内最常开的预演剧情",
  "你真正在意的点是什么",
  "你最容易把自己逼到哪一步",
  "什么情况下你会明显失真",
  "别人怎么配合你更有用",
] as const;

const ARCHETYPE_CONTENT_SEEDS: Record<string, ArchetypeContentSeed> = {
  CTRL: {
    firstReaction: "先查变量、边界和信息缺口",
    mentalPreview: "流程失控、责任飘走、最后默认你兜底",
    coreConcern: "不是能不能做，是别又变成无人负责的局",
    selfPressure: "提前把自己顶成临时项目经理",
    distortionTrigger: "信息含糊、时间很赶、承诺空转",
    effectiveSupport: "给更新、给节点、给能执行的动作",
  },
  SCAN: {
    firstReaction: "先扫风险点和最坏版本",
    mentalPreview: "症状升级、计划失手、后果补刀",
    coreConcern: "不是唱衰，是别被现实从背后偷袭",
    selfPressure: "把所有坏可能都提前背进脑子",
    distortionTrigger: "身体异常、消息不清、别人只会安慰",
    effectiveSupport: "把风险拆成已知、未知和可核实",
  },
  GRID: {
    firstReaction: "先搭结构、排角色、看谁交接",
    mentalPreview: "分工断档、资源失衡、系统没人维护",
    coreConcern: "不是你扫兴，是你在找承重墙",
    selfPressure: "把全套施工图都先揽到自己脑内",
    distortionTrigger: "责任模糊、节奏乱套、人人只谈感受",
    effectiveSupport: "一起把分工、资源和备份方案说清",
  },
  DRAG: {
    firstReaction: "先争取喘口气，不让答案立刻落地",
    mentalPreview: "一旦点头就再也退不回来",
    coreConcern: "不是没想法，是你需要不被逼答的空间",
    selfPressure: "拖着拖着把每个变量都拖到涨价",
    distortionTrigger: "连续追问、当场站队、只给二选一",
    effectiveSupport: "给缓冲窗口，也给下一次对话节点",
  },
  FOGG: {
    firstReaction: "先把模糊区保住，不急着把话说死",
    mentalPreview: "哪句话一旦坐实，哪条退路就会关掉",
    coreConcern: "不是你含糊，是太早定性会压扁别的可能",
    selfPressure: "反复拨散焦点，连自己也一起看不清",
    distortionTrigger: "黑白式提问、情绪催促、被迫表态",
    effectiveSupport: "把雾拆成几种状态，不替你抢定义",
  },
  HUSH: {
    firstReaction: "先降输入，避免系统继续过载",
    mentalPreview: "再多刺激一点就要直接死机",
    coreConcern: "不是不在乎，是你想保住还能思考的自己",
    selfPressure: "把感受压到最低音量才敢继续处理",
    distortionTrigger: "信息太密、情绪太吵、围攻式沟通",
    effectiveSupport: "短句、低压、可暂停的沟通节奏",
  },
  QCER: {
    firstReaction: "先验承诺，不先吃口号",
    mentalPreview: "谁嘴上站队、谁落地掉线",
    coreConcern: "不是苛刻，是你在查兑现率",
    selfPressure: "把亲密关系也开成质检现场",
    distortionTrigger: "大话很多、细节很少、责任没人认领",
    effectiveSupport: "明确能做什么、何时做、做不到什么",
  },
  LIST: {
    firstReaction: "先列事项、节奏和责任人",
    mentalPreview: "长期运营会不会变成无人维护的烂尾楼",
    coreConcern: "不是你不浪漫，是任务比语气更诚实",
    selfPressure: "把每段关系都做成可复盘项目",
    distortionTrigger: "讨论很散、分工很虚、任务没人接",
    effectiveSupport: "一起对齐待办、时间线和分工表",
  },
  TICK: {
    firstReaction: "先看谁落地、谁收尾、谁补位",
    mentalPreview: "重复杂务、睡眠赤字、长期接盘",
    coreConcern: "不是你悲观，是你记得收尾有多累",
    selfPressure: "还没发生就按最累版本先验收",
    distortionTrigger: "到时候再说、期限漂移、细节空白",
    effectiveSupport: "把日常运转细节补齐，再谈愿景",
  },
  WALL: {
    firstReaction: "先看身体、时间和身份有没有被越线",
    mentalPreview: "别人默认调用你，边界一路后退",
    coreConcern: "不是你冷，是你在守自主权和同意权",
    selfPressure: "为了保线把门一口气焊太死",
    distortionTrigger: "擅自安排、价值绑架、亲密式越界",
    effectiveSupport: "先问边界，再提期待和建议",
  },
  SOLO: {
    firstReaction: "先确认原来的自己还能不能活着穿过去",
    mentalPreview: "角色一上身，自己就慢慢断线",
    coreConcern: "不是拒绝亲密，是别把自我连续性赔进去",
    selfPressure: "把所有需求都练成我自己来",
    distortionTrigger: "母职模板太重、私人空间被默认牺牲",
    effectiveSupport: "尊重独处、节奏和个人表达权",
  },
  EXIT: {
    firstReaction: "先找出口、暂停键和可逆空间",
    mentalPreview: "一步走错就被套进无法调头的轨道",
    coreConcern: "不是逃，是你需要选择权还在",
    selfPressure: "把每场讨论都过成撤离演练",
    distortionTrigger: "没有暂停权、没有退路、没有缓冲",
    effectiveSupport: "保留节奏权、暂停权和重新商量的门",
  },
  HOLD: {
    firstReaction: "先把最重那一段往自己肩上预放",
    mentalPreview: "身体、关系、照护最后都压到你这边",
    coreConcern: "不是伟大，是没人接的时候你最先会顶上",
    selfPressure: "提前预支体力、情绪和责任额度",
    distortionTrigger: "别人夸你懂事却不真接手",
    effectiveSupport: "别夸可靠，直接分担具体负荷",
  },
  GIVE: {
    firstReaction: "先理解别人，再想自己让到哪",
    mentalPreview: "只要你多配合一点，全场就能顺下来",
    coreConcern: "不是你没立场，是体谅感总抢先发言",
    selfPressure: "把委屈提前翻译成懂事和体面",
    distortionTrigger: "愧疚施压、家庭期待、伴侣先崩",
    effectiveSupport: "直接问你最不想让的是什么",
  },
  SPNG: {
    firstReaction: "先接住全场情绪，再轮到自己",
    mentalPreview: "如果你不稳住，别人就会更乱",
    coreConcern: "不是没主见，是情绪传染太容易穿过你",
    selfPressure: "把自己的版本泡软，先吸别人的波动",
    distortionTrigger: "房间里有人慌、失望、内疚或崩溃",
    effectiveSupport: "别把情绪整桶倒给你代处理",
  },
  GLOW: {
    firstReaction: "先被意义感、连接感和温柔画面点亮",
    mentalPreview: "人生会不会突然长出更完整的一章",
    coreConcern: "不是你天真，是那张未来海报太有说服力",
    selfPressure: "把光感误当成现实已经靠谱",
    distortionTrigger: "温暖叙事很满、现实账目很空",
    effectiveSupport: "别嘲笑浪漫，把成本也摆到同一桌",
  },
  FILM: {
    firstReaction: "先把这件事接进自己的人生叙事",
    mentalPreview: "这会不会成为命运转场和主题升级",
    coreConcern: "不是戏多，是你真的会先看章节感",
    selfPressure: "爱上剧情张力，晚一点才看执行成本",
    distortionTrigger: "象征意味太强、现实细节太少",
    effectiveSupport: "陪你谈意义，也帮你拆回到日子",
  },
  NEST: {
    firstReaction: "先想那个家像不像能住人的地方",
    mentalPreview: "气味、空间、关系感能不能把人安放住",
    coreConcern: "不是形式感，是你在找可居住的日常",
    selfPressure: "把氛围搭满，却迟迟不碰承重结构",
    distortionTrigger: "浪漫画面很多、分工支撑很少",
    effectiveSupport: "把家的感觉翻译成日程和分工",
  },
  BASE: {
    firstReaction: "先摸地基，再看理想会不会塌",
    mentalPreview: "长期承重、现金流和照护供给够不够",
    coreConcern: "不是你扫兴，是你在看系统能不能活",
    selfPressure: "凡事先按最稳版本去估，弹性被压低",
    distortionTrigger: "收入不稳、支援缺位、承重没人算",
    effectiveSupport: "认真一起算资源和长期承重",
  },
  LOAD: {
    firstReaction: "先感到身体、恢复和疲惫那笔重账",
    mentalPreview: "睡不够、接不了班、长期劳损怎么收场",
    coreConcern: "不是爱想重，是重量真的会先落在身体上",
    selfPressure: "还没开始就先把劳损预演了很多遍",
    distortionTrigger: "恢复期未知、补位不明、持续照护逼近",
    effectiveSupport: "提前谈好接手、补位和恢复期安排",
  },
  PLAN: {
    firstReaction: "先把愿望和执行一起摆上桌",
    mentalPreview: "谁来维护系统、谁来补漏洞、谁来接班",
    coreConcern: "不是控制欲，是你知道没施工图会烂尾",
    selfPressure: "把整套系统都先扛到脑子里总包",
    distortionTrigger: "只谈理想、不谈维护、变量持续加码",
    effectiveSupport: "一起分包，而不是把靠谱全外包给你",
  },
  SHAK: {
    firstReaction: "先感到好多频道一起响，根本静不下来",
    mentalPreview: "每一条分支都能导向新的失控版本",
    coreConcern: "不是矫情，是系统同时收到太多拉扯",
    selfPressure: "和每一个自己都打一轮内部辩论",
    distortionTrigger: "新变量叠加、话题切太快、范围太大",
    effectiveSupport: "一次只收窄一层，不要整锅一起谈",
  },
  CLAS: {
    firstReaction: "先想分类整理，下一秒又被新变量打断",
    mentalPreview: "优先级刚排好，新的警报又同时亮起",
    coreConcern: "不是没整理，是秩序刚搭就被冲垮",
    selfPressure: "把所有事情都拖进紧急通道处理",
    distortionTrigger: "输入不断、问题并发、每件事都要现在",
    effectiveSupport: "先停新增噪音，再帮你排顺序",
  },
  FRAY: {
    firstReaction: "先发现不是一道题，而是几条线同时打结",
    mentalPreview: "身体、关系、自由和现实互相牵连失手",
    coreConcern: "不是钻牛角尖，是多种真相一起成立",
    selfPressure: "为了讲清楚每根线，把自己解释到脱力",
    distortionTrigger: "一句话硬盖全局、强行只准选一条线",
    effectiveSupport: "陪你一根一根拆，不用大而化之",
  },
  NOIS: {
    firstReaction: "先听见好多声音同时抢前排",
    mentalPreview: "每个版本都像有理，互相又彼此打架",
    coreConcern: "不是没答案，是噪声太大听不清主线",
    selfPressure: "把每个信号都当最终结论一起背",
    distortionTrigger: "低匹配、高拉扯、话题一扩就过载",
    effectiveSupport: "先降噪，再拉出第一条最重要的线",
  },
};

function getTopDimensionLabels(vector: ScoreVector, count: number): string {
  return [...DIMENSION_IDS]
    .sort((left, right) => vector[right] - vector[left])
    .slice(0, count)
    .map((dimensionId) => getDimension(dimensionId).label)
    .join("、");
}

function buildArchetypeIntro(
  spec: Pick<ArchetypeDefinition, "code" | "intro" | "reaction" | "failureMode" | "needFromOthers">,
  prototype: ScoreVector,
): string {
  const seed = ARCHETYPE_CONTENT_SEEDS[spec.code];
  const salientDimensions = spec.code === "NOIS" ? "多条维度" : getTopDimensionLabels(prototype, 3);
  const opener = INTRO_OPENERS[spec.code] ?? `${spec.code} 这型人的系统有自己很固执的优先级。`;
  const sceneLine = INTRO_SCENE_LINES[spec.code] ?? "这类消息一来，你的系统会先走自己那条老路。";

  return `${opener}${spec.intro} ${sceneLine}${spec.reaction} ${salientDimensions}这些维度一抬头，就会把“${seed.firstReaction}”这套动作直接推到前台。你确实很会提前看见关键，但也容易在${seed.distortionTrigger}这类局面里被拖向${seed.selfPressure}，所以有效的配合通常是${spec.needFromOthers}`;
}

function buildExtendedSections(
  spec: Pick<ArchetypeDefinition, "code" | "reaction" | "failureMode" | "needFromOthers">,
  prototype: ScoreVector,
  seed: ArchetypeContentSeed,
): readonly ArchetypeSection[] {
  const focusDimensions = getTopDimensionLabels(prototype, 2);
  const pressureDimensions = getTopDimensionLabels(prototype, 3);
  const firstReactionScene = FIRST_REACTION_SCENE_LINES[spec.code] ?? "这类消息一落地，你通常会先进入自己最熟的反应轨道。";
  const sectionScene = SECTION_SCENE_LINES[spec.code] ?? {
    mentalPreview: "你的脑内会先沿着自己最熟的那条风险或意义链往下演。",
    coreConcern: "你表面上的纠结，底下通常还有一层更难说出口的真实卡点。",
    selfPressure: "一旦局面有点乱，你就很容易把原本该共担的东西先揽到自己身上。",
    distortionTrigger: "真正把你推歪的，往往不是单一事件，而是几种压力同时叠上来。",
    effectiveSupport: "真正能帮到你的，不是空话，而是别人真的按你吃得下的方式来配合。",
  };

  return [
    {
      title: EXTENDED_SECTION_TITLES[0],
      body: `${seed.firstReaction}。${firstReactionScene}“${seed.coreConcern}”这道门，通常会被你拿${focusDimensions}先顶住；对你来说，这不叫反应快，更像“${seed.firstReaction}”先一步出手，去挡“${seed.coreConcern}”这口风。`,
    },
    {
      title: EXTENDED_SECTION_TITLES[1],
      body: `${seed.mentalPreview}。${sectionScene.mentalPreview}“${seed.selfPressure}”那一幕之所以老在后面等着你，不是因为你爱脑补，而是${pressureDimensions}这组高敏开关知道，后面排队的常常就是“${seed.mentalPreview}”这版结局。`,
    },
    {
      title: EXTENDED_SECTION_TITLES[2],
      body: `${seed.coreConcern}。${sectionScene.coreConcern}“${seed.distortionTrigger}”一来，你真正先护住的往往不是场面，而是“${seed.coreConcern}”这块地方；你怕的不是那道题本身，而是它又把你拖回“${seed.distortionTrigger}”这条老路。`,
    },
    {
      title: EXTENDED_SECTION_TITLES[3],
      body: `${seed.selfPressure}。${sectionScene.selfPressure}“${seed.selfPressure}”这件事对你来说，常常不是选择题，而像一种会自动续费的老动作，绕一圈最后又回到“${seed.selfPressure}”这条轨道上。`,
    },
    {
      title: EXTENDED_SECTION_TITLES[4],
      body: `${seed.distortionTrigger}。${sectionScene.distortionTrigger}“${seed.selfPressure}”那种状态之所以会逼近，往往不是你故意难搞，而是${pressureDimensions}这组开关已经一起冲红，系统只好先开出“${seed.distortionTrigger}”这档自保程序。`,
    },
    {
      title: EXTENDED_SECTION_TITLES[5],
      body: `${seed.effectiveSupport}。${sectionScene.effectiveSupport}只要“${seed.effectiveSupport}”这件事真的落地，你通常就更愿意把防御撤下一格，也更容易把那句关于“${seed.coreConcern}”的真心话说出来。`,
    },
  ];
}

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

export const ARCHETYPES: readonly ArchetypeDefinition[] = ARCHETYPE_SPECS.map((spec) => {
  const prototype = tweak(FAMILY_BASELINES[spec.familyId], spec.patch);

  return {
    code: spec.code,
    familyId: spec.familyId,
    name: spec.name,
    punchline: spec.punchline,
    intro: buildArchetypeIntro(spec, prototype),
    sections: STATIC_ARCHETYPE_SECTIONS[spec.code],
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
    prototype,
  };
});

const FALLBACK_PROTOTYPE = vector({
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
});

export const FALLBACK_ARCHETYPE: ArchetypeDefinition = {
  code: "NOIS",
  familyId: "fallback",
  name: "噪点综合体",
  punchline: "不是你没类型，是你脑内频道同时开麦。",
  intro: buildArchetypeIntro(
    {
      code: "NOIS",
      intro: "你不是没有模式，而是太多模式同时来抢方向盘，谁都不肯安静当背景音。",
      reaction:
        "你不是没有模式，而是好几种模式同时抢前排。怀孕和养育想象在你这里像多路输入并发播放，谁都不像背景音。",
      failureMode: "最容易翻车的地方，是你把每一种声音都当成最终结论，最后整个人卡在过载状态里。",
      needFromOthers: "最需要的不是替你定性，而是帮你缩小范围、降低噪声、把最重要的一条线先拉出来。",
    },
    FALLBACK_PROTOTYPE,
  ),
  sections: STATIC_ARCHETYPE_SECTIONS.NOIS,
  reaction: "你不是没有模式，而是好几种模式同时抢前排。怀孕和养育想象在你这里像多路输入并发播放，谁都不像背景音。",
  failureMode: "最容易翻车的地方，是你把每一种声音都当成最终结论，最后整个人卡在过载状态里。",
  needFromOthers: "最需要的不是替你定性，而是帮你缩小范围、降低噪声、把最重要的一条线先拉出来。",
  artwork: {
    posterPath: "/archetypes/NOIS.png",
    alt: "NOIS 噪点综合体角色海报",
    status: "final",
  },
  prototype: FALLBACK_PROTOTYPE,
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

const ARCHETYPE_DESCRIPTION_LEADS: Record<string, string> = {
  CTRL: "CTRL 这类人像在脑内常驻一块总控台，别人刚开始慌，你已经在分配变量、检索风险、尝试把局面重新拉回可解释区间。你不是为了显得厉害才要掌控，而是真的很难容忍一件会改写生活走向的事，在没有边界、没有顺序、没有备用方案的情况下直接压到眼前。",
  SCAN: "SCAN 像那种永远先做环境扫描的人，气氛稍微一变、承诺稍微一虚、未来稍微一抖，你的大脑就已经把周围的入口、出口、隐患和暗雷先摸了一圈。你看上去可能只是谨慎，但实际上你是在给自己争取一种最低限度的安全感：至少别让我在毫无预警时被现实突袭。",
  GRID: "GRID 的厉害之处不在于死板，而在于你会本能地给混乱搭骨架。很多人碰上重大决定先谈情绪，你却会先想结构、顺序、依赖关系和执行成本，像在一张还没画完的蓝图上找承重墙。你并不迷信规则本身，你只是知道没有结构的热情，通常会把后续生活砸得更难收拾。",
  DRAG: "DRAG 不是真的懒，也不是单纯拖延，你更像把自己挂在决策边缘反复试重量的人。别人以为你迟迟不表态，是因为没想清楚；其实你往往已经想了很多，只是每种选择都像带着后劲，你知道一旦点头就不是一句“再看看”能收回。于是你宁可磨，也不肯轻易被推进下一格。",
  FOGG: "FOGG 的日常体验像在起雾的清晨开车，前面不是完全没有路，而是路在、标志在、别人催促也在，可你总想再等十米视野变清楚一点。你不是没有判断力，而是非常受不了在看不清时被要求做出像永远正确的样子。很多人把这种犹疑当成软弱，只有你知道那其实是对后果过度诚实。",
  HUSH: "HUSH 表面安静，内里却不是空白，而是把各种声音压到极低音量后继续处理。你往往不会第一时间把震动抛出来，也不爱让自己在众目睽睽之下情绪决堤，所以外人容易误判你“没那么在意”。实际上你只是先把门关上，再认真听每一个念头说完，哪怕那会把你自己也听得很累。",
  QCER: "QCER 天生带一点质检员气质，别人说“应该没问题吧”，你会下意识追问证据、细节、长期兑现率和隐藏条款。你不是爱泼冷水，而是见过太多口头乐观最后变成现实返工，所以你宁可在前面多挑几处毛病，也不愿意后面一个人补整栋楼的裂缝。你对关系的认真，常常就藏在这种挑剔里。",
  LIST: "LIST 像随身带着一套任务管理系统的人，脑子里不是没有情绪，而是情绪一上来就会自动长成清单、步骤、优先级和待确认项。你之所以显得镇定，不一定因为你不慌，而是因为你知道一旦完全交给感觉，事情会在脑内越滚越大。把复杂问题拆小，是你保护自己不被压垮的实用技术。",
  TICK: "TICK 的敏感点很特别，你常常不是被惊天大事一下子击倒，而是被那些持续跳动、不断逼近、每隔一阵就提醒你“别忘了”的时钟感磨到坐立难安。你的脑子对期限、节奏和未完成事项有很强的感应器，所以看似普通的一步，对你来说常常附带整条时间线的压迫感。",
  WALL: "WALL 的边界感像一堵白天看着礼貌、晚上摸上去很结实的墙。你不是天生拒人千里，而是对“生活被整体改写”这件事反应很快，尤其当别人默认你应该自然接住某个角色时，你会本能地往后撤半步，确认自己有没有被直接推进别人的剧本。那种撤，不是无情，是自保机制启动得比多数人早。",
  SOLO: "SOLO 的核心不是孤僻，而是你默认很多账最后得自己扛，所以凡事都会提前按“无人兜底版”来估算。别人听见一句鼓励可能会先被安慰到，你却会先想谁来执行、谁能持续、谁会中途掉线。你并不是不相信爱与支持，你只是太清楚支持这件事，有时比表态更稀缺，也更容易半路蒸发。",
  EXIT: "EXIT 很像总能先看到出口的人，这既是天赋，也是负担。你会比周围人更早意识到某件事如果继续发展，自己还能不能撤、怎么撤、撤了以后损失到哪一层。于是你对“先走一步看看”这种建议天然警惕，因为你知道有些门一旦进去，再转身就不只是尴尬，而是整套生活成本一起上涨。",
  HOLD: "HOLD 的力量在于能扛，但麻烦也恰恰在于太能扛。你会本能地把重要关系、重大决定和复杂情绪先稳住，不想让局面立刻散掉，也不愿意自己成为那个率先放手的人。可你这种稳定并不轻松，很多时候像双手抱着快滑下来的东西站很久，表面没摔，手臂却早就酸到没人看见。",
  GIVE: "GIVE 最容易被误读成“天生愿意付出”，但你的驱动力往往没那么浪漫，更像一种自动上岗的责任感。只要你感到别人需要、局面需要、关系需要，身体就会先一步往前站，像没等会议开始就已经把杂事揽进自己怀里。你不是不知道累，而是经常在意识到累之前，事情已经被你做完一半了。",
  SPNG: "SPNG 像会吸收现场气压的人，别人一句话里的犹豫、一个眼神里的撤退、一次沉默里的负担感，你都很容易接住，甚至替对方继续放大。你的共感不是摆设，它会真实影响你怎么理解自己、怎么判断关系、怎么决定该不该继续往前。问题是，吸得太快时，也容易把别人的波动误当成自己的结论。",
  GLOW: "GLOW 的问题从来不是不现实，而是你太容易看见意义一旦成立之后，那种整个人被点亮的样子。你对希望、连接、身份变化和未来画面都有很强的点火能力，所以某些别人还在犹豫的瞬间，你已经能看到完整的光源和氛围。这种能力很好用，但也会让你对“可能成真”的故事天然更舍不得放手。",
  FILM: "FILM 像脑内自带预告片剪辑系统的人，很多人先遇到事实再慢慢理解意义，你常常反过来，先从一个选择里嗅到叙事、情绪线和人生章节感，再回头判断现实能不能接住它。你不是故意戏剧化，而是特别容易把当下放进更长的生命镜头里看，所以有些别人觉得只是步骤的事，在你这里会直接升级成主题。",
  NEST: "NEST 的反应方式很像先看环境能不能住人，再决定自己敢不敢把心放下。你对稳定感、照料质量、生活节奏和空间氛围有很强的体感，不是讲几句漂亮话就能替代。别人以为你在意的是形式，你其实在意的是一个人和一段关系能不能提供真正可居住的日常，而不是临时热情堆出来的样板间。",
  BASE: "BASE 的思路总带着地基意识，你不是喜欢唱反调，而是总能先想到“以后靠什么长期支撑”。很多人讨论重大选择时容易先冲到情绪和价值观，你却会下意识去摸承重、算库存、看供给是否稳定。你关心的不是有没有漂亮口号，而是这些口号掉进普通日子里，会不会立刻碎成一地待处理的杂务。",
  LOAD: "LOAD 对负担的感知非常具体，别人听见“以后再说”，你脑子里却已经出现时间、金钱、睡眠、关系维护和身体消耗的明细表。你不是悲观，而是对成本有一种很少出错的嗅觉，能比多数人更快看见那份“表面一句话，背后十件事”的连锁反应。所以你谨慎时，往往不是想太多，而是看得太全。",
  PLAN: "PLAN 天生爱给未来排版，不一定写在纸上，但脑里一定已经有目录、节点、缓冲期和应急方案。你对重大选择的焦虑，常常不是来自变化本身，而是来自变化打断了原本已经排好序的路径。别人觉得你太爱安排，其实你只是知道：当变量够大时，提前整理秩序不是控制欲，是让自己还能继续走下去的办法。",
  SHAK: "SHAK 的感受像站在刚停稳但还在轻微晃动的桥上，别人说“已经没事了”，你的身体和神经却还没完全接受这个结论。你对不确定、失控和突发变化的余震非常敏感，哪怕理智已经理解，内在系统也可能继续拉响警报。于是你看起来像反应过度，实际只是恢复速度诚实地慢于场面上那句“别想太多”。",
  CLAS: "CLAS 不是冷冰冰地分析，而是会本能先给混乱分类、命名、归档，再决定哪里值得投入情绪。你对概念、模式和规律有天然偏好，所以一件让别人只觉得“乱”的事，到你这里常常会被拆成几组不同性质的问题。这样的你不容易被表面带跑，但也容易因为太想先看清结构，而错过自己情绪刚冒头时最真实的重量。",
  FRAY: "FRAY 的状态像一根已经被多头拉扯过的线，不是一下断，而是先起毛、发散、四处挂住别的东西。你往往同时顾及太多方向，既听得见外界期待，也感受得到内在抗拒，还会把现实成本和关系后果一起背上肩。久而久之，你不是不会判断，而是每种判断都缠着别的线头，光解结就足够消耗。",
  NOIS: "NOIS 并不代表你没有类型，而是此刻你像同时接入了太多频道：每一个频道都在说得有道理，每一种担心都能成立，每一种希望也都不算凭空。你不是故意复杂化，而是真的被多股信号同时拉扯，所以很难像别人期待的那样，干脆地归入某一个单线条答案。你的难，不在于没感觉，而在于感觉太多。",
};

export function getArchetypeDescription(archetype: ArchetypeDefinition): string {
  const lead =
    ARCHETYPE_DESCRIPTION_LEADS[archetype.code] ?? "你不是没有逻辑，你只是暂时还没把这套逻辑翻译成所有人都能立刻听懂的话。";

  return `${lead}${archetype.intro} 你真正容易赢的地方，往往不是更大声、更果断，而是比别人更早察觉哪一个点一旦被忽略，后面整串生活都会跟着歪掉。代价也很明确：${archetype.failureMode} 所以真正对你有帮助的配合，不是站在旁边催你快一点、想开一点、浪漫一点，而是${archetype.needFromOthers}`;
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
