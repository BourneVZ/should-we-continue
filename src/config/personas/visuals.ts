export interface PersonaVisualEntry {
  iconId: string;
  illustrationPath: string;
  alt: string;
  palette: readonly string[];
  suppressForRedFlagLevels: readonly ["R3", "R4"];
}

export const PERSONA_VISUALS: Readonly<Record<string, PersonaVisualEntry>> = {
  P01: { iconId: "compass", illustrationPath: "/personas/P01.svg", alt: "雾灯校准师的抽象插画", palette: ["#0f766e", "#99f6e4"], suppressForRedFlagLevels: ["R3", "R4"] },
  P02: { iconId: "list-checks", illustrationPath: "/personas/P02.svg", alt: "清单抱枕的抽象插画", palette: ["#0f766e", "#ccfbf1"], suppressForRedFlagLevels: ["R3", "R4"] },
  P03: { iconId: "wind", illustrationPath: "/personas/P03.svg", alt: "风向捕手的抽象插画", palette: ["#115e59", "#a7f3d0"], suppressForRedFlagLevels: ["R3", "R4"] },
  P04: { iconId: "hand-heart", illustrationPath: "/personas/P04.svg", alt: "软垫筑巢师的抽象插画", palette: ["#be123c", "#fecdd3"], suppressForRedFlagLevels: ["R3", "R4"] },
  P05: { iconId: "origami", illustrationPath: "/personas/P05.svg", alt: "心事折纸师的抽象插画", palette: ["#9f1239", "#fbcfe8"], suppressForRedFlagLevels: ["R3", "R4"] },
  P06: { iconId: "pause-circle", illustrationPath: "/personas/P06.svg", alt: "呼吸留白师的抽象插画", palette: ["#881337", "#fda4af"], suppressForRedFlagLevels: ["R3", "R4"] },
  P07: { iconId: "car-front", illustrationPath: "/personas/P07.svg", alt: "副驾召唤师的抽象插画", palette: ["#b45309", "#fde68a"], suppressForRedFlagLevels: ["R3", "R4"] },
  P08: { iconId: "clipboard-check", illustrationPath: "/personas/P08.svg", alt: "承诺验收员的抽象插画", palette: ["#92400e", "#fef3c7"], suppressForRedFlagLevels: ["R3", "R4"] },
  P09: { iconId: "fence", illustrationPath: "/personas/P09.svg", alt: "边界园丁的抽象插画", palette: ["#78350f", "#fde68a"], suppressForRedFlagLevels: ["R3", "R4"] },
  P10: { iconId: "clapperboard", illustrationPath: "/personas/P10.svg", alt: "未来预告片导演的抽象插画", palette: ["#166534", "#bbf7d0"], suppressForRedFlagLevels: ["R3", "R4"] },
  P11: { iconId: "sparkles", illustrationPath: "/personas/P11.svg", alt: "火花守夜人的抽象插画", palette: ["#15803d", "#dcfce7"], suppressForRedFlagLevels: ["R3", "R4"] },
  P12: { iconId: "hammer", illustrationPath: "/personas/P12.svg", alt: "地基巡检员的抽象插画", palette: ["#14532d", "#86efac"], suppressForRedFlagLevels: ["R3", "R4"] },
} as const;
