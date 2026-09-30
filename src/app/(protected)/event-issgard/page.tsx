import type { Metadata } from "next";
import EventIssgard from "@/components/event-issgard/EventIssgard";

export const metadata: Metadata = {
  title: "Event Issgard | Cenlab",
  description: "Angel and Demon monster lists from the first sheet of each Excel file.",
};

export default function EventIssgardPage() {
  return <EventIssgard />;
}
