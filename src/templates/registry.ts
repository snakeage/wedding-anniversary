import type { ComponentType } from "react";
import type { EventContent, TemplateId } from "@/content/types";
import { PaperEnvelope } from "@/templates/paper-envelope/PaperEnvelope";
import { QuietLuxury } from "@/templates/quiet-luxury/QuietLuxury";

type TemplateComponent = ComponentType<{ event: EventContent; preview?: boolean }>;

export const templates: Record<TemplateId, TemplateComponent> = {
  "quiet-luxury": QuietLuxury,
  "paper-envelope": PaperEnvelope,
};

export function resolveTemplate(templateId: TemplateId): TemplateComponent {
  const Template = templates[templateId];
  if (!Template) {
    throw new Error(`Unknown templateId: ${templateId}`);
  }
  return Template;
}
