import { describe, expect, it } from "vitest";
import { QUESTION_CATALOG } from "@/config/questionnaire";
import { getQuestionnaireSnapshot, isDeepDiveModuleComplete, validateQuestionPage } from "@/domain/questionnaire";
import { createAnswered } from "../fixtures/factories";

describe("getQuestionnaireSnapshot", () => {
  it("resolves visible questions from declarative conditions", () => {
    const snapshot = getQuestionnaireSnapshot({
      questions: QUESTION_CATALOG,
      answers: {
        "Q-CHILD-COUNT": createAnswered("none"),
      },
      moduleId: "childcare",
    });

    expect(snapshot.visibleQuestions.map((question) => question.answerKey)).toEqual(["Q-CHILD-COUNT"]);
  });

  it("keeps every questionnaire page to a single focused question", () => {
    const safetySnapshot = getQuestionnaireSnapshot({
      questions: QUESTION_CATALOG,
      answers: {},
      moduleId: "safety",
    });
    const medicalSnapshot = getQuestionnaireSnapshot({
      questions: QUESTION_CATALOG,
      answers: {},
      moduleId: "medical",
    });

    expect(safetySnapshot.pages.every((page) => page.length === 1)).toBe(true);
    expect(medicalSnapshot.pages.every((page) => page.length === 1)).toBe(true);
  });

  it("computes exact progress from currently visible questions", () => {
    const snapshot = getQuestionnaireSnapshot({
      questions: QUESTION_CATALOG,
      answers: {
        "Q-MED-PREGNANCY-CONFIRMED": createAnswered("confirmed"),
        "Q-MED-ABDOMINAL-PAIN": createAnswered("none"),
      },
      moduleId: "medical",
    });

    expect(snapshot.answeredCount).toBe(2);
    expect(snapshot.totalVisibleCount).toBe(snapshot.visibleQuestions.length);
  });
});

describe("validateQuestionPage", () => {
  it("blocks navigation when a required visible question is still unanswered", () => {
    const snapshot = getQuestionnaireSnapshot({
      questions: QUESTION_CATALOG,
      answers: {},
      moduleId: "safety",
    });

    expect(validateQuestionPage(snapshot.pages[0], {})).toEqual({
      ok: false,
      missingAnswerKeys: ["Q-SAFE-FREE-ANSWER"],
    });
  });
});

describe("isDeepDiveModuleComplete", () => {
  it("requires every visible question in a deep-dive module to be answered, uncertain, or declined", () => {
    expect(
      isDeepDiveModuleComplete({
        questions: QUESTION_CATALOG,
        answers: {
          "Q-DEEP-MED-NEXT-STEPS": createAnswered("yes"),
        },
        moduleId: "medical-deep",
      }),
    ).toBe(false);
  });
});
