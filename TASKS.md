# Kubepath Tutorial — Build Tasks

## 1. Scaffold Next.js project and install deps
- [x] `pnpm create next-app@latest kubepath-tutorial`
- [x] Install js-yaml, react-markdown, remark-gfm
- [x] shadcn init + add components (button, card, badge, tabs, progress, textarea)
- [x] Copy chapter YAML to `src/data/chapters/`

## 2. Design system (impeccable)
- [x] Write PRODUCT.md
- [x] Write DESIGN.md
- [x] Rewrite `globals.css` with OKLCH dark palette

## 3. Lib files
- [x] `src/lib/types.ts` — TypeScript types from schema
- [x] `src/lib/yaml-loader.ts` — server-side YAML parser
- [x] `src/lib/simulator.ts` — command simulation + validation
- [x] `src/lib/use-progress.ts` — localStorage progress hook

## 4. Components
- [x] `src/components/chapter/ChapterHeader.tsx`
- [x] `src/components/chapter/SectionNav.tsx`
- [x] `src/components/concepts/ConceptSection.tsx`
- [x] `src/components/command-practice/TerminalSimulator.tsx`
- [x] `src/components/command-practice/CommandPractice.tsx`
- [x] `src/components/scenarios/HintSystem.tsx`
- [x] `src/components/scenarios/ScenarioChallenge.tsx`
- [x] `src/components/quiz/MultipleChoice.tsx`
- [x] `src/components/quiz/CommandChallenge.tsx`
- [x] `src/components/quiz/FillYaml.tsx`
- [x] `src/components/quiz/TrueFalse.tsx`
- [x] `src/components/quiz/QuizSection.tsx`

## 5. Pages
- [x] `src/app/layout.tsx` — root layout (dark class, font setup)
- [x] `src/app/page.tsx` — home page with chapter cards
- [x] `src/app/chapter/[id]/page.tsx` — dynamic chapter page
- [x] `src/app/api/chapters/[id]/route.ts` — API route for YAML loading

## 6. Verify
- [x] `pnpm build` succeeds with no errors
- [ ] `pnpm dev` — manual check: home shows chapter 07
- [ ] Terminal accepts commands and validates
- [ ] Quiz works end-to-end
- [ ] Progress persists on refresh
