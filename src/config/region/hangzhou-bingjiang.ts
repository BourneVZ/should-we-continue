export interface RegionConfig {
  regionId: string;
  label: string;
  switchable: boolean;
  cacheTtlDays: number;
}

export interface RegionStaticField {
  fieldId: string;
  cardId: string;
  valueType: string;
  value: string;
  sourceId: string;
  sourceUrl: string;
  lastVerifiedAt: string;
  applicability: readonly string[];
  uncertainty: string;
  scoringUse: "forbidden";
  reportUse: "reference_only";
}

export interface RegionAllowlistEntry {
  allowlistId: string;
  url: string;
  fieldPrefixes: readonly string[];
  fieldIds: readonly string[];
}

export const REGION_CONFIG: RegionConfig = {
  regionId: "CN-ZJ-HZ-BJ",
  label: "杭州滨江",
  switchable: false,
  cacheTtlDays: 7,
};

export const REGION_STATIC_FIELDS: readonly RegionStaticField[] = [
  {
    fieldId: "leave.zj.birth.first",
    cardId: "REGION-CARD-ZJ-LEAVE",
    valueType: "days",
    value: "158",
    sourceId: "SRC-ZJ-POPULATION-LAW-FTU",
    sourceUrl: "https://www.zjftu.org/page/zj_zgh/zj_fwdt/zgh_fwdt_zclj/2022-04-26/38096773135051971.html",
    lastVerifiedAt: "2026-06-26",
    applicability: ["浙江适用，需按劳动关系和单位制度确认"],
    uncertainty: "不对个人资格、薪资或实际休假天数作承诺",
    scoringUse: "forbidden",
    reportUse: "reference_only",
  },
  {
    fieldId: "leave.cn.miscarriage_under_4_months",
    cardId: "REGION-CARD-CN-LEAVE",
    valueType: "days",
    value: "15",
    sourceId: "SRC-MOJ-WOMEN-LABOR",
    sourceUrl: "https://xzfg.moj.gov.cn/law/download?LawID=343&type=pdf",
    lastVerifiedAt: "2026-06-26",
    applicability: ["中国法规背景，需由单位或专业人员核实适用情况"],
    uncertainty: "不解释孕周、医疗情形或实际休假资格",
    scoringUse: "forbidden",
    reportUse: "reference_only",
  },
  {
    fieldId: "benefit.hz.under3_annual",
    cardId: "REGION-CARD-HZ-CHILD-BENEFIT",
    valueType: "currency_cny_per_year",
    value: "3600",
    sourceId: "SRC-HZ-BIRTH-ALLOWANCE",
    sourceUrl: "https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml",
    lastVerifiedAt: "2026-06-26",
    applicability: ["年龄、户籍、申请时点等条件需另行核对"],
    uncertainty: "不对当前用户资格、累计金额或发放周期作承诺",
    scoringUse: "forbidden",
    reportUse: "reference_only",
  },
] as const;

export const REGION_ALLOWLIST: readonly RegionAllowlistEntry[] = [
  {
    allowlistId: "WL-ZJ-LEAVE",
    url: "https://www.zjftu.org/page/zj_zgh/zj_fwdt/zgh_fwdt_zclj/2022-04-26/38096773135051971.html",
    fieldPrefixes: ["leave.zj."],
    fieldIds: [],
  },
  {
    allowlistId: "WL-CN-WOMEN-LABOR",
    url: "https://xzfg.moj.gov.cn/law/download?LawID=343&type=pdf",
    fieldPrefixes: ["leave.cn."],
    fieldIds: [],
  },
  {
    allowlistId: "WL-HZ-ALLOWANCE",
    url: "https://www.nhsa.gov.cn/art/2025/5/14/art_52_16510.html",
    fieldPrefixes: [],
    fieldIds: ["benefit.hz.allowance_direct_payment"],
  },
  {
    allowlistId: "WL-HZ-SERVICE-PACK",
    url: "https://www.nhsa.gov.cn/art/2026/2/12/art_14_19662.html",
    fieldPrefixes: [],
    fieldIds: ["benefit.hz.birth_service_package"],
  },
  {
    allowlistId: "WL-HZ-CHILD-BENEFIT",
    url: "https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml",
    fieldPrefixes: [],
    fieldIds: [
      "benefit.hz.second_child_one_time",
      "benefit.hz.third_child_one_time",
      "benefit.hz.under3_annual",
    ],
  },
] as const;
