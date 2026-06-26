import { describe, expect, it } from "vitest";
import type { AnswerValue } from "@/domain/types";
import { getAnswerStatus, isAnswerComputable, validateRequiredAnswer } from "@/domain/answers";

describe("getAnswerStatus", () => {
  it("distinguishes the four answer states", () => {
    expect(getAnswerStatus({ status: "answered", value: "yes" })).toBe("answered");
    expect(getAnswerStatus({ status: "uncertain" })).toBe("uncertain");
    expect(getAnswerStatus({ status: "declined" })).toBe("declined");
    expect(getAnswerStatus(undefined)).toBe("unanswered");
  });
});

describe("validateRequiredAnswer", () => {
  it("allows answered, uncertain, and declined states for required questions", () => {
    expect(validateRequiredAnswer({ status: "answered", value: 1 }, true).ok).toBe(true);
    expect(validateRequiredAnswer({ status: "uncertain" }, true).ok).toBe(true);
    expect(validateRequiredAnswer({ status: "declined" }, true).ok).toBe(true);
  });

  it("blocks unanswered required questions", () => {
    expect(validateRequiredAnswer(undefined, true)).toEqual({
      ok: false,
      reason: "required-unanswered",
    });
  });
});

describe("isAnswerComputable", () => {
  it("only treats answered values as computable", () => {
    const answered: AnswerValue = { status: "answered", value: "yes" };
    expect(isAnswerComputable(answered)).toBe(true);
    expect(isAnswerComputable({ status: "uncertain" })).toBe(false);
    expect(isAnswerComputable({ status: "declined" })).toBe(false);
    expect(isAnswerComputable({ status: "unanswered" })).toBe(false);
  });
});
