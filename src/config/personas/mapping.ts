export interface PersonaFeatureMapping {
  sourceId: "SPEC-PERSONAS";
  key: string;
  weight: number;
}

export interface PersonaMappingEntry {
  personaId: string;
  minimumScore: number;
  features: readonly PersonaFeatureMapping[];
}

export const PERSONA_MAPPING: readonly PersonaMappingEntry[] = [
  {
    personaId: "P01",
    minimumScore: 55,
    features: [
      { key: "Q-ROLE-FACT-CHECK", weight: 60, sourceId: "SPEC-PERSONAS" },
      { key: "gap:personalWillClaritySupport", weight: 25, sourceId: "SPEC-PERSONAS" },
      { key: "Q-ROLE-CHANGE-SENSITIVITY", weight: 15, sourceId: "SPEC-PERSONAS" },
    ],
  },
  {
    personaId: "P02",
    minimumScore: 55,
    features: [
      { key: "Q-ROLE-PLAN-LIST", weight: 55, sourceId: "SPEC-PERSONAS" },
      { key: "gap:financialPolicySupport", weight: 20, sourceId: "SPEC-PERSONAS" },
      { key: "gap:childcareLoadSupport", weight: 15, sourceId: "SPEC-PERSONAS" },
      { key: "gap:partnerCommitmentSupport", weight: 10, sourceId: "SPEC-PERSONAS" },
    ],
  },
  {
    personaId: "P03",
    minimumScore: 55,
    features: [
      { key: "Q-ROLE-CHANGE-SENSITIVITY", weight: 60, sourceId: "SPEC-PERSONAS" },
      { key: "gap:personalWillClaritySupport", weight: 25, sourceId: "SPEC-PERSONAS" },
      { key: "Q-ROLE-FACT-CHECK", weight: 15, sourceId: "SPEC-PERSONAS" },
    ],
  },
  {
    personaId: "P04",
    minimumScore: 55,
    features: [
      { key: "Q-ROLE-NEED-SUPPORT", weight: 65, sourceId: "SPEC-PERSONAS" },
      { key: "gap:partnerCommitmentSupport", weight: 20, sourceId: "SPEC-PERSONAS" },
      { key: "gap:familySocialSupport", weight: 15, sourceId: "SPEC-PERSONAS" },
    ],
  },
  {
    personaId: "P05",
    minimumScore: 55,
    features: [
      { key: "Q-ROLE-EMOTION-EXPRESSION", weight: 70, sourceId: "SPEC-PERSONAS" },
      { key: "Q-ROLE-NEED-SUPPORT", weight: 15, sourceId: "SPEC-PERSONAS" },
      { key: "Q-ROLE-NEED-SPACE", weight: 15, sourceId: "SPEC-PERSONAS" },
    ],
  },
  {
    personaId: "P06",
    minimumScore: 55,
    features: [
      { key: "Q-ROLE-NEED-SPACE", weight: 70, sourceId: "SPEC-PERSONAS" },
      { key: "gap:personalWillClaritySupport", weight: 15, sourceId: "SPEC-PERSONAS" },
      { key: "Q-ROLE-EMOTION-EXPRESSION", weight: 15, sourceId: "SPEC-PERSONAS" },
    ],
  },
  {
    personaId: "P07",
    minimumScore: 55,
    features: [
      { key: "Q-ROLE-SHARED-PARTICIPATION", weight: 70, sourceId: "SPEC-PERSONAS" },
      { key: "gap:partnerCommitmentSupport", weight: 30, sourceId: "SPEC-PERSONAS" },
    ],
  },
  {
    personaId: "P08",
    minimumScore: 55,
    features: [
      { key: "Q-ROLE-COMMITMENT-EVIDENCE", weight: 70, sourceId: "SPEC-PERSONAS" },
      { key: "gap:partnerCommitmentSupport", weight: 30, sourceId: "SPEC-PERSONAS" },
    ],
  },
  {
    personaId: "P09",
    minimumScore: 55,
    features: [
      { key: "Q-ROLE-BOUNDARY-NEED", weight: 70, sourceId: "SPEC-PERSONAS" },
      { key: "gap:familySocialSupport", weight: 30, sourceId: "SPEC-PERSONAS" },
    ],
  },
  {
    personaId: "P10",
    minimumScore: 55,
    features: [
      { key: "Q-ROLE-LONG-TERM-REVIEW", weight: 70, sourceId: "SPEC-PERSONAS" },
      { key: "gap:personalWillClaritySupport", weight: 30, sourceId: "SPEC-PERSONAS" },
    ],
  },
  {
    personaId: "P11",
    minimumScore: 55,
    features: [
      { key: "Q-ROLE-LIFE-CONTINUITY", weight: 70, sourceId: "SPEC-PERSONAS" },
      { key: "gap:lifeDevelopmentSupport", weight: 30, sourceId: "SPEC-PERSONAS" },
    ],
  },
  {
    personaId: "P12",
    minimumScore: 55,
    features: [
      { key: "Q-ROLE-RESOURCE-CAPACITY", weight: 60, sourceId: "SPEC-PERSONAS" },
      { key: "gap:financialPolicySupport", weight: 25, sourceId: "SPEC-PERSONAS" },
      { key: "gap:childcareLoadSupport", weight: 15, sourceId: "SPEC-PERSONAS" },
    ],
  },
] as const;
