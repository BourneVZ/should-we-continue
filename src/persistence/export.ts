import type { ReportViewModel, SharedDiscussionInput } from "@/domain/types";

export function exportPersonalMarkdown(report: ReportViewModel): string {
  const lines = [
    "# Personal Report",
    "",
    `Red Flag Level: ${report.redFlag.level}`,
    `Priority Actions: ${report.priorityActionIds.join(", ") || "none"}`,
    `Primary Persona: ${report.persona.primaryPersonaId ?? "none"}`,
    `Secondary Persona: ${report.persona.secondaryPersonaId ?? "none"}`,
    `Status Tags: ${report.persona.statusTagIds.join(", ") || "none"}`,
  ];

  return lines.join("\n");
}

export function exportDiscussionMarkdown(discussion: SharedDiscussionInput): string {
  const lines = [
    "# Shared Discussion",
    "",
    `Summary IDs: ${discussion.summaryIds.join(", ") || "none"}`,
    `Continue Path Conditions: ${discussion.pathContinue.map((item) => item.conditionId).join(", ") || "none"}`,
    `End Path Conditions: ${discussion.pathEnd.map((item) => item.conditionId).join(", ") || "none"}`,
    `Shared Notes: ${discussion.sharedNotes.join(" | ") || "none"}`,
  ];

  return lines.join("\n");
}
