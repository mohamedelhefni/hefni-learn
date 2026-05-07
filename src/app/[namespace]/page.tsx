import Link from "next/link";
import { getAllChapters } from "@/lib/yaml-loader";
import { SiteHeader } from "@/components/SiteHeader";
import { ChapterGrid } from "@/components/ChapterGrid";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ namespace: string }>;
}

export default async function NamespacePage({ params }: Props) {
  const { namespace } = await params;
  const chapters = getAllChapters(namespace);

  if (chapters.length === 0) {
    // could be a non-existent namespace
    notFound();
  }

  const label = namespace.charAt(0).toUpperCase() + namespace.slice(1);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Breadcrumb + hero */}
      <div className="border-b border-border px-6 py-12">
        <p className="text-xs font-mono text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">home</Link>
          <span className="mx-2" style={{ color: "var(--terminal-dim)" }}>/</span>
          <span style={{ color: "var(--primary)" }}>{namespace}</span>
        </p>
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold tracking-tight">{label}</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {chapters.length} chapter{chapters.length !== 1 ? "s" : ""} available.
            Hands-on practice, broken manifests to debug, and quizzes that stick.
          </p>
        </div>
      </div>

      {/* Chapter grid */}
      <main className="px-6 py-10">
        <div className="flex items-baseline justify-between mb-6">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Chapters
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            {chapters.length} available
          </span>
        </div>

          <ChapterGrid chapters={chapters} namespace={namespace} />
      </main>
    </div>
  );
}
