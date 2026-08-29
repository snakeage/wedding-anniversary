import type { ComponentType } from "react";
import type { EventContent, TemplateId } from "@/content/types";
import { QuietLuxury } from "@/templates/quiet-luxury/QuietLuxury";

type TemplateComponent = ComponentType<{ event: EventContent }>;

export const templates: Record<TemplateId, TemplateComponent> = {
  "quiet-luxury": QuietLuxury,
};

export function resolveTemplate(templateId: TemplateId): TemplateComponent {
  const Template = templates[templateId];
  if (!Template) {
    throw new Error(`Unknown templateId: ${templateId}`);
  }
  return Template;
}
