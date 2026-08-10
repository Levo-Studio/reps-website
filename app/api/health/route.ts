import { NextResponse } from "next/server";

// Public, unauthenticated liveness probe. Always 200 while the process is
// alive; no dependency access. The container HEALTHCHECK points here.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "reps-website-levo-studio",
    timestamp: new Date().toISOString(),
  });
}
