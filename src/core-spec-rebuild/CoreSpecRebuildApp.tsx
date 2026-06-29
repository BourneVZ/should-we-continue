import { useEffect, useMemo, useState } from "react";
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

function ArchetypeThumbnail(props: {
  archetype: ArchetypeDefinition;
  size?: "sm" | "md";
  className?: string;
}) {
  const family = getFamily(props.archetype.familyId);
  const sizeClass = props.size === "sm" ? "h-14 w-14 rounded-[16px]" : "h-24 w-24 rounded-[22px]";

  if (props.archetype.artwork?.status === "final") {
    return (
      <div className={`shrink-0 overflow-hidden border border-black/5 bg-[#fbf7f0] p-1 ${sizeClass} ${props.className ?? ""}`}>
        <img src={props.archetype.artwork.posterPath} alt={props.archetype.artwork.alt} className="h-full w-full object-contain" />
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
      <ArchetypeThumbnail archetype={props.archetype} size="sm" />
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

function QuizView(props: {
  index: number;
  selectedValue: number | null;
  validationMessage: string | null;
  saveMessage: string | null;
  onBack: () => void;
  onNext: () => void;
  onChange: (value: number) => void;
}) {
  const question = QUESTIONS[props.index];
  const progress = Math.round(((props.index + 1) / QUESTIONS.length) * 100);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-6 md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={props.onBack}
          className="rounded-full border border-black/5 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#51443d] shadow-sm transition hover:bg-white"
        >
          返回
        </button>
        <div className="rounded-full border border-black/5 bg-white/80 px-4 py-2 text-sm text-[#65584f] shadow-sm">
          {props.saveMessage ?? "草稿默认保存在本机浏览器"}
        </div>
      </header>

      <section className="mt-5 overflow-hidden rounded-[36px] border border-black/5 bg-white p-6 shadow-[0_24px_80px_rgba(43,37,31,0.08)] md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full bg-[#f1e4d7] px-3.5 py-1.5 text-sm font-semibold text-[#85543e]">
              第 {props.index + 1} / {QUESTIONS.length} 题
            </div>
            <p className="mt-4 text-sm font-medium text-[#8b7468]">
              {question.format === "scenario" ? "场景题" : "陈述句"} · {DIMENSIONS.find((item) => item.id === question.dimensionId)?.label}
            </p>
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
        <p className="mt-4 text-sm leading-7 text-[#77685c]">按“像不像你当前会进入这种模式”来选，不用追求政治正确。</p>

        <div className="mt-8 space-y-3">
          {QUESTION_SCALE_OPTIONS.map((option) => {
            const active = option.value === props.selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => props.onChange(option.value)}
                className={`flex w-full items-center justify-between rounded-[24px] border px-5 py-4 text-left transition ${
                  active
                    ? "border-[#b4553e] bg-[#fff4ee] text-[#5f3729] shadow-[0_10px_24px_rgba(180,85,62,0.12)]"
                    : "border-black/5 bg-[#fbf9f6] text-[#4e433c] hover:border-[#c7b7a8] hover:bg-white"
                }`}
              >
                <span className="text-base font-semibold">{option.label}</span>
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-[#7a6a5d]">{option.value}</span>
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
          <p className="text-sm leading-7 text-[#77685c]">没有标准答案。你只需要选最像你会出现的反应。</p>
          <button
            type="button"
            onClick={props.onNext}
            className="rounded-full bg-[#2f2118] px-6 py-3 font-semibold text-white shadow-[0_18px_36px_rgba(47,33,24,0.22)] transition hover:-translate-y-0.5 hover:bg-[#472f22]"
          >
            {props.index === QUESTIONS.length - 1 ? "看结果" : "下一题"}
          </button>
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

function DetailedFingerprintPanel(props: { vector: ScoreVector }) {
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

function ResultView(props: {
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

function DetailView(props: {
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
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b4e37]">孕妈类型详情</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-[#2f2118] md:text-4xl">
            {archetype.code} {"\u2014"} {archetype.name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={props.onBack}
            className="rounded-full border border-black/5 bg-white px-5 py-3 font-semibold text-[#594d45] shadow-sm transition hover:bg-[#fffdfa]"
          >
            返回
          </button>
          <button
            type="button"
            onClick={props.onOpenCatalog}
            className="rounded-full bg-[#2f2118] px-5 py-3 font-semibold text-white transition hover:bg-[#472f22]"
          >
            浏览全部类型
          </button>
        </div>
      </div>

      <section
        className="mt-6 rounded-[34px] border border-black/5 bg-white p-6 shadow-[0_20px_70px_rgba(43,37,31,0.1)] md:p-7"
        style={{ backgroundImage: `radial-gradient(circle at top, ${family.accentTo}18 0%, rgba(255,255,255,0) 50%)` }}
      >
        <div className="grid items-center gap-5 lg:grid-cols-[220px_1fr]">
          <div className="mx-auto w-full max-w-[220px]">
            <ArchetypePoster archetype={archetype} compact />
          </div>
          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#8b6b5d]">{family.name}</p>
            <h2 className="mt-3 text-[40px] font-semibold leading-none text-[#1f2f33] md:text-[44px]">{archetype.code}</h2>
            <p className="mt-3 text-2xl font-semibold text-[#3f5b58]">{archetype.name}</p>
            <p className="mt-4 text-lg leading-8 text-[#5c5047]">{archetype.punchline}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[32px] border border-black/5 bg-white p-7 shadow-[0_18px_60px_rgba(43,37,31,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2f2118]">类型说明</h2>
        <p className="mt-4 text-[15px] leading-8 text-[#564a42]">{getArchetypeDescription(archetype)}</p>
      </section>

      <div className="mt-6">
        <DetailedFingerprintPanel vector={archetype.prototype} />
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
    setCurrentQuestionIndex(getFirstUnansweredIndex(answers));
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
    persist(nextAnswers, currentQuestionIndex);
  }

  function handleNext() {
    const question = QUESTIONS[currentQuestionIndex];

    if (answers[question.id] === null) {
      setValidationMessage("这题先选一个，不用优雅，先选最像你的那个。");
      return;
    }

    if (currentQuestionIndex === QUESTIONS.length - 1) {
      navigate("result");
      persist(answers, currentQuestionIndex);
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    persist(answers, nextIndex);
  }

  function handleBack() {
    if (view === "quiz" && currentQuestionIndex > 0) {
      const previousIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(previousIndex);
      setValidationMessage(null);
      persist(answers, previousIndex);
      return;
    }

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
        selectedValue={answers[question.id]}
        validationMessage={validationMessage}
        saveMessage={saveMessage}
        onBack={handleBack}
        onNext={handleNext}
        onChange={(value) => handleAnswerChange(question.id, value)}
      />
    );
  }

  if (view === "result" && result) {
    return (
      <ResultView
        matched={result.primary}
        resultVector={resultVector}
        similar={result.similar.map((entry) => ({ code: entry.code, archetype: entry.archetype }))}
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
