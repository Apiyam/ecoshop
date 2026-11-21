import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DESTINATION = "https://www.ecopipo.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host === "www.ecopipo.com" || host === "ecopipo.com") {
    return NextResponse.next();
  }

  return NextResponse.redirect(DESTINATION, 307);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
