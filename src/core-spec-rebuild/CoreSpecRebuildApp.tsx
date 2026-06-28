import { useMemo, useState } from "react";
import {
  ALL_ARCHETYPES,
  DIMENSIONS,
  MODELS,
  QUESTIONS,
  QUESTION_SCALE_OPTIONS,
  getArchetype,
  getFamily,
  type ArchetypeDefinition,
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

type View = "home" | "quiz" | "result" | "catalog";

interface HeroCardProps {
  title: string;
  eyebrow: string;
  body: string;
  actions: readonly {
    label: string;
    onClick: () => void;
    tone?: "primary" | "secondary";
  }[];
}

function HeroCard({ title, eyebrow, body, actions }: HeroCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-black/5 bg-[#f6dfc9] p-8 shadow-[0_30px_90px_rgba(78,49,24,0.12)] md:p-12">
      <div className="absolute -right-10 top-8 h-36 w-36 rounded-full bg-[#cd6d4a]/25 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-24 w-full bg-[linear-gradient(180deg,rgba(246,223,201,0),rgba(170,92,63,0.16))]" />
      <p className="relative z-10 text-xs font-semibold uppercase tracking-[0.28em] text-[#8b4e37]">{eyebrow}</p>
      <h1 className="relative z-10 mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-[#2f2118] md:text-6xl">
        {title}
      </h1>
      <p className="relative z-10 mt-5 max-w-2xl text-base leading-8 text-[#563c2b] md:text-lg">{body}</p>
      <div className="relative z-10 mt-8 flex flex-wrap gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={
              action.tone === "secondary"
                ? "rounded-full border border-[#72422d]/20 bg-white/70 px-6 py-3 font-semibold text-[#563c2b] shadow-sm transition hover:bg-white"
                : "rounded-full bg-[#2f2118] px-6 py-3 font-semibold text-white shadow-[0_18px_36px_rgba(47,33,24,0.22)] transition hover:-translate-y-0.5 hover:bg-[#472f22]"
            }
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function HomeView(props: {
  hasDraft: boolean;
  canOpenResult: boolean;
  saveMessage: string | null;
  onStart: () => void;
  onOpenResult: () => void;
  onOpenCatalog: () => void;
  onReset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-5 py-8 md:px-8">
      <HeroCard
        eyebrow="Phase 1 / 妈妈类型测试"
        title="怀孕这件事一来，你会先控场、先拖延，还是先把自己演成一个很懂事的人？"
        body="这不是医学建议，不替你决定去留。它只做一件事：用 30 题，把你在怀孕与未来养育想象里最容易进入的反应模式拎出来。"
        actions={[
          { label: props.hasDraft ? "继续做题" : "开始测试", onClick: props.onStart },
          { label: "看看 25 种类型", onClick: props.onOpenCatalog, tone: "secondary" },
          ...(props.canOpenResult ? [{ label: "查看上次结果", onClick: props.onOpenResult, tone: "secondary" as const }] : []),
        ]}
      />

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-black/5 bg-white/80 p-7 shadow-[0_16px_60px_rgba(43,37,31,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b4e37]">怎么玩</p>
          <div className="mt-5 space-y-4 text-[15px] leading-7 text-[#4b4038]">
            <p>30 题，5 分量表，围绕怀孕当下和未来育儿想象来测。</p>
            <p>底层是 15 个连续维度，不是硬贴标签。</p>
            <p>结果页给你 24 个标准类型之一，或者在矛盾过载时给出 `NOIS / 噪点综合体`。</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-black/5 bg-[#f4efe6] p-7 shadow-[0_16px_60px_rgba(43,37,31,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6a5d52]">边界说明</p>
          <div className="mt-5 space-y-4 text-[15px] leading-7 text-[#4b4038]">
            <p>本产品是类型测试，不提供医疗、法律或心理建议，也不替你决定是否继续妊娠。</p>
            <p>语气可以有点损，但不会拿暴力、自伤、创伤或流产经历开玩笑。</p>
            <p>本机默认保存草稿，不上云。同一设备的其他使用者仍可能看到这些内容。</p>
          </div>
          {props.hasDraft ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={props.onReset}
                className="rounded-full border border-[#7c6858]/20 bg-white/70 px-4 py-2 text-sm font-semibold text-[#5b493e] transition hover:bg-white"
              >
                清空本机草稿
              </button>
            </div>
          ) : null}
          {props.saveMessage ? (
            <p className="mt-4 rounded-2xl border border-[#c86b4f]/20 bg-[#fff3ed] px-4 py-3 text-sm leading-6 text-[#9d4b34]">
              {props.saveMessage}
            </p>
          ) : null}
        </div>
      </section>
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

      <section className="mt-5 overflow-hidden rounded-[36px] border border-black/5 bg-white/80 p-6 shadow-[0_24px_80px_rgba(43,37,31,0.08)] md:p-8">
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
        <p className="mt-4 text-sm leading-7 text-[#77685c]">
          按“像不像你当前会进入这种模式”来选，不用追求政治正确。
        </p>

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
              const text =
                level === "low" ? "低" : level === "medium" ? "中" : "高";

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

function TypeCard(props: {
  archetype: ArchetypeDefinition;
  active?: boolean;
  onClick?: () => void;
  familyLabel?: boolean;
}) {
  const family = getFamily(props.archetype.familyId);

  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`w-full rounded-[26px] border p-5 text-left transition ${
        props.active
          ? "border-[#ba6145] bg-[#fff5ef] shadow-[0_16px_36px_rgba(186,97,69,0.12)]"
          : "border-black/5 bg-white/85 hover:-translate-y-0.5 hover:bg-white"
      }`}
    >
      {props.familyLabel ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#886f61]">{family.name}</p>
      ) : null}
      <div className="mt-2 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#9c644f]">{props.archetype.code}</p>
          <h3 className="mt-1 text-xl font-semibold text-[#2f2118]">{props.archetype.name}</h3>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#5a4a42]">{props.archetype.punchline}</p>
    </button>
  );
}

function ResultView(props: {
  matched: ArchetypeDefinition;
  resultVector: ScoreVector;
  similar: readonly { code: string; archetype: ArchetypeDefinition }[];
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
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">{props.matched.code}</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">{props.matched.name}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/88">{props.matched.punchline}</p>
          </div>
          <div className="rounded-[26px] border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-sm text-white/72">内部归属</p>
            <p className="mt-1 text-xl font-semibold">{family.name}</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-white/80">{family.summary}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-black/5 bg-white/85 p-7 shadow-[0_18px_60px_rgba(43,37,31,0.08)]">
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

        <div className="rounded-[32px] border border-black/5 bg-[#f4efe6] p-7 shadow-[0_18px_60px_rgba(43,37,31,0.06)]">
          <h2 className="text-xl font-semibold text-[#2f2118]">轻量指纹</h2>
          <p className="mt-3 text-sm leading-7 text-[#66594f]">前台只显示低 / 中 / 高，不公开精确分数。</p>
          <div className="mt-5">
            <FingerprintGrid vector={props.resultVector} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-[30px] border border-black/5 bg-white/85 p-6 shadow-[0_16px_50px_rgba(43,37,31,0.08)]">
          <h2 className="text-lg font-semibold text-[#2f2118]">典型反应</h2>
          <p className="mt-4 text-[15px] leading-8 text-[#564a42]">{props.matched.reaction}</p>
        </article>
        <article className="rounded-[30px] border border-black/5 bg-white/85 p-6 shadow-[0_16px_50px_rgba(43,37,31,0.08)]">
          <h2 className="text-lg font-semibold text-[#2f2118]">最容易翻车的地方</h2>
          <p className="mt-4 text-[15px] leading-8 text-[#564a42]">{props.matched.failureMode}</p>
        </article>
        <article className="rounded-[30px] border border-black/5 bg-white/85 p-6 shadow-[0_16px_50px_rgba(43,37,31,0.08)]">
          <h2 className="text-lg font-semibold text-[#2f2118]">别人怎么配合你更有用</h2>
          <p className="mt-4 text-[15px] leading-8 text-[#564a42]">{props.matched.needFromOthers}</p>
        </article>
      </section>

      <section className="rounded-[32px] border border-black/5 bg-white/85 p-7 shadow-[0_18px_60px_rgba(43,37,31,0.08)]">
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
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {props.similar.map((entry) => (
            <TypeCard key={entry.code} archetype={entry.archetype} familyLabel />
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
  selectedCode: string;
  onSelect: (code: string) => void;
  onBack: () => void;
}) {
  const selected = getArchetype(props.selectedCode);
  const selectedFamily = getFamily(selected.familyId);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b4e37]">All Types</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#2f2118] md:text-5xl">25 种结果宇宙</h1>
        </div>
        <button
          type="button"
          onClick={props.onBack}
          className="rounded-full border border-black/5 bg-white/80 px-5 py-3 font-semibold text-[#594d45] shadow-sm transition hover:bg-white"
        >
          返回
        </button>
      </div>

      <section
        className="mt-6 overflow-hidden rounded-[34px] border border-black/5 p-7 text-white shadow-[0_20px_70px_rgba(43,37,31,0.16)]"
        style={{ backgroundImage: `linear-gradient(135deg, ${selectedFamily.accentFrom}, ${selectedFamily.accentTo})` }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/78">{selected.code}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-4xl font-semibold">{selected.name}</h2>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-white/88">{selected.punchline}</p>
          </div>
          <div className="rounded-[24px] border border-white/20 bg-white/12 px-4 py-3 backdrop-blur">
            <p className="text-sm text-white/75">{selectedFamily.name}</p>
            <p className="mt-1 text-sm leading-6 text-white/82">{selectedFamily.summary}</p>
          </div>
        </div>
        <p className="mt-6 max-w-4xl text-[15px] leading-8 text-white/86">{selected.intro}</p>
      </section>

      <div className="mt-6">
        <FingerprintGrid vector={selected.prototype} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ALL_ARCHETYPES.map((archetype) => (
          <TypeCard
            key={archetype.code}
            archetype={archetype}
            active={archetype.code === props.selectedCode}
            familyLabel
            onClick={() => props.onSelect(archetype.code)}
          />
        ))}
      </div>
    </main>
  );
}

export function CoreSpecRebuildApp() {
  const initial = useMemo(() => loadPersistedQuizState(), []);
  const [answers, setAnswers] = useState(initial.value.answers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    Math.min(initial.value.currentQuestionIndex, QUESTIONS.length - 1),
  );
  const [view, setView] = useState<View>("home");
  const [saveMessage, setSaveMessage] = useState(initial.error);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [selectedCatalogCode, setSelectedCatalogCode] = useState("CTRL");

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

  function handleStart() {
    setCurrentQuestionIndex(getFirstUnansweredIndex(answers));
    setValidationMessage(null);
    setView("quiz");
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
      const matched = matchArchetype(buildScoreVector(answers));
      setSelectedCatalogCode(matched.primary.code === "NOIS" ? matched.similar[0]?.code ?? "CTRL" : matched.primary.code);
      setView("result");
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

    setView("home");
  }

  function handleReset() {
    if (typeof window !== "undefined" && !window.confirm("清空本机草稿并重新开始？")) {
      return;
    }

    const nextAnswers = createEmptyAnswers();
    setAnswers(nextAnswers);
    setCurrentQuestionIndex(0);
    setValidationMessage(null);
    setSelectedCatalogCode("CTRL");
    setView("home");
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
        onRetake={handleReset}
        onBrowseAll={() => {
          setSelectedCatalogCode(result.primary.code === "NOIS" ? result.similar[0]?.code ?? "CTRL" : result.primary.code);
          setView("catalog");
        }}
      />
    );
  }

  if (view === "catalog") {
    return (
      <CatalogView
        selectedCode={selectedCatalogCode}
        onSelect={setSelectedCatalogCode}
        onBack={() => setView(completed ? "result" : "home")}
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
          setView("result");
        }
      }}
      onOpenCatalog={() => setView("catalog")}
      onReset={handleReset}
    />
  );
}
