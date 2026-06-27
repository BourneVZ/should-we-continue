import type { ChangeEvent, ReactElement } from "react";
import type { AnswerValue, PrimitiveAnswer, QuestionMeta } from "@/domain/types";

interface QuestionRendererProps {
  question: QuestionMeta;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

function getAnsweredValue(value: AnswerValue): PrimitiveAnswer | PrimitiveAnswer[] | null {
  return value.status === "answered" ? value.value : null;
}

export function QuestionRenderer({ question, value, onChange }: QuestionRendererProps): ReactElement {
  const answeredValue = getAnsweredValue(value);

  const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    onChange({ status: "answered", value: event.target.value });
  };

  return (
    <fieldset className="rounded-[26px] border border-[#dde8e4] bg-white p-5 shadow-[0_10px_30px_rgba(24,54,67,0.05)] md:p-6">
      <legend className="sr-only">{question.title}</legend>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex rounded-full bg-[#edf5ef] px-3.5 py-1.5 text-xs font-semibold text-[#486d56] md:text-sm">
            {question.required ? "必答题" : "可跳过"}
          </div>
          <h2 className="mt-4 text-xl font-semibold leading-8 text-slate-900 md:text-[1.75rem] md:leading-10">
            {question.title}
          </h2>
        </div>
      </div>

      <label className="mt-4 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
        <input
          checked={value.status === "declined"}
          className="h-4 w-4 accent-sky-700"
          name={`${question.id}-declined`}
          type="checkbox"
          onChange={(event) => onChange(event.target.checked ? { status: "declined" } : { status: "unanswered" })}
        />
        这题我暂时不想回答
      </label>

      {(question.questionType === "singleSelect" || question.questionType === "scale") && (
        <div className="mt-5 grid gap-3">
          {question.options?.map((option, index) => (
            <label
              key={option.code}
              className="group flex cursor-pointer items-center gap-4 rounded-[20px] border border-slate-200 bg-white px-4 py-4 transition hover:border-sky-300 hover:bg-sky-50/40"
            >
              <input
                checked={answeredValue === option.code}
                className="sr-only"
                name={question.id}
                type="radio"
                value={option.code}
                onChange={() => onChange({ status: "answered", value: option.code })}
              />
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef4f1] text-base font-semibold text-slate-700 group-has-[:checked]:bg-sky-700 group-has-[:checked]:text-white">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-base leading-7 text-slate-900">{option.label}</span>
            </label>
          ))}
        </div>
      )}

      {question.questionType === "multiSelect" && (
        <div className="mt-5 grid gap-3">
          {question.options?.map((option) => {
            const selected = Array.isArray(answeredValue) ? answeredValue : [];
            return (
              <label
                key={option.code}
                className="flex cursor-pointer items-center gap-4 rounded-[20px] border border-slate-200 bg-white px-4 py-4 transition hover:border-sky-300 hover:bg-sky-50/40"
              >
                <input
                  checked={selected.includes(option.code)}
                  className="h-5 w-5 accent-sky-700"
                  type="checkbox"
                  value={option.code}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...selected, option.code]
                      : selected.filter((item) => item !== option.code);
                    onChange({ status: "answered", value: next });
                  }}
                />
                <span className="text-base leading-7 text-slate-900">{option.label}</span>
              </label>
            );
          })}
        </div>
      )}

      {question.questionType === "date" && (
        <input
          className="mt-5 w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900"
          type="date"
          value={typeof answeredValue === "string" ? answeredValue : ""}
          onChange={handleTextChange}
        />
      )}

      {question.questionType === "currency" && (
        <input
          className="mt-5 w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900"
          type="number"
          placeholder="输入估算金额"
          value={typeof answeredValue === "number" ? answeredValue : ""}
          onChange={(event) => onChange({ status: "answered", value: Number(event.target.value) })}
        />
      )}

      {question.questionType === "freeText" && (
        <textarea
          className="mt-5 min-h-28 w-full rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-base leading-7 text-slate-900"
          placeholder="如果愿意，可以用自己的话补充。"
          value={typeof answeredValue === "string" ? answeredValue : ""}
          onChange={handleTextChange}
        />
      )}
    </fieldset>
  );
}
