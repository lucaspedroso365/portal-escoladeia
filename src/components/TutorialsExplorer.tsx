"use client";

import { useMemo, useState } from "react";
import { ContentCard } from "./ContentCard";
import { DIFFICULTY_LABELS } from "@/lib/constants";
import { formatRelativeDate } from "@/lib/utils";
import type { Tutorial } from "@/types";

const DIFFS = [
  { key: "todas", label: "Todas" },
  { key: "iniciante", label: "Iniciante" },
  { key: "intermediario", label: "Intermediário" },
  { key: "avancado", label: "Avançado" },
];

export function TutorialsExplorer({
  tutorials,
  tools,
}: {
  tutorials: Tutorial[];
  tools: { id: number; name: string }[];
}) {
  const [diff, setDiff] = useState("todas");
  const [toolId, setToolId] = useState("todas");

  const filtered = useMemo(
    () =>
      tutorials.filter((t) => {
        if (diff !== "todas" && t.difficulty !== diff) return false;
        if (toolId !== "todas" && String(t.toolId) !== toolId) return false;
        return true;
      }),
    [tutorials, diff, toolId]
  );

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {DIFFS.map((d) => (
          <button
            key={d.key}
            onClick={() => setDiff(d.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              diff === d.key
                ? "bg-[#1A1A1A] text-white"
                : "bg-[#F5F5F7] text-[#1A1A1A] hover:bg-black/5"
            }`}
          >
            {d.label}
          </button>
        ))}
        <select
          value={toolId}
          onChange={(e) => setToolId(e.target.value)}
          className="ml-auto rounded-full bg-[#F5F5F7] px-4 py-1.5 text-sm font-medium outline-none"
        >
          <option value="todas">Todas as ferramentas</option>
          {tools.map((t) => (
            <option key={t.id} value={String(t.id)}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <ContentCard
              key={t.id}
              href={`/tutoriais/${t.slug}`}
              title={t.title}
              excerpt={t.excerpt}
              label={DIFFICULTY_LABELS[t.difficulty] ?? t.difficulty}
              meta={formatRelativeDate(t.publishedAt ?? t.createdAt)}
            />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-[#86868B]">Nenhum tutorial encontrado.</p>
      )}
    </div>
  );
}
