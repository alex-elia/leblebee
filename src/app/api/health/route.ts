import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "leblebee",
    time: new Date().toISOString(),
  });
}
