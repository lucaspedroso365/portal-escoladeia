"use client";

import { useEffect } from "react";

/** Fires a single view increment for a news article on mount. */
export function ViewTracker({ id }: { id: number }) {
  useEffect(() => {
    fetch(`/api/news/${id}/view`, { method: "POST" }).catch(() => {});
  }, [id]);
  return null;
}
