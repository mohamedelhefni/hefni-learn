# Design

## Theme

Dark. The ambient scene: a junior engineer at their laptop, late afternoon or evening, running kubectl commands and cross-referencing documentation. The interface lives in that context. Not dramatic darkness — workstation darkness.

## Color Strategy

Committed. A cool navy-charcoal base with a teal accent at 30-40% of interactive surfaces. The terminal areas drop darker still. No gradients for decoration. Color earns meaning.

## Color Palette (OKLCH)

```
--background:    oklch(0.13 0.012 240)   /* deep cool charcoal */
--surface:       oklch(0.17 0.010 240)   /* card / panel */
--surface-raised: oklch(0.20 0.008 240)  /* raised elements */
--border:        oklch(0.24 0.008 240)   /* subtle dividers */
--muted:         oklch(0.35 0.006 240)   /* muted backgrounds */

--foreground:    oklch(0.90 0.006 240)   /* primary text */
--muted-fg:      oklch(0.58 0.010 240)   /* secondary / placeholder */
--subtle-fg:     oklch(0.42 0.008 240)   /* tertiary / disabled */

--accent:        oklch(0.68 0.16 195)    /* teal — primary interactive */
--accent-hover:  oklch(0.63 0.17 195)    /* teal hover */
--accent-subtle: oklch(0.20 0.05 195)    /* teal tinted background */

--success:       oklch(0.66 0.17 142)    /* green — correct / earned */
--success-subtle: oklch(0.18 0.05 142)   /* green tinted background */
--warning:       oklch(0.76 0.15 68)     /* amber — hints / caution */
--warning-subtle: oklch(0.20 0.05 68)    /* amber tinted background */
--error:         oklch(0.62 0.20 24)     /* red — wrong / error */

/* Terminal subsystem */
--terminal-bg:   oklch(0.07 0.006 240)   /* near-black terminal */
--terminal-text: oklch(0.72 0.14 142)    /* green output text */
--terminal-prompt: oklch(0.60 0.12 195)  /* cyan prompt / command echo */
--terminal-dim:  oklch(0.38 0.008 240)   /* comment / inactive lines */
```

## Typography

- **UI font**: System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`)
- **Monospace**: `"JetBrains Mono", "Fira Code", ui-monospace, monospace` — for code, YAML, terminal
- **Scale**: 12px base for meta / captions, 14px body, 16px UI default, 20px section headings, 24px page headings
- **Weight contrast**: Regular (400) body, Medium (500) labels, Semibold (600) headings. No light weights.
- **Line length**: Cap prose at 70ch.

## Component Notes

### Chapter cards (home)
Horizontal rule accent on top (2px, teal), not a side stripe. Chapter number in large tinted numerals behind the card as decorative layer. Clean typographic layout.

### Tab navigation
Underline-style active tab, not pill/box. Teal underline. Muted inactive labels that brighten on hover.

### Terminal simulator
Full dark terminal chrome (charcoal header with traffic lights). Input line with blinking cursor caret. Command history with prompt symbol ($). Validation result as inline dimmed annotation, not a toast.

### Key points / badges
Flat, low-contrast background. Monospace label text. No shadows, no borders. Like code annotations.

### Quiz cards
Single-question-at-a-time layout. Answer options as full-width clickable rows, not radio buttons. Selected state: teal left border fill (full border, not a side stripe). Explanation revealed inline below the answer, not in a modal.

### Progress
Linear progress bar in teal. Points tally top-right. No circular charts, no percentages in big numerals.

## Spacing & Layout

- Base unit: 4px
- Content max-width: 860px centered
- Section vertical rhythm: 32px between major sections, 16px within
- Card padding: 20px / 24px (mobile / desktop)

## Motion

Subtle only. Tab transitions: opacity fade 150ms ease-out. Point awards: number count-up 300ms. Hint reveal: slide-down 200ms ease-out. No bounce, no spring.

## Anti-patterns (never use)

- Side-stripe borders (>1px colored left/right border as accent)
- Gradient text
- Glowing effects on terminal text
- Pastel backgrounds (any oklch lightness >0.85 in primary surfaces)
- White (#fff) or pure black (#000)
- Generic blue primary button color
