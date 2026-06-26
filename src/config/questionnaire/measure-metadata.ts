export interface MeasureMetadata {
  measureId: string;
  displayName: string;
  status: "available" | "unavailable";
}

export const MEASURE_METADATA: readonly MeasureMetadata[] = [
  { measureId: "MEASURE-PHQ-2", displayName: "PHQ-2", status: "unavailable" },
  { measureId: "MEASURE-GAD-2", displayName: "GAD-2", status: "unavailable" },
  { measureId: "MEASURE-PHQ-9", displayName: "PHQ-9", status: "unavailable" },
  { measureId: "MEASURE-GAD-7", displayName: "GAD-7", status: "unavailable" },
  { measureId: "MEASURE-IPIP-50", displayName: "IPIP-50", status: "unavailable" },
  { measureId: "MEASURE-GDMS-25", displayName: "GDMS-25", status: "unavailable" },
  { measureId: "MEASURE-ECR-RS-9", displayName: "ECR-RS-9", status: "unavailable" },
];
