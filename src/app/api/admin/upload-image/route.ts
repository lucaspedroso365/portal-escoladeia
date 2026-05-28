import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { nanoid } from "nanoid";
import { getSession } from "@/lib/auth";
import { generateImage } from "@/lib/gemini";

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function saveWebp(buffer: Buffer): Promise<string> {
  const processed = await sharp(buffer)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .webp({ quality: 85 })
    .toBuffer();
  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${nanoid()}.webp`;
  await writeFile(path.join(UPLOAD_DIR, filename), processed);
  return `/uploads/${filename}`;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await saveWebp(buffer);
      return NextResponse.json({ url });
    }

    // JSON body with an Imagen prompt
    const body = (await req.json()) as { prompt?: string };
    if (!body.prompt) {
      return NextResponse.json({ error: "Prompt ausente" }, { status: 400 });
    }
    const imageBuffer = await generateImage(body.prompt);
    const url = await saveWebp(imageBuffer);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[upload-image]", e);
    return NextResponse.json({ error: "Falha ao processar a imagem" }, { status: 500 });
  }
}
