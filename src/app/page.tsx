import Link from "next/link";
import { listNamespaces, getAllChapters } from "@/lib/yaml-loader";
import { SiteHeader } from "@/components/SiteHeader";


function NamespaceCard({ namespace }: { namespace: string }) {
  const chapters = getAllChapters(namespace);
  const totalPoints = chapters.reduce((s, c) => s + c.totalPoints, 0);
  const label = namespace.charAt(0).toUpperCase() + namespace.slice(1);

  return (
    <Link href={`/${namespace}`} className="group block">
      <article className="relative h-full rounded-lg border border-border bg-card p-6 transition-colors duration-150 hover:border-primary/60 hover:bg-card/80 overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-t-lg" />

        <div className="space-y-3">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              namespace
            </p>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-150">
              {label}
            </h2>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs font-mono text-muted-foreground">
            <span>{chapters.length} chapter{chapters.length !== 1 ? "s" : ""}</span>
            <span>{totalPoints} pts total</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function HomePage() {
  const namespaces = listNamespaces();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <div className="border-b border-border px-6 py-12">
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold tracking-tight">
            Learn by doing
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Hands-on practice, broken manifests to debug, and quizzes that actually stick.
            Pick a topic and get to work.
          </p>
        </div>
      </div>

      {/* Namespace grid */}
      <main className="px-6 py-10">
        <div className="flex items-baseline justify-between mb-6">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Topics
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            {namespaces.length} available
          </span>
        </div>

        {namespaces.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
            No topics found in{" "}
            <code className="font-mono text-xs">src/data/</code>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {namespaces.map((ns) => (
              <NamespaceCard key={ns} namespace={ns} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
