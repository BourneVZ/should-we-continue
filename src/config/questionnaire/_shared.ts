import type { PrivacyLevel, QuestionMeta, QuestionOption, QuestionType, SensitivityLevel } from "@/domain/types";

function option(code: string): QuestionOption {
  return { code, label: code };
}

export function options(codes: readonly string[]): readonly QuestionOption[] {
  return codes.map(option);
}

export interface QuestionSeed {
  answerKey: string;
  moduleId: string;
  questionType: QuestionType;
  optionCodes?: readonly string[];
  required?: boolean;
  audience?: "user" | "partner";
  phase?: "core" | "deepDive" | "partnerSupport" | "personaAssessment";
  privacy?: PrivacyLevel;
  sensitivity?: SensitivityLevel;
  sourceId?: string;
  visibleWhen?: readonly string[];
}

export function defineQuestion(seed: QuestionSeed): QuestionMeta {
  return {
    id: seed.answerKey,
    answerKey: seed.answerKey,
    audience: seed.audience ?? "user",
    phase: seed.phase ?? "core",
    moduleId: seed.moduleId,
    questionType: seed.questionType,
    title: seed.answerKey,
    options: seed.optionCodes ? options(seed.optionCodes) : undefined,
    required: seed.required ?? false,
    privacy: seed.privacy ?? "private",
    sensitivity: seed.sensitivity ?? "freeText",
    sourceId: seed.sourceId,
    visibleWhen: seed.visibleWhen,
  };
}
