import type { RedFlagLevel } from "@/domain/types";

export interface SafetyRule {
  ruleId: string;
  level: RedFlagLevel;
  answerKeys: readonly string[];
  actionId: string;
  when: readonly string[];
}

export const SAFETY_RULES: readonly SafetyRule[] = [
  { ruleId: "RF-R4-SELF-UNSAFE", level: "R4", answerKeys: ["Q-SAFE-SELF-HARM"], actionId: "ACT-URGENT-MENTAL", when: ["Q-SAFE-SELF-HARM=unsafe_now"] },
  { ruleId: "RF-R4-UNSAFE-FILLING", level: "R4", answerKeys: ["Q-SAFE-FREE-ANSWER"], actionId: "ACT-URGENT-SAFETY", when: ["Q-SAFE-FREE-ANSWER=unsafe"] },
  { ruleId: "RF-R4-URGENT-GENERAL", level: "R4", answerKeys: ["Q-SAFE-URGENT-SYMPTOM"], actionId: "ACT-URGENT-MEDICAL", when: ["Q-SAFE-URGENT-SYMPTOM=severe"] },
  { ruleId: "RF-R4-SEVERE-PAIN", level: "R4", answerKeys: ["Q-MED-PREGNANCY-CONFIRMED", "Q-MED-ABDOMINAL-PAIN"], actionId: "ACT-URGENT-MEDICAL", when: ["Q-MED-PREGNANCY-CONFIRMED in {confirmed,possible}", "Q-MED-ABDOMINAL-PAIN=severe_or_one_sided"] },
  { ruleId: "RF-R4-HEAVY-BLEEDING", level: "R4", answerKeys: ["Q-MED-PREGNANCY-CONFIRMED", "Q-MED-BLEEDING"], actionId: "ACT-URGENT-MEDICAL", when: ["Q-MED-PREGNANCY-CONFIRMED in {confirmed,possible}", "Q-MED-BLEEDING=heavy_or_with_pain_dizziness"] },
  { ruleId: "RF-R4-SYMPTOM-COMBINATION", level: "R4", answerKeys: ["Q-MED-PREGNANCY-CONFIRMED", "Q-MED-ABDOMINAL-PAIN", "Q-MED-ASSOCIATED-SYMPTOMS"], actionId: "ACT-URGENT-MEDICAL", when: ["Q-MED-PREGNANCY-CONFIRMED in {confirmed,possible}", "Q-MED-ABDOMINAL-PAIN in {clear_or_persistent,severe_or_one_sided}", "Q-MED-ASSOCIATED-SYMPTOMS=clear_one_or_more"] },
  { ruleId: "RF-R3-SELF-THOUGHT", level: "R3", answerKeys: ["Q-SAFE-SELF-HARM"], actionId: "ACT-SOON-MENTAL", when: ["Q-SAFE-SELF-HARM=passing_but_safe"] },
  { ruleId: "RF-R3-COERCION", level: "R3", answerKeys: ["Q-SAFE-COERCION", "Q-PARTNER-CONTROL-RISK"], actionId: "ACT-SOON-SAFETY", when: ["Q-SAFE-COERCION=pressure_or_fear || Q-PARTNER-CONTROL-RISK=pressure_or_fear"] },
  { ruleId: "RF-R3-MEDICAL-NOT-CONFIRMED", level: "R3", answerKeys: ["Q-MED-INTRAUTERINE-CONFIRMED", "Q-MED-ABDOMINAL-PAIN", "Q-MED-BLEEDING"], actionId: "ACT-SOON-MEDICAL", when: ["Q-MED-INTRAUTERINE-CONFIRMED in {not_confirmed,not_yet_confirmable}", "Q-MED-ABDOMINAL-PAIN in {clear_or_persistent,severe_or_one_sided} || Q-MED-BLEEDING in {clear,heavy_or_with_pain_dizziness}"] },
  { ruleId: "RF-R3-CLINICIAN-URGENT", level: "R3", answerKeys: ["Q-MED-CLINICIAN-RISK"], actionId: "ACT-SOON-MEDICAL", when: ["Q-MED-CLINICIAN-RISK=urgent_follow_up"] },
  { ruleId: "RF-R3-NO-CARE-PLAN", level: "R3", answerKeys: ["Q-MED-PREGNANCY-CONFIRMED", "Q-MED-GESTATION-ESTIMATE", "Q-MED-CARE-PLAN"], actionId: "ACT-SOON-MEDICAL", when: ["Q-MED-PREGNANCY-CONFIRMED=confirmed", "Q-MED-GESTATION-ESTIMATE=over12", "Q-MED-CARE-PLAN=none"] },
  { ruleId: "RF-R3-MENTAL-FUNCTION", level: "R3", answerKeys: ["Q-MH-FUNCTION-IMPACT", "Q-MH-MOOD-LOW", "Q-MH-WORRY-HIGH", "Q-MH-SAFE-CONTACT"], actionId: "ACT-SOON-MENTAL", when: ["Q-MH-FUNCTION-IMPACT=SA", "Q-MH-MOOD-LOW=SA || Q-MH-WORRY-HIGH=SA", "Q-MH-SAFE-CONTACT in {SD,D,U}"] },
  { ruleId: "RF-R2-AUTONOMY-PRESSURE", level: "R2", answerKeys: ["Q-SAFE-COERCION", "Q-PARTNER-CONTROL-RISK"], actionId: "ACT-CLARIFY-AUTONOMY", when: ["Q-SAFE-COERCION=pressure_no_fear || Q-PARTNER-CONTROL-RISK=pressure_no_fear"] },
  { ruleId: "RF-R2-MEDICAL-GAP", level: "R2", answerKeys: ["Q-MED-PREGNANCY-CONFIRMED", "Q-MED-INTRAUTERINE-CONFIRMED", "Q-MED-CARE-PLAN"], actionId: "ACT-CLARIFY-MEDICAL", when: ["Q-MED-PREGNANCY-CONFIRMED in {possible,unknown} || (Q-MED-INTRAUTERINE-CONFIRMED in {not_confirmed,not_yet_confirmable,unknown} && Q-MED-CARE-PLAN in {none,unknown})"] },
  { ruleId: "RF-R2-WILL-PRESSURE", level: "R2", answerKeys: ["Q-WILL-SELF-VS-OTHERS"], actionId: "ACT-CLARIFY-WILL", when: ["Q-WILL-SELF-VS-OTHERS in {SD,D}"] },
  { ruleId: "RF-R2-MENTAL-SUPPORT-GAP", level: "R2", answerKeys: ["Q-MH-FUNCTION-IMPACT", "Q-MH-SAFE-CONTACT"], actionId: "ACT-CLARIFY-MENTAL", when: ["Q-MH-FUNCTION-IMPACT in {A,SA}", "Q-MH-SAFE-CONTACT in {SD,D,U}"] },
  { ruleId: "RF-R1-MILD-MEDICAL", level: "R1", answerKeys: ["Q-SAFE-URGENT-SYMPTOM", "Q-MED-ABDOMINAL-PAIN", "Q-MED-BLEEDING", "Q-MED-ASSOCIATED-SYMPTOMS"], actionId: "ACT-WATCH-MEDICAL", when: ["Q-SAFE-URGENT-SYMPTOM=mild || Q-MED-ABDOMINAL-PAIN=mild || Q-MED-BLEEDING=small || Q-MED-ASSOCIATED-SYMPTOMS=mild_one"] },
  { ruleId: "RF-R1-PRIVACY", level: "R1", answerKeys: ["Q-SAFE-PRIVACY-RISK"], actionId: "ACT-WATCH-PRIVACY", when: ["Q-SAFE-PRIVACY-RISK in {some,high}"] },
  { ruleId: "RF-R1-FAMILY-BOUNDARY", level: "R1", answerKeys: ["Q-FAMILY-BOUNDARY-PRESSURE"], actionId: "ACT-WATCH-BOUNDARY", when: ["Q-FAMILY-BOUNDARY-PRESSURE in {A,SA}"] },
  { ruleId: "RF-R1-EMOTIONAL-PRESSURE", level: "R1", answerKeys: ["Q-MH-MOOD-LOW", "Q-MH-WORRY-HIGH"], actionId: "ACT-WATCH-MENTAL", when: ["Q-MH-MOOD-LOW in {A,SA} || Q-MH-WORRY-HIGH in {A,SA}"] },
] as const;
