import { demoEvent } from "@/events";
import { resolveTemplate } from "@/templates/registry";

export default function Home() {
  const Template = resolveTemplate(demoEvent.templateId);
  return <Template event={demoEvent} />;
}
