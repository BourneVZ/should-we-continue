import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PartnerDiscussionPage } from "@/features/report/PartnerDiscussionPage";

describe("PartnerDiscussionPage", () => {
  it("renders non-blaming topics, limited commitments, only authorized path lists, and placeholders for unshared items", () => {
    const html = renderToStaticMarkup(
      <PartnerDiscussionPage
        discussionTopicIds={["topic:medical_summary", "topic:partner_needs", "topic:note:1"]}
        commitmentCategoryIds={["medical_support", "financial_support", "emotional_support"]}
        sharedPathContinue={[{ conditionId: "continue-1", status: "pending", labelId: "continue-medical" }]}
        sharedPathEnd={[]}
        unsharedPlaceholderCount={2}
        selectedCommitmentIds={["medical_support"]}
        onToggleCommitment={() => undefined}
      />,
    );

    expect(html).toContain("先把当前医学状态和就医安排说清楚");
    expect(html).toContain("先谈你希望伴侣如何支持，而不是先表态");
    expect(html).toContain("补充你主动愿意分享的第一条重点");
    expect(html).toContain("陪同就医、复诊或处理突发情况");
    expect(html).toContain("一起承担现实支出和预算波动");
    expect(html).toContain("稳定接住情绪，而不是催你马上定论");
    expect(html).toContain("先确认检查、复诊与风险排查安排");
    expect(html).toContain("此项由本人自行确认");
    expect(html).toContain("终止妊娠侧");
    expect(html).not.toContain("人格标签");
    expect(html).not.toContain("量表");
    expect(html).not.toContain("私密回答");
  });
});
