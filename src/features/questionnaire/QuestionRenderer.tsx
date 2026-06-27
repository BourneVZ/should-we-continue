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
    <fieldset className="rounded-2xl border border-accentSoft p-4">
      <legend className="font-medium text-ink">{question.title}</legend>
      {question.required && <p className="text-sm text-slate-600">必答</p>}
      <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
        <input
          checked={value.status === "declined"}
          name={`${question.id}-declined`}
          type="checkbox"
          onChange={(event) => onChange(event.target.checked ? { status: "declined" } : { status: "unanswered" })}
        />
        暂时不想回答
      </label>

      {(question.questionType === "singleSelect" || question.questionType === "scale") && (
        <div className="mt-3 flex flex-col gap-2">
          {question.options?.map((option) => (
            <label key={option.code} className="flex items-center gap-2">
              <input
                checked={answeredValue === option.code}
                name={question.id}
                type="radio"
                value={option.code}
                onChange={() => onChange({ status: "answered", value: option.code })}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}

      {question.questionType === "multiSelect" && (
        <div className="mt-3 flex flex-col gap-2">
          {question.options?.map((option) => {
            const selected = Array.isArray(answeredValue) ? answeredValue : [];
            return (
              <label key={option.code} className="flex items-center gap-2">
                <input
                  checked={selected.includes(option.code)}
                  type="checkbox"
                  value={option.code}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...selected, option.code]
                      : selected.filter((item) => item !== option.code);
                    onChange({ status: "answered", value: next });
                  }}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      )}

      {question.questionType === "date" && (
        <input className="mt-3" type="date" value={typeof answeredValue === "string" ? answeredValue : ""} onChange={handleTextChange} />
      )}

      {question.questionType === "currency" && (
        <input
          className="mt-3"
          type="number"
          value={typeof answeredValue === "number" ? answeredValue : ""}
          onChange={(event) => onChange({ status: "answered", value: Number(event.target.value) })}
        />
      )}

      {question.questionType === "freeText" && (
        <textarea className="mt-3 w-full rounded-xl border border-accentSoft p-3" value={typeof answeredValue === "string" ? answeredValue : ""} onChange={handleTextChange} />
      )}
    </fieldset>
  );
}
