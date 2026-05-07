"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Concept } from "@/lib/types";

interface ConceptSectionProps {
  concepts: Concept[];
}

export function ConceptSection({ concepts }: ConceptSectionProps) {
  return (
    <div className="space-y-8">
      {concepts.map((concept, i) => (
        <div key={i} className="space-y-4">
          <h2 className="text-xl font-semibold">{concept.title}</h2>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // react-markdown v10 has no `inline` prop — detect via newline in content
                code({ className, children, ...props }) {
                  const content = String(children);
                  const isInline = !className && !content.includes("\n");

                  if (isInline) {
                    return (
                      <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded" {...props}>
                        {children}
                      </code>
                    );
                  }

                  // Block code (language-tagged or unlanguaged — includes ASCII art)
                  return (
                    <pre
                      style={{
                        whiteSpace: "pre",
                        overflowX: "auto",
                        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
                        fontVariantLigatures: "none",
                        lineHeight: 1.2,
                      }}
                      className="rounded-md bg-muted p-4 text-xs my-3"
                    >
                      <code className={className}>{children}</code>
                    </pre>
                  );
                },
                // Strip react-markdown's own <pre> wrapper; code handler owns it
                pre({ children }) {
                  return <>{children}</>;
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full divide-y divide-border text-sm">
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ children }) {
                  return (
                    <th className="px-3 py-2 text-left font-semibold bg-muted">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return <td className="px-3 py-2 border-t border-border">{children}</td>;
                },
              }}
            >
              {concept.content}
            </ReactMarkdown>
          </div>

          {concept.key_points && concept.key_points.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-primary">Key Points</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  {concept.key_points.map((point, j) => (
                    <Badge key={j} variant="secondary" className="text-xs font-normal">
                      {point}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
}
