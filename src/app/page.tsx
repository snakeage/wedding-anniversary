import { redirect } from "next/navigation";
import { demoEvent } from "@/events";

export default function Home() {
  redirect(`/${demoEvent.slug}`);
}
