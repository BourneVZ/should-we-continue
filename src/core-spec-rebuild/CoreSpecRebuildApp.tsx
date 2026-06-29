import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ALL_ARCHETYPES,
  DIMENSIONS,
  MODELS,
  PROJECT_BRAND,
  QUESTIONS,
  QUESTION_SCALE_OPTIONS,
  getArchetype,
  getArchetypeDescription,
  getFamily,
  type ArchetypeDefinition,
  type FingerprintLevel,
  type QuestionId,
  type ScoreVector,
} from "./model";
import {
  buildScoreVector,
  createEmptyAnswers,
  getAnsweredCount,
  getFingerprintLevel,
  getFirstUnansweredIndex,
  getWhyTags,
  isQuizComplete,
  matchArchetype,
  type MatchEntry,
} from "./scoring";
import { clearPersistedQuizState, loadPersistedQuizState, savePersistedQuizState } from "./storage";

type View = "home" | "quiz" | "result" | "catalog" | "detail";
type DetailReturnView = "home" | "result" | "catalog";
type HashRoute = { view: View; code?: string };

const HOME_FEATURED_CODE = "CTRL";

const HOME_MODELS = [
  { title: "决策模型", dims: "核实欲 · 决断迟滞 · 掌控补偿" },
  { title: "身体模型", dims: "侵入敏感 · 风险预演 · 恢复想象" },
  { title: "身份模型", dims: "自我连续 · 母职投射 · 节奏保卫" },
  { title: "关系模型", dims: "确认需求 · 陪伴黏连 · 承诺验收" },
  { title: "现实模型", dims: "秩序焦虑 · 自由敏感 · 照护承重" },
] as const;

const HOME_STEPS = [
  { index: "1", title: "答完 30 题", body: "约 3-5 分钟，全部使用 5 分量表；草稿只保存在当前浏览器。" },
  { index: "2", title: "形成 15 维向量", body: "每一维由 2 题汇总，不做粗暴贴标签，先保留连续变化。" },
  { index: "3", title: "匹配 24 个标准类型", body: "系统会把你的反应模式和 24 个原型逐一比对，找最近的那一个。" },
  { index: "4", title: "必要时触发 NOIS", body: "如果结果低匹配又高矛盾，就不硬塞标准类型，直接给你噪点综合体。" },
] as const;

const LEVEL_BADGE_META: Record<FingerprintLevel, { text: string; className: string }> = {
  low: { text: "L", className: "bg-[#dfeeea] text-[#246258]" },
  medium: { text: "M", className: "bg-[#ece7df] text-[#74695f]" },
  high: { text: "H", className: "bg-[#f6d9cb] text-[#9b4b35]" },
};

function parseHashRoute(): HashRoute {
  if (typeof window === "undefined") {
    return { view: "home" };
  }

  const hash = window.location.hash.replace(/^#/, "");
  const parts = hash.split("/").filter(Boolean);

  if (parts.length === 0) {
    return { view: "home" };
  }

  if (parts[0] === "quiz") {
    return { view: "quiz" };
  }

  if (parts[0] === "result") {
    return { view: "result" };
  }

  if (parts[0] === "types" && parts[1]) {
    return { view: "detail", code: decodeURIComponent(parts[1]) };
  }

  if (parts[0] === "types") {
    return { view: "catalog" };
  }

  return { view: "home" };
}

function buildHashRoute(view: View, detailCode: string): string {
  switch (view) {
    case "quiz":
      return "#/quiz";
    case "result":
      return "#/result";
    case "catalog":
      return "#/types";
    case "detail":
      return `#/types/${encodeURIComponent(detailCode)}`;
    default:
      return "#/";
  }
}

export function getResumeQuestionIndex(answerMap: Record<string, number | null>, currentQuestionIndex: number): number {
  const hasAnyAnswer = Object.values(answerMap).some((value) => value !== null);

  if (!hasAnyAnswer) {
    return Math.max(0, Math.min(currentQuestionIndex, QUESTIONS.length - 1));
  }

  return getFirstUnansweredIndex(answerMap as Record<QuestionId, number | null>);
}

function ArchetypeThumbnail(props: {
  archetype: ArchetypeDefinition;
  size?: "sm" | "md";
  className?: string;
  srcOverride?: string;
}) {
  const family = getFamily(props.archetype.familyId);
  const sizeClass = props.size === "sm" ? "h-14 w-14 rounded-[16px]" : "h-24 w-24 rounded-[22px]";

  if (props.archetype.artwork?.status === "final") {
    return (
      <div className={`shrink-0 overflow-hidden border border-black/5 bg-[#fbf7f0] p-1 ${sizeClass} ${props.className ?? ""}`}>
        <img
          src={props.srcOverride ?? props.archetype.artwork.posterPath}
          alt={props.archetype.artwork.alt}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`shrink-0 overflow-hidden border border-black/5 shadow-[0_10px_24px_rgba(43,37,31,0.08)] ${sizeClass} ${props.className ?? ""}`}
      style={{ backgroundImage: `linear-gradient(160deg, ${family.accentFrom}, ${family.accentTo})` }}
      aria-hidden="true"
    >
      <div className="flex h-full items-end justify-start bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(26,19,15,0.2)_100%)] p-2">
        <span className="rounded-full bg-white/18 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-white backdrop-blur-sm">
          {props.archetype.code}
        </span>
      </div>
    </div>
  );
}

function HomePreviewChip(props: { archetype: ArchetypeDefinition; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="flex w-full items-center gap-3 rounded-[24px] border border-[#ded8ce] bg-white px-3 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#cdbbaa] hover:bg-[#fffdfa]"
    >
      <ArchetypeThumbnail archetype={props.archetype} size="sm" srcOverride={`/archetypes/thumbs/${props.archetype.code}.png`} />
      <div className="min-w-0">
        <p className="text-sm font-semibold tracking-[0.12em] text-[#3d5f5a]">{props.archetype.code}</p>
        <p className="truncate text-base font-semibold text-[#4f443d]">{props.archetype.name}</p>
      </div>
    </button>
  );
}

function ArchetypePoster(props: { archetype: ArchetypeDefinition; compact?: boolean }) {
  const family = getFamily(props.archetype.familyId);
  const compact = props.compact ?? false;

  if (props.archetype.artwork?.status === "final") {
    return (
      <div className="overflow-hidden rounded-[28px] border border-black/5 bg-[#fbf7f0] p-2 shadow-[0_16px_40px_rgba(43,37,31,0.12)]">
        <img
          src={props.archetype.artwork.posterPath}
          alt={props.archetype.artwork.alt}
          className={`block w-full object-contain ${compact ? "aspect-[4/5]" : "aspect-[5/6]"}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-[28px] border border-black/5 shadow-[0_16px_40px_rgba(43,37,31,0.12)] ${compact ? "aspect-[4/5]" : "aspect-[5/6]"}`}
      style={{ backgroundImage: `linear-gradient(160deg, ${family.accentFrom}, ${family.accentTo})` }}
    >
      <div className="flex h-full items-end bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(26,19,15,0.24)_100%)] p-5">
        <div className="w-full rounded-[22px] border border-white/25 bg-white/10 p-4 text-white backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/78">{props.archetype.code}</p>
          <h3 className={`mt-2 font-serif font-semibold ${compact ? "text-2xl" : "text-3xl"}`}>{props.archetype.name}</h3>
          <p className={`mt-3 leading-7 text-white/88 ${compact ? "text-sm" : "text-base"}`}>{props.archetype.punchline}</p>
        </div>
      </div>
    </div>
  );
}

function HomeView(props: {
  hasDraft: boolean;
  canOpenResult: boolean;
  saveMessage: string | null;
  onStart: () => void;
  onOpenResult: () => void;
  onOpenCatalog: () => void;
  onOpenDetail: (code: string) => void;
  onReset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-5 py-8 md:px-8">
      <section className="w-full rounded-[40px] border border-black/5 bg-white px-6 py-10 shadow-[0_30px_100px_rgba(43,37,31,0.1)] md:px-10 md:py-12">
        <div className="flex justify-center">
          <span className="inline-flex items-center rounded-full border border-[#dce6dd] bg-[#f5faf7] px-4 py-2 text-sm font-semibold text-[#68806c]">
            15 个维度 · 5 大模型 · 25 种结果
          </span>
        </div>

        <div className="mx-auto mt-8 max-w-4xl text-center">
          <h1 className="font-serif text-4xl font-semibold leading-tight text-[#2f2118] md:text-6xl">
            {PROJECT_BRAND.title} {"\u2014"} 孕妈类型测试
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#64574d] md:text-lg">
            怀孕这件事一来，你会先控场、先拖延，还是先把自己演成一个很懂事的人？
            这不是医学建议，不替你决定去留。它只做一件事：把你最容易进入的反应模式拎出来。
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-md text-center">
          <button
            type="button"
            onClick={props.onStart}
            className="rounded-full bg-[#5f755b] px-8 py-4 text-base font-semibold text-white shadow-[0_18px_36px_rgba(95,117,91,0.22)] transition hover:-translate-y-0.5 hover:bg-[#6d8568]"
          >
            {props.hasDraft ? "继续测试" : "开始测试"}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[#7a6c62]">
          {props.canOpenResult ? (
            <button type="button" onClick={props.onOpenResult} className="font-semibold text-[#4f433b] transition hover:text-[#2f2118]">
              查看上次结果
            </button>
          ) : null}
          {props.hasDraft ? (
            <button type="button" onClick={props.onReset} className="font-semibold text-[#7a5a4d] transition hover:text-[#5f3a2f]">
              清空本机草稿
            </button>
          ) : null}
        </div>

        {props.saveMessage ? (
          <p className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[#c86b4f]/20 bg-[#fff3ed] px-4 py-3 text-center text-sm leading-6 text-[#9d4b34]">
            {props.saveMessage}
          </p>
        ) : null}
      </section>

      <section className="rounded-[34px] border border-black/5 bg-white p-7 shadow-[0_18px_70px_rgba(43,37,31,0.08)]">
        <h2 className="text-3xl font-semibold text-[#2f2118]">MMTI 测试 是什么？</h2>
        <p className="mt-4 w-full text-[15px] leading-8 text-[#5e5249]">
          {PROJECT_BRAND.code}（{PROJECT_BRAND.fullName}，{PROJECT_BRAND.chinese}）是一款基于 5 大母职转变模型、15 个连续反应维度的娱乐型类型测试。
          它用 30 道围绕怀孕与养育想象设计的题目，通过 L / M / H 三级指纹和模式匹配算法，为你匹配 25 种孕妈类型
          ，每一种都带着一点自嘲、一点毒舌，和尽量贴近真实处境的洞察。
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {HOME_MODELS.map((model) => (
            <article key={model.title} className="rounded-[24px] border border-[#e8e1d7] bg-[#faf7f2] p-4">
              <h3 className="text-base font-semibold text-[#3e342d]">{model.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#74665d]">{model.dims}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[34px] border border-black/5 bg-white p-7 shadow-[0_18px_70px_rgba(43,37,31,0.08)]">
        <h2 className="text-3xl font-semibold text-[#2f2118]">MMTI 是怎么跑出结果的？</h2>
        <p className="mt-4 text-[15px] leading-8 text-[#5e5249]">从 30 题到 25 种结果，一共 4 步，前台只展示低 / 中 / 高，不公开精确分数。</p>
        <div className="mt-6 space-y-4">
          {HOME_STEPS.map((step) => (
            <article key={step.index} className="rounded-[24px] border border-[#e8e1d7] bg-[#fbfaf7] px-5 py-5">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5f755b] text-sm font-semibold text-white">
                  {step.index}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#3e342d]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#74665d]">{step.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[34px] border border-black/5 bg-white p-7 shadow-[0_18px_70px_rgba(43,37,31,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-[#2f2118]">25 种孕妈类型</h2>
            <p className="mt-3 text-[15px] leading-8 text-[#5e5249]">你是哪一型？测完才知道。现在先把整个宇宙边界扫一眼。</p>
          </div>
          <button
            type="button"
            onClick={props.onOpenCatalog}
            className="rounded-full border border-[#d5ccc1] bg-white px-5 py-3 text-sm font-semibold text-[#53463e] shadow-sm transition hover:-translate-y-0.5 hover:border-[#bfae9d] hover:bg-[#fffdfa]"
          >
            查看全部类型
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {ALL_ARCHETYPES.map((archetype) => (
            <HomePreviewChip key={archetype.code} archetype={archetype} onClick={() => props.onOpenDetail(archetype.code)} />
          ))}
        </div>
      </section>

      <p className="pb-8 text-center text-sm leading-7 text-[#73675e]">
        本产品是类型测试，不提供医疗、法律或心理建议，也不替你决定是否继续妊娠。
      </p>
    </main>
  );
}

export function QuizView(props: {
  index: number;
  answeredCount: number;
  selectedValue: number | null;
  validationMessage: string | null;
  onExit: () => void;
  onPrevious: () => void;
  onChange: (value: number) => void;
}) {
  const question = QUESTIONS[props.index];
  const progress = Math.round(((props.index + 1) / QUESTIONS.length) * 100);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-6 md:px-8">
      <header className="flex items-center justify-start">
        <button
          type="button"
          onClick={props.onExit}
          className="rounded-full border border-black/5 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#51443d] shadow-sm transition hover:bg-white"
        >
          {"\u8fd4\u56de\u4e3b\u9875"}
        </button>
      </header>

      <section className="mt-5 overflow-hidden rounded-[36px] border border-black/5 bg-white p-6 shadow-[0_24px_80px_rgba(43,37,31,0.08)] md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-full bg-[#f1e4d7] px-3.5 py-1.5 text-sm font-semibold text-[#85543e]">
            {"\u7b2c "}{props.index + 1}{" \u9898"}
          </div>
          <div className="w-full max-w-xs">
            <div className="h-2 overflow-hidden rounded-full bg-[#efe7de]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#c6604a,#1f5f58)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <h1 className="mt-8 max-w-3xl text-3xl font-semibold leading-tight text-[#2f2118] md:text-4xl">{question.prompt}</h1>

        <div className="mt-8 space-y-3">
          {QUESTION_SCALE_OPTIONS.map((option) => {
            const active = option.value === props.selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => props.onChange(option.value)}
                className={`flex w-full items-center rounded-[24px] border px-5 py-4 text-left transition ${
                  active
                    ? "border-[#b4553e] bg-[#fff4ee] text-[#5f3729] shadow-[0_10px_24px_rgba(180,85,62,0.12)]"
                    : "border-black/5 bg-[#fbf9f6] text-[#4e433c] hover:border-[#c7b7a8] hover:bg-white"
                }`}
              >
                <span className="text-base font-semibold">{option.label}</span>
              </button>
            );
          })}
        </div>

        {props.validationMessage ? (
          <p className="mt-5 rounded-2xl border border-[#c86b4f]/20 bg-[#fff3ed] px-4 py-3 text-sm leading-6 text-[#9d4b34]">
            {props.validationMessage}
          </p>
        ) : null}

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={props.onPrevious}
            disabled={props.index === 0}
            className="rounded-full border border-[#d9d2c8] bg-white px-5 py-3 font-semibold text-[#5d5048] shadow-sm transition hover:bg-[#fffdfa] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {"\u2190 \u4e0a\u4e00\u9898"}
          </button>
          <p className="text-sm font-medium text-[#6d6057]">{props.answeredCount}/{QUESTIONS.length} {"\u5df2\u5b8c\u6210"}</p>
        </footer>
      </section>
    </main>
  );
}

function FingerprintGrid(props: { vector: ScoreVector }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {MODELS.map((model) => (
        <section key={model.id} className="rounded-[24px] border border-black/5 bg-[#faf7f2] p-4">
          <h3 className="text-sm font-semibold text-[#564a42]">{model.label}</h3>
          <div className="mt-3 space-y-2">
            {model.dimensionIds.map((dimensionId) => {
              const level = getFingerprintLevel(props.vector[dimensionId]);
              const text = level === "low" ? "低" : level === "medium" ? "中" : "高";

              return (
                <div key={dimensionId} className="rounded-2xl bg-white/90 px-3 py-2 text-sm text-[#4d4139] shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span>{DIMENSIONS.find((item) => item.id === dimensionId)?.label}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        level === "high"
                          ? "bg-[#f6d9cb] text-[#9b4b35]"
                          : level === "low"
                            ? "bg-[#dfeeea] text-[#246258]"
                            : "bg-[#ece7df] text-[#74695f]"
                      }`}
                    >
                      {text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

const RADAR_SIZE = 560;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_RADIUS = 164;
const RADAR_LABEL_RADIUS = 226;
const HML_LEVELS: readonly FingerprintLevel[] = ["high", "medium", "low"];

function getDimensionBarWidth(score: number): string {
  const percent = ((score - 1) / 4) * 100;
  return `${Math.max(0, Math.min(100, Math.round(percent)))}%`;
}

function getDimensionOrderLabel(dimensionId: string): string {
  const index = DIMENSIONS.findIndex((dimension) => dimension.id === dimensionId);
  return String(index + 1).padStart(2, "0");
}

function getRadarTextAnchor(x: number): "start" | "middle" | "end" {
  if (Math.abs(x - RADAR_CENTER) < 20) {
    return "middle";
  }

  return x < RADAR_CENTER ? "end" : "start";
}

function ResultBreadcrumb(props: { onGoHome: () => void; currentLabel: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-[#7b6c61]">
      <button
        type="button"
        onClick={props.onGoHome}
        className="rounded-full border border-[#e1d8cd] bg-white px-4 py-2 font-semibold text-[#4f433b] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fffdfa]"
      >
        返回首页
      </button>
      <span aria-hidden="true">/</span>
      <span className="font-medium text-[#6a5c52]">{props.currentLabel}</span>
    </div>
  );
}

function ResultHeroSection(props: {
  archetype: ArchetypeDefinition;
  match: MatchEntry;
  whyTags: readonly string[];
}) {
  const family = getFamily(props.archetype.familyId);

  return (
    <section className="rounded-[36px] border border-black/5 bg-white p-6 shadow-[0_24px_80px_rgba(43,37,31,0.08)] md:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="mx-auto w-full max-w-[520px]">
          <ArchetypePoster archetype={props.archetype} compact />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-[#6e8573]">测试结果已生成 · {family.name}</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#1f2b27] md:text-6xl">
            {props.archetype.code}
            <span className="mt-3 block text-3xl text-[#314740] md:text-4xl">{props.archetype.name}</span>
          </h1>
          <div className="mt-5 inline-flex rounded-full border border-[#d6e3d8] bg-[#f4faf6] px-4 py-2 text-sm font-semibold text-[#466b5f]">
            匹配度 {props.match.similarityPercent}% · 精准命中 {props.match.exactMatchCount}/{DIMENSIONS.length} 维
          </div>
          <p className="mt-6 text-xl font-semibold leading-8 text-[#33453f]">{props.archetype.punchline}</p>
          <p className="mt-4 max-w-2xl text-[15px] leading-8 text-[#5b4e45]">{props.archetype.intro}</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {props.whyTags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#f3e5da] px-4 py-2 text-sm font-semibold text-[#8c513d]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RadarChart(props: { vector: ScoreVector }) {
  const angleStep = (Math.PI * 2) / DIMENSIONS.length;
  const gridScales = [0.25, 0.5, 0.75, 1];

  const labelPoints = DIMENSIONS.map((dimension, index) => {
    const angle = -Math.PI / 2 + angleStep * index;
    const x = RADAR_CENTER + Math.cos(angle) * RADAR_LABEL_RADIUS;
    const y = RADAR_CENTER + Math.sin(angle) * RADAR_LABEL_RADIUS;

    return {
      dimension,
      x,
      y,
      anchor: getRadarTextAnchor(x),
    };
  });

  const polygonPoints = DIMENSIONS.map((dimension, index) => {
    const angle = -Math.PI / 2 + angleStep * index;
    const normalized = (props.vector[dimension.id] - 1) / 4;
    const radius = RADAR_RADIUS * normalized;

    return {
      x: RADAR_CENTER + Math.cos(angle) * radius,
      y: RADAR_CENTER + Math.sin(angle) * radius,
    };
  });

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#efe8dd] bg-[#fbfaf7] p-4">
      <svg viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`} className="mx-auto block w-full max-w-[560px]" role="img" aria-label="15个维度的雷达图">
        {gridScales.map((scale) => (
          <polygon
            key={scale}
            points={DIMENSIONS.map((_, index) => {
              const angle = -Math.PI / 2 + angleStep * index;
              const x = RADAR_CENTER + Math.cos(angle) * RADAR_RADIUS * scale;
              const y = RADAR_CENTER + Math.sin(angle) * RADAR_RADIUS * scale;

              return `${x},${y}`;
            }).join(" ")}
            fill="none"
            stroke="#d9ddd4"
            strokeWidth="1"
          />
        ))}
        {DIMENSIONS.map((_, index) => {
          const angle = -Math.PI / 2 + angleStep * index;
          const x = RADAR_CENTER + Math.cos(angle) * RADAR_RADIUS;
          const y = RADAR_CENTER + Math.sin(angle) * RADAR_RADIUS;

          return <line key={index} x1={RADAR_CENTER} y1={RADAR_CENTER} x2={x} y2={y} stroke="#e8ece5" strokeWidth="1" />;
        })}
        <polygon
          points={polygonPoints.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="rgba(95, 117, 91, 0.18)"
          stroke="#5f755b"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {polygonPoints.map((point, index) => (
          <circle key={DIMENSIONS[index].id} cx={point.x} cy={point.y} r="4.5" fill="#5f755b" />
        ))}
        {labelPoints.map((point) => (
          <text
            key={point.dimension.id}
            x={point.x}
            y={point.y}
            textAnchor={point.anchor}
            dominantBaseline="middle"
            className="fill-[#6a6f68] text-[11px] font-medium"
          >
            {point.dimension.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function LegacyDetailedFingerprintPanel(props: { vector: ScoreVector }) {
  return (
    <section className="rounded-[32px] border border-black/5 bg-white p-7 shadow-[0_18px_60px_rgba(43,37,31,0.08)]">
      <h2 className="text-2xl font-semibold text-[#2f2118]">15 维度画像</h2>
      <div className="mt-6 space-y-7">
        {MODELS.map((model) => (
          <div key={model.id}>
            <div className="border-b border-[#ece4da] pb-3">
              <h3 className="text-xl font-semibold text-[#3f544f]">{model.label}</h3>
            </div>
            <div className="mt-4 space-y-4">
              {model.dimensionIds.map((dimensionId) => {
                const dimension = DIMENSIONS.find((item) => item.id === dimensionId);

                if (!dimension) {
                  return null;
                }

                const level = getFingerprintLevel(props.vector[dimensionId]);
                const meta = LEVEL_BADGE_META[level];

                return (
                  <article key={dimensionId}>
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-[20px] font-semibold leading-none text-[#2f2118]">{dimension.label}</h4>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}>{meta.text}</span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[#5e5249]">{dimension.notes[level]}</p>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DetailedFingerprintPanel(props: { vector: ScoreVector }) {
  return (
    <section className="rounded-[32px] border border-black/5 bg-white p-7 shadow-[0_18px_60px_rgba(43,37,31,0.08)]">
      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="text-2xl font-semibold text-[#2f2118]">维度雷达</h2>
          <p className="mt-3 text-sm leading-7 text-[#66594f]">15 个维度一起看，只展示高低趋势，不公开原始分数。</p>
          <div className="mt-6">
            <RadarChart vector={props.vector} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#2f2118]">15 维度画像</h2>
          <p className="mt-3 text-sm leading-7 text-[#66594f]">每一维都给出当前落点、简短说明和 H / M / L 标记，方便从上到下快速扫读。</p>
          <div className="mt-6 space-y-8">
            {MODELS.map((model) => (
              <div key={model.id}>
                <div className="border-b border-[#ece4da] pb-3">
                  <h3 className="text-xl font-semibold text-[#3f544f]">{model.label}</h3>
                </div>
                <div className="mt-4 space-y-5">
                  {model.dimensionIds.map((dimensionId) => {
                    const dimension = DIMENSIONS.find((item) => item.id === dimensionId);

                    if (!dimension) {
                      return null;
                    }

                    const level = getFingerprintLevel(props.vector[dimensionId]);
                    const meta = LEVEL_BADGE_META[level];

                    return (
                      <article key={dimensionId} className="rounded-[24px] bg-[#fcfaf6] px-4 py-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold tracking-[0.18em] text-[#77887d]">
                              {getDimensionOrderLabel(dimensionId)} · {model.label}
                            </p>
                            <h4 className="mt-2 text-[22px] font-semibold leading-none text-[#2f2118]">{dimension.label}</h4>
                            <p className="mt-3 text-sm leading-7 text-[#5e5249]">{dimension.notes[level]}</p>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}>{meta.text}</span>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e9eee8]">
                            <div
                              className="h-full rounded-full bg-[linear-gradient(90deg,#7e9480,#5f755b)]"
                              style={{ width: getDimensionBarWidth(props.vector[dimensionId]) }}
                            />
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5">
                            {HML_LEVELS.map((status) => {
                              const active = status === level;
                              const label = LEVEL_BADGE_META[status].text;

                              return (
                                <span
                                  key={status}
                                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                                    active ? LEVEL_BADGE_META[status].className : "bg-[#f1ede6] text-[#9a8f86]"
                                  }`}
                                >
                                  {label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonalityTraitCard(props: { index: number; title: string; body: string }) {
  return (
    <article className="rounded-[30px] border border-[#f0b29c] bg-white px-6 py-6 shadow-[0_14px_40px_rgba(43,37,31,0.06)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2774b] text-sm font-semibold text-white">
          {String(props.index).padStart(2, "0")}
        </span>
        <h3 className="text-2xl font-semibold text-[#26312d]">{props.title}</h3>
      </div>
      <p className="mt-4 text-[15px] leading-8 text-[#5d5248]">{props.body}</p>
    </article>
  );
}

function PersonalityTraitsSection(props: { archetype: ArchetypeDefinition }) {
  const traits = [
    { title: "典型反应", body: props.archetype.reaction },
    { title: "最容易翻车的地方", body: props.archetype.failureMode },
    { title: "别人怎么配合你更有用", body: props.archetype.needFromOthers },
  ];

  return (
    <section className="rounded-[32px] border border-black/5 bg-white p-7 shadow-[0_18px_60px_rgba(43,37,31,0.08)]">
      <h2 className="text-2xl font-semibold text-[#2f2118]">扩写性格特点</h2>
      <p className="mt-3 text-sm leading-7 text-[#66594f]">这里保留三块最稳定、最可回溯的特征，不额外发明脱离题库的新标签。</p>
      <div className="mt-6 space-y-4">
        {traits.map((trait, index) => (
          <PersonalityTraitCard key={trait.title} index={index + 1} title={trait.title} body={trait.body} />
        ))}
      </div>
    </section>
  );
}

function SimilarTypeRankingSection(props: {
  title: string;
  description: string;
  matches: readonly MatchEntry[];
  onOpenDetail: (code: string) => void;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-[32px] border border-black/5 bg-white p-7 shadow-[0_18px_60px_rgba(43,37,31,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#2f2118]">{props.title}</h2>
          <p className="mt-3 text-sm leading-7 text-[#66594f]">{props.description}</p>
        </div>
        {props.actions}
      </div>
      <div className="mt-6 divide-y divide-[#ece4da] rounded-[28px] border border-[#eee5da] bg-[#fcfaf6]">
        {props.matches.map((entry, index) => (
          <button
            key={entry.code}
            type="button"
            onClick={() => props.onOpenDetail(entry.code)}
            className="flex w-full flex-col gap-3 px-5 py-5 text-left transition hover:bg-white md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="w-14 text-2xl font-semibold text-[#6d7f73]">#{index + 1}</span>
              <div>
                <p className="text-[30px] font-semibold leading-none text-[#43594f]">{entry.code}</p>
                <p className="mt-2 text-lg text-[#584c45]">{entry.archetype.name}</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-3xl font-semibold text-[#6d7f73]">{entry.similarityPercent}%</p>
              <p className="mt-1 text-xs font-semibold tracking-[0.16em] text-[#8b7f75]">相似度</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function TypeCard(props: {
  archetype: ArchetypeDefinition;
  onClick?: () => void;
  familyLabel?: boolean;
}) {
  const family = getFamily(props.archetype.familyId);

  return (
    <button
      type="button"
      onClick={props.onClick}
      className="w-full rounded-[28px] border border-black/5 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:bg-[#fffdfa]"
    >
      <div className="flex items-center gap-4">
        <ArchetypeThumbnail archetype={props.archetype} className="shadow-none" />
        <div className="min-w-0">
          {props.familyLabel ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#886f61]">{family.name}</p> : null}
          <p className="mt-1 text-[28px] font-semibold leading-none text-[#1f2f33]">{props.archetype.code}</p>
          <h3 className="mt-3 text-[22px] font-semibold leading-none text-[#3f5b58]">{props.archetype.name}</h3>
          <p className="mt-4 text-[15px] leading-7 text-[#5a4a42]">{props.archetype.punchline}</p>
        </div>
      </div>
    </button>
  );
}

function LegacyResultView(props: {
  matched: ArchetypeDefinition;
  resultVector: ScoreVector;
  similar: readonly { code: string; archetype: ArchetypeDefinition }[];
  onOpenDetail: (code: string) => void;
  onRetake: () => void;
  onBrowseAll: () => void;
}) {
  const family = getFamily(props.matched.familyId);
  const whyTags = getWhyTags(props.resultVector);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-5 py-8 md:px-8">
      <section
        className="overflow-hidden rounded-[36px] border border-black/5 p-8 text-white shadow-[0_24px_70px_rgba(43,37,31,0.16)] md:p-10"
        style={{ backgroundImage: `linear-gradient(135deg, ${family.accentFrom}, ${family.accentTo})` }}
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">{props.matched.code}</p>
            <h1 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">{props.matched.name}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/88">{props.matched.punchline}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr] lg:grid-cols-1">
            <ArchetypePoster archetype={props.matched} compact />
            <div className="rounded-[26px] border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-sm text-white/72">内部归属</p>
              <p className="mt-1 text-xl font-semibold">{family.name}</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-white/80">{family.summary}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-black/5 bg-white p-7 shadow-[0_18px_60px_rgba(43,37,31,0.08)]">
          <h2 className="text-xl font-semibold text-[#2f2118]">你为什么是这一型</h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {whyTags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#f3e5da] px-4 py-2 text-sm font-semibold text-[#8c513d]">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-6 text-[15px] leading-8 text-[#564a42]">{props.matched.intro}</p>
        </div>

        <div className="rounded-[32px] border border-black/5 bg-white p-7 shadow-[0_18px_60px_rgba(43,37,31,0.08)]">
          <h2 className="text-xl font-semibold text-[#2f2118]">轻量指纹</h2>
          <p className="mt-3 text-sm leading-7 text-[#66594f]">前台只显示低 / 中 / 高，不公开精确分数。</p>
          <div className="mt-5">
            <FingerprintGrid vector={props.resultVector} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-[30px] border border-black/5 bg-white p-6 shadow-[0_16px_50px_rgba(43,37,31,0.08)]">
          <h2 className="text-lg font-semibold text-[#2f2118]">典型反应</h2>
          <p className="mt-4 text-[15px] leading-8 text-[#564a42]">{props.matched.reaction}</p>
        </article>
        <article className="rounded-[30px] border border-black/5 bg-white p-6 shadow-[0_16px_50px_rgba(43,37,31,0.08)]">
          <h2 className="text-lg font-semibold text-[#2f2118]">最容易翻车的地方</h2>
          <p className="mt-4 text-[15px] leading-8 text-[#564a42]">{props.matched.failureMode}</p>
        </article>
        <article className="rounded-[30px] border border-black/5 bg-white p-6 shadow-[0_16px_50px_rgba(43,37,31,0.08)]">
          <h2 className="text-lg font-semibold text-[#2f2118]">别人怎么配合你更有用</h2>
          <p className="mt-4 text-[15px] leading-8 text-[#564a42]">{props.matched.needFromOthers}</p>
        </article>
      </section>

      <section className="rounded-[32px] border border-black/5 bg-white p-7 shadow-[0_18px_60px_rgba(43,37,31,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#2f2118]">{props.matched.code === "NOIS" ? "你最接近的标准类型" : "相近类型"}</h2>
            <p className="mt-2 text-sm leading-7 text-[#66594f]">
              {props.matched.code === "NOIS"
                ? "标准类型都差一口气时，系统会把最近的几种放出来给你对照。"
                : "不是你人格分裂，只是这些原型和你也有相邻边。"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={props.onRetake}
              className="rounded-full border border-black/5 bg-[#f7f2ec] px-5 py-3 font-semibold text-[#574a42] transition hover:bg-white"
            >
              重新做一遍
            </button>
            <button
              type="button"
              onClick={props.onBrowseAll}
              className="rounded-full bg-[#2f2118] px-5 py-3 font-semibold text-white transition hover:bg-[#472f22]"
            >
              浏览全部类型
            </button>
            <button
              type="button"
              onClick={() => props.onOpenDetail(props.matched.code)}
              className="rounded-full border border-black/5 bg-white px-5 py-3 font-semibold text-[#574a42] transition hover:bg-[#fffdfa]"
            >
              打开类型详情
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {props.similar.map((entry) => (
            <TypeCard key={entry.code} archetype={entry.archetype} familyLabel onClick={() => props.onOpenDetail(entry.code)} />
          ))}
        </div>

        {props.matched.code === "NOIS" ? (
          <p className="mt-5 rounded-[24px] border border-[#8a8a8a]/20 bg-[#f5f5f5] px-5 py-4 text-sm leading-7 text-[#545454]">
            校准提示：你不是“没结果”，而是多股模式一起抢方向盘。先看最近的 3 个标准型，再回头看哪几条线最吵。
          </p>
        ) : null}
      </section>

      <p className="pb-8 text-center text-sm leading-7 text-[#73675e]">
        本产品是类型测试，不提供医疗、法律或心理建议，也不替你决定是否继续妊娠。
      </p>
    </main>
  );
}

function DetailDescriptionSection(props: { archetype: ArchetypeDefinition }) {
  const family = getFamily(props.archetype.familyId);

  return (
    <section className="rounded-[32px] border border-black/5 bg-white p-7 shadow-[0_18px_60px_rgba(43,37,31,0.08)]">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] bg-[#fbf7f0] p-5">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#8a6f61]">所属家族</p>
          <h2 className="mt-3 text-2xl font-semibold text-[#2f2118]">{family.name}</h2>
          <p className="mt-3 text-sm leading-7 text-[#5c5047]">{family.summary}</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-[#2f2118]">类型说明</h2>
          <p className="mt-4 text-[15px] leading-8 text-[#5c5047]">{getArchetypeDescription(props.archetype)}</p>
        </div>
      </div>
    </section>
  );
}

export function ResultView(props: {
  matched: ArchetypeDefinition;
  resultVector: ScoreVector;
  rankedMatches: readonly MatchEntry[];
  onGoHome: () => void;
  onOpenDetail: (code: string) => void;
  onRetake: () => void;
  onBrowseAll: () => void;
}) {
  const whyTags = getWhyTags(props.resultVector, 4);
  const headlineMatch = props.rankedMatches[0];
  const rankingTitle = props.matched.code === "NOIS" ? "最接近的标准类型 TOP 5" : "相近类型 TOP 5";
  const rankingDescription =
    props.matched.code === "NOIS"
      ? "当前结果说明你同时踩中了多股模式，所以这里优先给你最接近的标准类型作对照。"
      : "你的结果不是孤立存在的，下面是最贴近你的前 5 个类型和相似百分比。";

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-5 py-8 md:px-8">
      <ResultBreadcrumb onGoHome={props.onGoHome} currentLabel="测试结果" />
      <ResultHeroSection archetype={props.matched} match={headlineMatch} whyTags={whyTags} />
      <DetailedFingerprintPanel vector={props.resultVector} />
      <PersonalityTraitsSection archetype={props.matched} />
      <SimilarTypeRankingSection
        title={rankingTitle}
        description={rankingDescription}
        matches={props.rankedMatches}
        onOpenDetail={props.onOpenDetail}
        actions={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={props.onRetake}
              className="rounded-full border border-black/5 bg-[#f7f2ec] px-5 py-3 font-semibold text-[#574a42] transition hover:bg-white"
            >
              重新测试
            </button>
            <button
              type="button"
              onClick={props.onBrowseAll}
              className="rounded-full bg-[#2f2118] px-5 py-3 font-semibold text-white transition hover:bg-[#472f22]"
            >
              浏览全部类型
            </button>
            <button
              type="button"
              onClick={() => props.onOpenDetail(props.matched.code)}
              className="rounded-full border border-black/5 bg-white px-5 py-3 font-semibold text-[#574a42] transition hover:bg-[#fffdfa]"
            >
              查看当前类型详情
            </button>
          </div>
        }
      />

      {props.matched.code === "NOIS" ? (
        <p className="rounded-[24px] border border-[#8a8a8a]/20 bg-[#f5f5f5] px-5 py-4 text-sm leading-7 text-[#545454]">
          标准提示：你不是“没有结果”，而是多股模式一起抢方向盘。先看最接近的标准类型，再回头看哪些维度在同时拉扯你。
        </p>
      ) : null}

      <p className="pb-8 text-center text-sm leading-7 text-[#73675e]">
        鏈骇鍝佹槸绫诲瀷娴嬭瘯锛屼笉鎻愪緵鍖荤枟銆佹硶寰嬫垨蹇冪悊寤鸿锛屼篃涓嶆浛浣犲喅瀹氭槸鍚︾户缁濞犮€?
      </p>
    </main>
  );
}

function CatalogView(props: {
  onOpenDetail: (code: string) => void;
  onBack: () => void;
}) {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b4e37]">All Types</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#2f2118] md:text-5xl">25 种孕妈类型一览</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-8 text-[#5e5249]">
            浏览全部 {PROJECT_BRAND.code} 类型。先看轮廓、再点进去看大图、长文案和 15 维度画像。
          </p>
        </div>
        <button
          type="button"
          onClick={props.onBack}
          className="rounded-full border border-black/5 bg-white px-5 py-3 font-semibold text-[#594d45] shadow-sm transition hover:bg-white"
        >
          返回
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ALL_ARCHETYPES.map((archetype) => (
          <TypeCard key={archetype.code} archetype={archetype} familyLabel onClick={() => props.onOpenDetail(archetype.code)} />
        ))}
      </div>
    </main>
  );
}

function LegacyDetailView(props: {
  archetypeCode: string;
  onBack: () => void;
  onOpenCatalog: () => void;
}) {
  const archetype = getArchetype(props.archetypeCode);
  const family = getFamily(archetype.familyId);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b4e37]">{"\u7c7b\u578b\u8be6\u60c5"}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={props.onBack}
            className="rounded-full border border-black/5 bg-white px-5 py-3 font-semibold text-[#594d45] shadow-sm transition hover:bg-[#fffdfa]"
          >
            {"\u8fd4\u56de"}
          </button>
          <button
            type="button"
            onClick={props.onOpenCatalog}
            className="rounded-full bg-[#2f2118] px-5 py-3 font-semibold text-white transition hover:bg-[#472f22]"
          >
            {"\u6d4f\u89c8\u5168\u90e8\u7c7b\u578b"}
          </button>
        </div>
      </div>

      <section
        className="mt-6 rounded-[34px] border border-black/5 bg-white p-6 shadow-[0_20px_70px_rgba(43,37,31,0.1)] md:p-8"
        style={{ backgroundImage: `radial-gradient(circle at top, ${family.accentTo}18 0%, rgba(255,255,255,0) 50%)` }}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="mx-auto w-full max-w-[520px]">
            <ArchetypePoster archetype={archetype} />
          </div>
          <p className="text-center text-lg leading-8 text-[#5c5047]">{archetype.punchline}</p>
        </div>
      </section>
    </main>
  );
}
export function DetailView(props: {
  archetypeCode: string;
  onBack: () => void;
  onOpenCatalog: () => void;
  onOpenDetail: (code: string) => void;
}) {
  const archetype = getArchetype(props.archetypeCode);
  const family = getFamily(archetype.familyId);
  const detailMatch = matchArchetype(archetype.prototype);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b4e37]">{"\u7c7b\u578b\u8be6\u60c5"}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={props.onBack}
            className="rounded-full border border-black/5 bg-white px-5 py-3 font-semibold text-[#594d45] shadow-sm transition hover:bg-[#fffdfa]"
          >
            {"\u8fd4\u56de"}
          </button>
          <button
            type="button"
            onClick={props.onOpenCatalog}
            className="rounded-full bg-[#2f2118] px-5 py-3 font-semibold text-white transition hover:bg-[#472f22]"
          >
            {"\u6d4f\u89c8\u5168\u90e8\u7c7b\u578b"}
          </button>
        </div>
      </div>

      <section
        className="mt-6 rounded-[34px] border border-black/5 bg-white p-6 shadow-[0_20px_70px_rgba(43,37,31,0.1)] md:p-8"
        style={{ backgroundImage: `radial-gradient(circle at top, ${family.accentTo}18 0%, rgba(255,255,255,0) 50%)` }}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="mx-auto w-full max-w-[520px]">
            <ArchetypePoster archetype={archetype} />
          </div>
          <p className="text-center text-lg leading-8 text-[#5c5047]">{archetype.punchline}</p>
        </div>
      </section>

      <div className="mt-6 space-y-6">
        <DetailDescriptionSection archetype={archetype} />
        <DetailedFingerprintPanel vector={archetype.prototype} />
        <PersonalityTraitsSection archetype={archetype} />
        <SimilarTypeRankingSection
          title="相近类型 TOP 5"
          description="这里按类型原型做相似度排序，方便横向对照当前类型和邻近类型。"
          matches={detailMatch.ranked}
          onOpenDetail={props.onOpenDetail}
        />
      </div>
    </main>
  );
}


export function CoreSpecRebuildApp() {
  const initial = useMemo(() => loadPersistedQuizState(), []);
  const initialRoute = useMemo(() => parseHashRoute(), []);
  const [answers, setAnswers] = useState(initial.value.answers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(Math.min(initial.value.currentQuestionIndex, QUESTIONS.length - 1));
  const [view, setView] = useState<View>(initialRoute.view);
  const [detailReturnView, setDetailReturnView] = useState<DetailReturnView>("home");
  const [saveMessage, setSaveMessage] = useState(initial.error);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [selectedDetailCode, setSelectedDetailCode] = useState(initialRoute.code ?? HOME_FEATURED_CODE);

  const answeredCount = getAnsweredCount(answers);
  const hasDraft = answeredCount > 0;
  const completed = isQuizComplete(answers);
  const resultVector = buildScoreVector(answers);
  const result = completed ? matchArchetype(resultVector) : null;

  function persist(nextAnswers = answers, nextQuestionIndex = currentQuestionIndex) {
    const error = savePersistedQuizState({
      answers: nextAnswers,
      currentQuestionIndex: nextQuestionIndex,
      updatedAt: new Date().toISOString(),
    });

    setSaveMessage(error ? error : "草稿已保存到本机浏览器");
  }

  function openDetail(code: string, returnView: DetailReturnView) {
    setSelectedDetailCode(code);
    setDetailReturnView(returnView);
    setView("detail");
  }

  function navigate(nextView: View, options?: { detailCode?: string; detailReturnView?: DetailReturnView }) {
    if (options?.detailCode) {
      setSelectedDetailCode(options.detailCode);
    }
    if (options?.detailReturnView) {
      setDetailReturnView(options.detailReturnView);
    }
    setView(nextView);
  }

  function goHistoryBack(fallbackView: View, options?: { detailCode?: string; detailReturnView?: DetailReturnView }) {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }

    navigate(fallbackView, options);
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const syncRouteFromHash = () => {
      const route = parseHashRoute();

      if (route.view === "result" && !completed) {
        setView("home");
        return;
      }

      if (route.view === "detail" && route.code) {
        const match = ALL_ARCHETYPES.find((archetype) => archetype.code === route.code);

        if (!match) {
          setView("catalog");
          return;
        }

        setSelectedDetailCode(route.code);
        setView("detail");
        return;
      }

      setView(route.view);
    };

    syncRouteFromHash();
    window.addEventListener("hashchange", syncRouteFromHash);

    return () => window.removeEventListener("hashchange", syncRouteFromHash);
  }, [completed]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nextHash = buildHashRoute(view, selectedDetailCode);

    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  }, [selectedDetailCode, view]);

  function handleStart() {
    setCurrentQuestionIndex(getResumeQuestionIndex(answers, currentQuestionIndex));
    setValidationMessage(null);
    navigate("quiz");
  }

  function handleAnswerChange(questionId: QuestionId, value: number) {
    const nextAnswers = {
      ...answers,
      [questionId]: value,
    };

    setAnswers(nextAnswers);
    setValidationMessage(null);

    if (currentQuestionIndex === QUESTIONS.length - 1) {
      persist(nextAnswers, currentQuestionIndex);
      navigate("result");
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    persist(nextAnswers, nextIndex);
  }

  function handlePreviousQuestion() {
    if (currentQuestionIndex === 0) {
      return;
    }

    const previousIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(previousIndex);
    setValidationMessage(null);
    persist(answers, previousIndex);
  }

  function handleExitQuiz() {
    setValidationMessage(null);
    persist(answers, currentQuestionIndex);
    navigate("home");
  }

  function handleBack() {
    goHistoryBack("home");
  }

  function handleReset() {

    if (typeof window !== "undefined" && !window.confirm("清空本机草稿并重新开始？")) {
      return;
    }

    const nextAnswers = createEmptyAnswers();
    setAnswers(nextAnswers);
    setCurrentQuestionIndex(0);
    setValidationMessage(null);
    setSelectedDetailCode(HOME_FEATURED_CODE);
    navigate("home");
    const error = clearPersistedQuizState();
    setSaveMessage(error);
  }

  if (view === "quiz") {
    const question = QUESTIONS[currentQuestionIndex];

    return (
      <QuizView
        index={currentQuestionIndex}
        answeredCount={answeredCount}
        selectedValue={answers[question.id]}
        validationMessage={validationMessage}
        onExit={handleExitQuiz}
        onPrevious={handlePreviousQuestion}
        onChange={(value) => handleAnswerChange(question.id, value)}
      />
    );
  }

  if (view === "result" && result) {
    return (
      <ResultView
        matched={result.primary}
        resultVector={resultVector}
        rankedMatches={result.ranked}
        onGoHome={() => navigate("home")}
        onOpenDetail={(code) => openDetail(code, "result")}
        onRetake={handleReset}
        onBrowseAll={() => navigate("catalog")}
      />
    );
  }

  if (view === "catalog") {
    return (
      <CatalogView
        onOpenDetail={(code) => openDetail(code, "catalog")}
        onBack={() => goHistoryBack(completed ? "result" : "home")}
      />
    );
  }

  if (view === "detail") {
    return (
      <DetailView
        archetypeCode={selectedDetailCode}
        onBack={() => goHistoryBack(detailReturnView, { detailCode: selectedDetailCode })}
        onOpenCatalog={() => navigate("catalog")}
        onOpenDetail={(code) => openDetail(code, detailReturnView)}
      />
    );
  }

  return (
    <HomeView
      hasDraft={hasDraft}
      canOpenResult={completed}
      saveMessage={saveMessage}
      onStart={handleStart}
      onOpenResult={() => {
        if (result) {
          navigate("result");
        }
      }}
      onOpenCatalog={() => navigate("catalog")}
      onOpenDetail={(code) => openDetail(code, "home")}
      onReset={handleReset}
    />
  );
}
