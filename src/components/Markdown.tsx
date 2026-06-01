import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn, slugify } from "@/lib/utils";
import type { ReactNode } from "react";

function textOf(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(textOf).join("");
  if (children && typeof children === "object" && "props" in children) {
    return textOf((children as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/** Renders markdown with the shared `.prose-ia` styling. H2s get slug ids. */
export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn("prose-ia", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer nofollow">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-2xl shadow-[0_2px_6px_rgba(0,0,0,0.06),0_0_0_0.5px_rgba(0,0,0,0.04)]">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
