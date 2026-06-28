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
        rawNotePreview="raw private note should never render"
        onSelectionChange={() => undefined}
        onSharePathConditionsChange={() => undefined}
        onEditedNoteSummaryChange={() => undefined}
        onConfirm={() => undefined}
      />,
    );

    expect(html).toContain("医学状态摘要");
    expect(html).toContain("路径条件");
    expect(html).toContain("需要重新确认这次共享授权");
    expect(html).toContain("可共享摘要");
    expect(html).toContain("请先填写可共享摘要");
    expect(html).not.toContain("continue-1");
    expect(html).not.toContain("end-1");
    expect(html).not.toContain("raw private note should never render");
    expect(html).not.toContain("medical detail");
    expect(html).not.toContain("real preference");
    expect(html).not.toContain("measure data");
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

    expect(html).toContain('尽快梳理安全与边界保护');
    expect(html).toContain("当前不可共享");
    expect(html).toContain("已禁用");
    expect(html).not.toContain("continue-1");
    expect(html).not.toContain("路径条件");
  });
});
