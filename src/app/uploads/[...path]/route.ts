import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Serves files from /public/uploads at request time. Next 16 only includes
 * files that existed in /public during the build into its static manifest;
 * uploads created at runtime (admin image uploads, Imagen generations) need
 * a dynamic handler to be reachable as /uploads/<file>.
 */

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: parts } = await params;
  if (!parts?.length) return new NextResponse("Not Found", { status: 404 });

  const rel = parts.join("/");
  if (rel.includes("..") || rel.startsWith("/")) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const filePath = path.join(UPLOAD_DIR, rel);
  // Defense in depth: ensure the resolved path stays inside UPLOAD_DIR.
  if (!filePath.startsWith(UPLOAD_DIR + path.sep)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext];
  if (!mime) return new NextResponse("Unsupported Media Type", { status: 415 });

  try {
    const data = await readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
