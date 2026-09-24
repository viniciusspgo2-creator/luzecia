import { NextResponse } from "next/server";
import { recordVisit } from "@/lib/visits";

/**
 * POST /api/visit — registra uma visualização de página pública.
 * Corpo: { path: string }. Validações básicas anti-abuso.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { path?: unknown };
    const path = typeof body.path === "string" ? body.path : "";

    if (
      !path ||
      path.length > 200 ||
      !path.startsWith("/") ||
      path.startsWith("//") ||
      path.startsWith("/admin") ||
      path.startsWith("/api")
    ) {
      return new NextResponse(null, { status: 400 });
    }

    await recordVisit(path);
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
