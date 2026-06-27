import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SharingScreen } from "@/features/sharing/SharingScreen";
import { createReportViewModel } from "../fixtures/factories";

describe("SharingScreen", () => {
  it("defaults to no sharing, requires separate path consent and edited summary, and does not reveal private source text", () => {
    const html = renderToStaticMarkup(
      <SharingScreen
        report={createReportViewModel({
          pathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "RPT-PATH-CONTINUE" }],
          pathEnd: [{ conditionId: "end-1", status: "confirmed", labelId: "RPT-PATH-END" }],
        })}
        selectedSummaryIds={["medical_summary", "edited_note_summary"]}
        sharePathConditions={false}
        editedNoteSummary=""
        requireReauthorization={true}
        rawNotePreview="原始备注不应直接显示"
        onSelectionChange={() => undefined}
        onSharePathConditionsChange={() => undefined}
        onEditedNoteSummaryChange={() => undefined}
        onConfirm={() => undefined}
      />,
    );

    expect(html).toContain("medical_summary");
    expect(html).toContain("path_conditions");
    expect(html).toContain("重新授权");
    expect(html).toContain("编辑摘要");
    expect(html).toContain("disabled");
    expect(html).not.toContain("checked");
    expect(html).not.toContain("continue-1");
    expect(html).not.toContain("end-1");
    expect(html).not.toContain("原始备注不应直接显示");
    expect(html).not.toContain("医疗详情");
    expect(html).not.toContain("真实倾向");
    expect(html).not.toContain("量表");
  });

  it("shows risk-disabled messaging instead of active sharing controls for R3 or R4", () => {
    const html = renderToStaticMarkup(
      <SharingScreen
        report={createReportViewModel({
          redFlag: { level: "R3", actionIds: ["ACT-SOON-SAFETY"] },
        })}
        selectedSummaryIds={[]}
        sharePathConditions={false}
        editedNoteSummary=""
        requireReauthorization={false}
        onSelectionChange={() => undefined}
        onSharePathConditionsChange={() => undefined}
        onEditedNoteSummaryChange={() => undefined}
        onConfirm={() => undefined}
      />,
    );

    expect(html).toContain("ACT-SOON-SAFETY");
    expect(html).toContain("disabled");
    expect(html).not.toContain("continue-1");
    expect(html).not.toContain("path_conditions");
  });
});
