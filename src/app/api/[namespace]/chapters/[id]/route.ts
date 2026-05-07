import { NextResponse } from "next/server";
import { getChapter, getAllChapters } from "@/lib/yaml-loader";
import type { ChapterNavItem } from "@/lib/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ namespace: string; id: string }> }
) {
  const { namespace, id } = await params;
  try {
    const data = getChapter(namespace, id);
    const all = getAllChapters(namespace);
    const idx = all.findIndex((c) => c.id === id);

    const toNav = (i: number): ChapterNavItem | null => {
      const c = all[i];
      if (!c) return null;
      return { id: c.id, number: c.chapter.number, title: c.chapter.title };
    };

    return NextResponse.json({
      ...data,
      prev: toNav(idx - 1),
      next: toNav(idx + 1),
    });
  } catch {
    return NextResponse.json(
      { error: `Chapter not found: ${namespace}/${id}` },
      { status: 404 }
    );
  }
}
