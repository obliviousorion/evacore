import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (typeof body.content !== "string") {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "data", "finalevals.md");
    fs.writeFileSync(filePath, body.content, "utf-8");

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Failed to save finalevals.md:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
