import { GoogleGenerativeAI } from "@google/generative-ai";

export const MODEL_TEXT = "gemini-2.5-flash";
export const MODEL_IMAGE = "imagen-4.0-generate-001";

/**
 * Lazy read of the API key so importing this module never throws at build time.
 */
function getClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY missing");
  return new GoogleGenerativeAI(key);
}

/**
 * Plain text generation. When `useGrounding` is true, Google Search grounding
 * is enabled so the model can use real-time data.
 */
export async function generateText(
  prompt: string,
  useGrounding = false
): Promise<string> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: MODEL_TEXT,
    // googleSearch grounding tool — typed loosely for SDK 0.24.x.
    ...(useGrounding ? ({ tools: [{ googleSearch: {} }] } as never) : {}),
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * JSON generation. With grounding ON we cannot also force responseMimeType
 * (Gemini rejects combining tools + JSON mime), so we rely on the prompt
 * instructing JSON-only output plus the tolerant parser below.
 */
export async function generateJSON<T = unknown>(
  prompt: string,
  useGrounding = false
): Promise<T> {
  const genAI = getClient();
  const config: Record<string, unknown> = { model: MODEL_TEXT };
  if (useGrounding) {
    config.tools = [{ googleSearch: {} }];
  } else {
    config.generationConfig = { responseMimeType: "application/json" };
  }
  const model = genAI.getGenerativeModel(config as never);
  const result = await model.generateContent(prompt);
  return parseJSONLoose<T>(result.response.text());
}

/**
 * Image generation via the Imagen predict endpoint. Returns the raw image
 * bytes as a Buffer (PNG). The caller (upload route) post-processes with sharp.
 */
export async function generateImage(prompt: string): Promise<Buffer> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY missing");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_IMAGE}:predict?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "16:9",
        personGeneration: "allow_adult",
      },
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Imagen error ${res.status}: ${detail}`);
  }
  const data = (await res.json()) as {
    predictions?: { bytesBase64Encoded?: string }[];
  };
  const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error("Imagen returned no image");
  return Buffer.from(b64, "base64");
}

/* -------------------------------------------------------------------------- */
/*  Robust JSON parsing                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Parse JSON from a model response that may be wrapped in markdown fences,
 * prefixed with prose, or truncated mid-array. When the outer array does not
 * close we recover every fully-balanced {...} object we found.
 */
export function parseJSONLoose<T = unknown>(raw: string): T {
  let text = (raw ?? "").trim();

  // Strip ```json ... ``` fences.
  text = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // 1) Optimistic direct parse.
  try {
    return JSON.parse(text) as T;
  } catch {
    /* fall through */
  }

  // 2) Slice to the first JSON token (drops any leading prose).
  const objStart = text.indexOf("{");
  const arrStart = text.indexOf("[");
  let start = -1;
  if (objStart === -1) start = arrStart;
  else if (arrStart === -1) start = objStart;
  else start = Math.min(objStart, arrStart);
  if (start > 0) text = text.slice(start);

  // 3) Parse again after slicing.
  try {
    return JSON.parse(text) as T;
  } catch {
    /* fall through */
  }

  // 4) Truncation recovery for arrays: keep every balanced object.
  if (text[0] === "[") {
    const objects = extractBalancedObjects(text);
    if (objects.length) {
      const parsed: unknown[] = [];
      for (const o of objects) {
        try {
          parsed.push(JSON.parse(o));
        } catch {
          /* skip a malformed fragment */
        }
      }
      if (parsed.length) return parsed as unknown as T;
    }
  }

  // 5) Single-object recovery (grab the first balanced object).
  const objects = extractBalancedObjects(text);
  if (objects.length) {
    try {
      return JSON.parse(objects[0]) as T;
    } catch {
      /* fall through */
    }
  }

  throw new Error("Failed to parse JSON from model response");
}

/**
 * Scan a string and return every top-level balanced {...} object as text,
 * correctly ignoring braces inside strings/escapes. Unbalanced trailing
 * objects (from truncation) are dropped.
 */
function extractBalancedObjects(text: string): string[] {
  const results: string[] = [];
  let depth = 0;
  let inStr = false;
  let esc = false;
  let startIdx = -1;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      continue;
    }
    if (c === "{") {
      if (depth === 0) startIdx = i;
      depth++;
    } else if (c === "}") {
      if (depth > 0) {
        depth--;
        if (depth === 0 && startIdx !== -1) {
          results.push(text.slice(startIdx, i + 1));
          startIdx = -1;
        }
      }
    }
  }
  return results;
}
