import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PartnerDiscussionPage } from "@/features/report/PartnerDiscussionPage";

describe("PartnerDiscussionPage", () => {
  it("renders three non-blaming topics, limited commitments, only authorized path lists, and placeholders for unshared items", () => {
    const html = renderToStaticMarkup(
      <PartnerDiscussionPage
        discussionTopicIds={["topic:medical_summary", "topic:partner_needs", "topic:note:1"]}
        commitmentCategoryIds={["medical_support", "financial_support", "emotional_support"]}
        sharedPathContinue={[{ conditionId: "continue-1", status: "pending", labelId: "RPT-PATH-CONTINUE" }]}
        sharedPathEnd={[]}
        unsharedPlaceholderCount={2}
        selectedCommitmentIds={["medical_support"]}
        onToggleCommitment={() => undefined}
      />,
    );

    expect(html).toContain("topic:medical_summary");
    expect(html).toContain("topic:partner_needs");
    expect(html).toContain("topic:note:1");
    expect(html).toContain("medical_support");
    expect(html).toContain("financial_support");
    expect(html).toContain("emotional_support");
    expect(html).toContain("continue-1");
    expect(html).toContain("此项由本人自行确认");
    expect(html).not.toContain("end-1");
    expect(html).not.toContain("人格标签");
    expect(html).not.toContain("量表");
    expect(html).not.toContain("私密回答");
    expect(html).not.toContain("投票");
    expect(html).not.toContain("更适合");
    expect(html).not.toContain("负责人");
    expect(html).not.toContain("截止");
  });
});
