/**
 * Wrap any DB query so a database hiccup never crashes a page render.
 * Always provide a sensible fallback (usually [] or null).
 */
export async function safeQuery<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error("[safeQuery]", e);
    return fallback;
  }
}
