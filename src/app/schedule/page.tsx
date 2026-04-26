import { getScheduleEvents } from "@/lib/parseEvals";
import ScheduleView from "@/components/ScheduleView/ScheduleView";

export default function SchedulePage() {
  const initialEvents = getScheduleEvents();
  return <ScheduleView initialEvents={initialEvents} />;
}
