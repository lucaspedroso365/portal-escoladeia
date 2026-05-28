"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_FIELDS, type Field } from "@/lib/admin-fields";
import { slugify, toStringArray } from "@/lib/utils";
import type { ContentType } from "@/types";
import { AIGenerator } from "./AIGenerator";
import { ImageUploader } from "./ImageUploader";

type Options = { id: number; name: string }[];

export function AdminForm({
  type,
  routeSlug,
  tools,
  categories,
  initial,
  id,
}: {
  type: ContentType;
  routeSlug: string;
  tools: Options;
  categories: Options;
  initial: Record<string, unknown> | null;
  id: number | null;
}) {
  const schema = ADMIN_FIELDS[type];
  const router = useRouter();

  const [values, setValues] = useState<Record<string, unknown>>(() =>
    initValues(schema.fields, initial)
  );
  const [slugEdited, setSlugEdited] = useState<boolean>(!!initial?.slug);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function setField(name: string, value: unknown) {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (name === schema.slugFrom && !slugEdited) {
        next.slug = slugify(String(value ?? ""));
      }
      return next;
    });
  }

  function applyGenerated(data: Record<string, unknown>) {
    setValues((prev) => {
      const next = { ...prev };
      for (const f of schema.fields) {
        if (f.name in data && data[f.name] != null) {
          next[f.name] = f.type === "tags" ? toStringArray(data[f.name]) : data[f.name];
        }
      }
      const src = next[schema.slugFrom];
      if (!slugEdited && src) next.slug = slugify(String(src));
      return next;
    });
  }

  async function save(publish?: boolean) {
    setSaving(true);
    setError("");
    const body: Record<string, unknown> = { ...values };
    if (schema.hasPublished) body.published = publish ?? Boolean(values.published);
    try {
      const url = id ? `/api/admin/${type}/${id}` : `/api/admin/${type}`;
      const res = await fetch(url, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        router.push(`/admin/${routeSlug}`);
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Falha ao salvar.");
        setSaving(false);
      }
    } catch {
      setError("Erro de conexão.");
      setSaving(false);
    }
  }

  async function remove() {
    if (!id || !confirm("Excluir este item?")) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/${type}/${id}`, { method: "DELETE" });
      router.push(`/admin/${routeSlug}`);
      router.refresh();
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AIGenerator contentType={type} onGenerate={applyGenerated} />

      <div className="space-y-5">
        {schema.fields.map((f) => (
          <FieldInput
            key={f.name}
            field={f}
            value={values[f.name]}
            tools={tools}
            categories={categories}
            onChange={(v) => {
              if (f.name === "slug") setSlugEdited(true);
              setField(f.name, v);
            }}
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3 border-t border-black/5 pt-5">
        {schema.hasPublished ? (
          <>
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="rounded-xl bg-[#F5F5F7] px-5 py-2.5 text-sm font-semibold text-[#1A1A1A] hover:bg-black/5 disabled:opacity-60"
            >
              Salvar rascunho
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="rounded-xl bg-[#CC785C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b86848] disabled:opacity-60"
            >
              Publicar agora
            </button>
          </>
        ) : (
          <button
            onClick={() => save()}
            disabled={saving}
            className="rounded-xl bg-[#CC785C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b86848] disabled:opacity-60"
          >
            Salvar
          </button>
        )}
        {id && (
          <button
            onClick={remove}
            disabled={saving}
            className="ml-auto rounded-xl px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}

function initValues(fields: Field[], initial: Record<string, unknown> | null) {
  const v: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = initial?.[f.name];
    switch (f.type) {
      case "toggle":
        v[f.name] = Boolean(raw);
        break;
      case "tags":
        v[f.name] = toStringArray(raw);
        break;
      case "number":
        v[f.name] = raw != null ? String(raw) : "";
        break;
      case "select":
        v[f.name] = raw != null ? String(raw) : "";
        break;
      default:
        v[f.name] = raw != null ? String(raw) : "";
    }
  }
  return v;
}

function FieldInput({
  field,
  value,
  tools,
  categories,
  onChange,
}: {
  field: Field;
  value: unknown;
  tools: Options;
  categories: Options;
  onChange: (v: unknown) => void;
}) {
  const labelEl = (
    <label className="mb-1 block text-sm font-medium">{field.label}</label>
  );
  const inputClass =
    "w-full rounded-xl bg-[#F5F5F7] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#CC785C]/30";

  if (field.type === "toggle") {
    return (
      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded accent-[#CC785C]"
        />
        <span className="text-sm font-medium">{field.label}</span>
      </label>
    );
  }

  if (field.type === "image") {
    return (
      <div>
        {labelEl}
        <ImageUploader
          value={(value as string) || null}
          onChange={(url) => onChange(url ?? "")}
        />
      </div>
    );
  }

  if (field.type === "select") {
    const opts =
      field.optionsSource === "tools"
        ? tools.map((t) => ({ value: String(t.id), label: t.name }))
        : field.optionsSource === "categories"
          ? categories.map((c) => ({ value: String(c.id), label: c.name }))
          : field.options ?? [];
    return (
      <div>
        {labelEl}
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          <option value="">— selecione —</option>
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "tags") {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div>
        {labelEl}
        <input
          type="text"
          value={arr.join(", ")}
          onChange={(e) =>
            onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
          }
          placeholder="separados por vírgula"
          className={inputClass}
        />
      </div>
    );
  }

  if (field.type === "textarea" || field.type === "markdown") {
    const str = (value as string) ?? "";
    return (
      <div>
        {labelEl}
        <textarea
          value={str}
          onChange={(e) => onChange(e.target.value)}
          rows={field.type === "markdown" ? 12 : 3}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          className={`${inputClass} font-mono`}
        />
        {field.maxLength && (
          <p className="mt-1 text-right text-xs text-[#86868B]">
            {str.length}/{field.maxLength}
          </p>
        )}
      </div>
    );
  }

  // text / number
  const str = (value as string) ?? "";
  return (
    <div>
      {labelEl}
      <input
        type={field.type === "number" ? "number" : "text"}
        value={str}
        onChange={(e) => onChange(e.target.value)}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        className={inputClass}
      />
    </div>
  );
}
