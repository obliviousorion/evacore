import { NextRequest, NextResponse } from "next/server";
import { getScheduleEvents, saveScheduleEvents } from "@/lib/parseEvals";
import { ScheduleEvent } from "@/lib/types";

export async function GET() {
  const events = getScheduleEvents();
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events: ScheduleEvent[] = body.events;
    if (!Array.isArray(events)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    saveScheduleEvents(events);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
