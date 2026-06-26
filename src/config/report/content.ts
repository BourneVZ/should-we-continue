export interface ReportContentEntry {
  contentId: string;
  template: string;
}

export const SHARE_CATEGORY_IDS = [
  "medical_summary",
  "emotional_summary",
  "life_summary",
  "financial_summary",
  "partner_needs",
  "family_boundary_summary",
  "childcare_summary",
  "values_summary",
  "path_conditions",
  "edited_note_summary",
] as const;

export const FORBIDDEN_SHARE_CATEGORY_IDS = [
  "safety",
  "will_direction",
  "free_text_raw",
  "medical_detail",
  "measure_data",
] as const;

export const REPORT_CONTENT: Readonly<Record<string, ReportContentEntry>> = {
  "RPT-DISCLAIMER-DECISION-SUPPORT": {
    contentId: "RPT-DISCLAIMER-DECISION-SUPPORT",
    template: "本报告用于自我梳理和行动准备，不替代医生、心理、法律或安全专业人士，也不替你做妊娠去留决定。",
  },
  "RPT-DISCLAIMER-LOCAL-DATA": {
    contentId: "RPT-DISCLAIMER-LOCAL-DATA",
    template: "回答默认保存在当前浏览器；同一设备的其他使用者可能看到这些内容。",
  },
  "RPT-RED-FLAG-RETURN": {
    contentId: "RPT-RED-FLAG-RETURN",
    template: "返回到更安全的页面入口。",
  },
  "RPT-RED-FLAG-CLEAR": {
    contentId: "RPT-RED-FLAG-CLEAR",
    template: "清除本机数据入口，不暗示数据已安全删除。",
  },
  "RPT-RED-FLAG-SAFE-CONTINUE": {
    contentId: "RPT-RED-FLAG-SAFE-CONTINUE",
    template: "仅在安全条件下继续填写。",
  },
  "RPT-OVERVIEW-INTRO": {
    contentId: "RPT-OVERVIEW-INTRO",
    template: "这份报告先呈现支持需求和信息缺口，不给出路径推荐。",
  },
  "RPT-PERSONA-CALIBRATING": {
    contentId: "RPT-PERSONA-CALIBRATING",
    template: "角色信息仍在校准中，不强行贴标签。",
  },
  "RPT-DIM-LIFE": {
    contentId: "RPT-DIM-LIFE",
    template: "人生发展与节奏需要单独看见，不被其他支持条件掩盖。",
  },
  "RPT-PATH-CONTINUE": {
    contentId: "RPT-PATH-CONTINUE",
    template: "如果继续妊娠，需要确认或补齐的条件。",
  },
  "RPT-PATH-END": {
    contentId: "RPT-PATH-END",
    template: "如果终止妊娠，需要确认或补齐的条件。",
  },
  "RPT-REGION-CARD": {
    contentId: "RPT-REGION-CARD",
    template: "地区事实卡片始终附带来源、日期、适用条件和限制说明。",
  },
  "RPT-REGION-UNAVAILABLE": {
    contentId: "RPT-REGION-UNAVAILABLE",
    template: "地区候选无完整证据或刷新失败时，仅显示通用核对清单。",
  },
  "RPT-SHARE-CONSENT": {
    contentId: "RPT-SHARE-CONSENT",
    template: "每项都需主动选择；未选择即不共享。",
  },
  "RPT-SHARE-PATH-CONSENT": {
    contentId: "RPT-SHARE-PATH-CONSENT",
    template: "另行授权分享两条路径条件，不等于公开个人作答内容。",
  },
  "RPT-SHARE-EDITED-NOTE": {
    contentId: "RPT-SHARE-EDITED-NOTE",
    template: "必须编辑独立摘要，原始备注不会自动带入。",
  },
  "RPT-UNSHARED-PLACEHOLDER": {
    contentId: "RPT-UNSHARED-PLACEHOLDER",
    template: "此项由本人自行确认。",
  },
  "RPT-COMMITMENT": {
    contentId: "RPT-COMMITMENT",
    template: "承诺项只使用预定义类别，帮助讨论可执行支持。",
  },
} as const;
