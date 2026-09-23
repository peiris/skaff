# Project rules

## Working style

### Do only what was asked

Implement, confirm it works, report in a few lines, stop.

- No unrequested extras — no extra files, formats, variants, fallbacks. One ask = one deliverable.
- Verify privately (typecheck, lint, load the page). No comparison renders, previews, pixel-diffs, or scratch harnesses unless asked.
- Mechanical edits (find/replace, rename, move) get no ceremony: no pre-survey, no occurrence counting, no re-grepping to confirm. Edit tools error on failure — that's the confirmation. Investigate first only when the change depends on it, and say why.
- Don't narrate process, restate what you did, or list what you skipped.
- If the request looks wrong, say so in a sentence and ask. Never implement both options or one-while-pitching-the-other.

### Stop investigating and write the code

Look up only what the edit can't be written without, then write it.

- Never reverse-engineer a live system: no scraping the deployed site, grepping its bundles, fetching extra pages, or diffing responses. One call to the pointed-at endpoint to see its shape is the whole budget.
- Missing detail? Pick the obvious mapping or omit the field, note it in one line, let the user decide. Don't hunt.
- A one-line-of-UI detail (label, fallback, nice-to-have) is not worth a single extra request.
- No background/parallel commands for questions the task doesn't hinge on.
- Several turns of reading without editing = off track. Write the code and ask what's unclear.

### Check the API before building behaviour

`components/ui` wraps Base UI. Before adding/changing behaviour (open/close, hover/focus, positioning, delays, keyboard nav, typeahead, portals, animation state, form wiring), read `node_modules/@base-ui/react/docs/react/components/` and `.../handbook/` — it's almost always an existing prop, part, or data attribute. Same for Next.js: read `node_modules/next/dist/docs/` before hand-rolling navigation, caching, data loading, metadata, redirects, image/font handling. Don't trust memory of either API — read the file. Custom implementations only after docs prove the built-in can't, noted in one line.

### Verification never writes into the repo

All check by-products (screenshots, snapshots, logs, scratch scripts, sample payloads) go in a temp dir outside the tree — never repo root, `.playwright-mcp/`, or `screenshots/`. Always pass tools an absolute path outside the repo. Delete artifacts when done (`.gitignore` is not cleanup). Only requested files remain.

## Git

### Never discard unrelated working tree changes

The user edits files while agents run. Uncommitted changes are real work.

- Never `git checkout`/`restore`/`reset --hard`/`stash`/`clean` on changes you didn't make. Revert your own edits line-by-line only.
- Don't "tidy" others' modifications, even if they look stale or half-finished.
- Re-read files before editing — they may have changed. Never write from a stale copy.
- Collision with someone else's change: stop and ask.
- Stage specific paths only. Never `git add -A` / `git add .`.
- Never create a branch unless asked in that request. "Commit this" = commit on the checked-out branch, including `main`.

### Prove a reference is dead before deleting

`rg` / `rg --files` first, for any file, export, dependency, registry entry, test, or doc you're about to remove — this is the one deletion that earns a pre-survey. Remove every stale reference in the same pass.

## Files and structure

### One component per file

Each component gets its own file named after it (`BrandThumbnail` → `brand-thumbnail.tsx`). No second component in a file, even a small private one — split it out, export/import by name. Exception: `components/ui` keeps whatever the registry shipped.

### Filenames are `<domain>-<role>`

Component directories are flat, so the first token is the only grouping there is. Spend it on the domain, put the role last: `brand-card`, `product-list-carousel`, `search-filter-section`. Common roles — `card`, `carousel`, `chip`, `dialog`, `filter`, `form`, `group`, `header`, `item`, `list`, `menu`, `nav`, `panel`, `selector`, `skeleton`, `table`, `thumbnail`, `tree`. Reuse one before inventing a word.

**The domain prefix is always singular**, whatever the component holds: `brand-nav` (takes `Brand[]`), `category-cloud-list`, `product-list-carousel`. Plurality is the suffix's job. One domain sorts as one contiguous block — `brands-nav` next to `brand-card` is the failure this prevents.

### Dialogs and forms live in their own directories

A `*-dialog.tsx` file goes in `components/dialogs`, a `*-form.tsx` file in `components/forms`, imported as `@/components/dialogs/cart-quote-dialog` and `@/components/forms/address-form`. Never create either anywhere else, and move any you find. Everything else here still applies: one component per file, `<domain>-<role>` filenames, singular domain prefix.

A dialog or form that fetches splits the same way a section does, and both halves stay in the same directory. Its skeleton follows it too: `account-profile-form-skeleton` sits beside `account-profile-form` in `components/forms`.

### A section that fetches splits in two

When the render half needs `'use client'`, or is shared by more than one section, it moves to its own file. The `section-*` parent does the `await`; the child is named for **what it renders**, never a prefix-only variation of its parent:

| parent (fetches) | child (renders) |
| --- | --- |
| `section-faq` | `faq-accordion` |
| `section-hero` | `hero-carousel` |
| `section-related-products` | `product-list-carousel` |

`section-faq.tsx` beside `faqs.tsx` is the anti-pattern: nothing in the name says which one holds the `await`.

A Suspense fallback occupying a section's band is itself a section — `section-product-about-skeleton` sorts next to `section-product-about`.

### Custom hooks live in lib/hooks

One file per hook, named after it (`useHeaderPopup` → `lib/hooks/use-header-popup.ts`). Never define hooks elsewhere; move any found. Exception: hooks shipped with shadcn components in `components/ui`.

### Helpers live in lib/utils

One file per helper, named after it (`cn` → `lib/utils/cn.ts`). Never define helpers elsewhere; move any found. Read `lib/utils` before writing a new one — reuse or extend beats adding. Exception: `components/ui`.

Most helpers should never be written. A helper earns its place by holding a decision — branching, a rule, a non-obvious transform, a thought-through constant. One-expression bodies get inlined. Don't write:

- Wrappers around one call (`formatPrice` = `n.toFixed(2)`, `isEmpty` = `!arr.length`).
- Aliases (another function with reordered args or a filled default).
- Single-use one-liners — put them at the call site.
- Speculative utils — write it when the second caller appears.
- What the platform/deps already do — check `Intl`, `URL`, `URLSearchParams`, array/string methods, and `package.json` libs first.

`lib/utils` is shared surface: genuinely reusable, named for what it returns, correct beyond the prompting call site. Can't name it without `handle`/`process`/`data`/`helper`/bare `format`? Don't write it. When touching code that calls a bad helper, inline it and delete the file.

### Types live in /types

Every `type`/`interface` goes in a domain file (`Product` → `types/product.ts`); move any found elsewhere. Import via `import type { … } from '@/types/<domain>'`. Exception: `components/ui`. Inline annotations aren't declarations and stay put.

## Types

### No escape-hatch types

Every value has a shape — write it. Banned everywhere (declarations, annotations, generics, casts, returns): `unknown`, `any`, `Record<string, unknown|any>`, `{ [key: string]: unknown }`, `object`, `{}`, `Function`, `unknown[]`, `any[]`, and laundering casts (`data as Product`, `as unknown as`).

If the shape isn't obvious, find it: Schema, API response, library types in `node_modules`, or the producing code. Untyped boundary data gets a declared type plus a parse/narrow step. Retype anything from shadcn/registries/codegen before committing. Generic params are fine (`<T>(items: T[]) => T[]`); constrain when the body needs a property. `unknown` is allowed only in `catch`, narrowed before use.

### Empty array / null is still a real field

Empty samples prove nothing about a field's shape. Type fields for the data they'll hold: `tierPrices: TierPrice[] | null`, never `never[]`, `[]`, `null`, or dropped.

- Don't sample record after record hoping a field fills in, or report "empty in N responses" as evidence.
- Unobserved element shape: infer from the field's name and siblings, declare in `/types`, flag as unconfirmed in one line. Mock data is never the fallback — fetch a different record.

## Pages

### A page is a list of sections

`app/**/page.tsx` holds metadata and a `<main className="flex flex-1 flex-col">` containing section components, nothing else — no markup, no data fetching, no state. Each section is `components/section-<name>.tsx`, one per file, shaped as a `<section>` with vertical padding wrapping a `SectionContainer`; copy that shape rather than inventing a new one. A landing page draws from this vocabulary before adding a new word: `hero`, `logos`, `features`, `how-it-works`, `testimonials`, `pricing`, `faq`, `cta`, `footer`. "Minimal" means `hero` plus at most two more.

### Error pages go through the file conventions

`app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/forbidden.tsx` and `app/unauthorized.tsx` are the Next.js error pages; all of them render `components/error-page.tsx`. Throw `notFound()`, `forbidden()` or `unauthorized()` from `next/navigation` instead of rendering ad-hoc error markup. Nested segments get their own `error.tsx`/`not-found.tsx` only when they need different copy or actions. `error.tsx` and `global-error.tsx` stay client components with the `{ error, retry }` props.

### Width and rhythm come from one place

Horizontal bounds are always `SectionContainer` (`components/section-container.tsx`) — never a hand-rolled `max-w-*` + `px-*` wrapper. Vertical rhythm is `py-16 md:py-24` on every section and `gap-*` from the spacing scale inside it; no arbitrary values, no margin-based stacking, no `space-y-*`. A section that needs a different band is a decision — say so in one line.

### Copy comes from `lib/site.ts` or the request

Brand name, tagline, description and URL live in `lib/site.ts` and are imported, never retyped. When the request gives no copy, write one short specific placeholder per slot — no lorem ipsum, no fake customer logos, testimonials or metrics attributed to real companies or people, no remote stock-image URLs. Images are local files under `public/` rendered with `next/image` and explicit dimensions; if none exists, use a sized `bg-muted` placeholder.

### Colour is semantic tokens only

Use the shadcn tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`, `bg-primary`) and nothing else — no palette classes like `zinc-50`, no hex, no `dark:` overrides on colour, since the tokens already flip. Headings use `font-heading`; body text inherits `font-sans`.

### URL state goes through nuqs

Anything a user could bookmark or share — filters, tabs, pagination, search, sort, open panel — lives in the URL via `useQueryState` / `useQueryStates` from `nuqs` with an explicit parser (`parseAsString`, `parseAsInteger`, `parseAsStringLiteral`, …) and a default. Never read `useSearchParams` by hand for that, never mirror URL state into `useState`, and never push to the router to change a param. Server components read the same params with `createLoader` from `nuqs/server`, sharing one parser definition in `lib/utils/<name>-search-params.ts`. State that is purely transient (hover, draft text, a dialog step) stays in React state.

### Motion is opt-in and shared

Entrance animation goes through `components/motion-reveal.tsx` only. No per-element `motion.*` with inline variants, no animation on layout-shifting properties, nothing that runs on every scroll. `MotionReveal` already honours `prefers-reduced-motion`; don't bypass it. Hover and focus states are CSS transitions, not Motion.

### A page is done when

- `{{run}} typecheck` and `{{run}} check` pass with no new warnings.
- It renders at 375px and 1280px with no horizontal scroll and no overlapping text.
- Exactly one `h1`, headings in order, every image has `alt`, `width` and `height`.
- `metadata` is set on the route (title falls back to `lib/site.ts`).
- No unrequested sections, files or copy.

## UI

### Use the registry before writing a primitive

Never handwrite a primitive. Stop at the first hit:

1. Already in `components/ui` → use it (e.g. shadcn `Button`, not raw `<button>`).
2. In the official shadcn registry → `{{dlx}} shadcn@latest add <component>`. Check the registry, don't trust memory — it's grown, and `components.json` (`{{shadcnStyle}}`) pulls Base UI variants. Never hand-copy source from docs or rebuild what the registry ships.
3. Nothing fits → write it, and say in one line what you searched and why nothing worked.

### A Button that navigates is a Link

`<Button render={<Link href="…" />} nativeButton={false}>` — Base UI needs `nativeButton={false}` whenever `render` is not a real `<button>`, otherwise it logs an accessibility error. Never wrap a `<Button>` in a `<Link>` or style a raw `<a>` to look like one.

### Size comes from the size prop

Never resize a `components/ui` component with utilities — no `size-8`/`h-9`/`w-12`, no padding/text-size overrides, no inline width/height. Use the closest existing `size` variant (read the component file for the current list). Leave icons unsized — variants set them. No new variants, no widening existing ones, no overrides for in-between pixel values. `className` keeps margins, alignment, grid placement, colour.

### Text sizes come from the scale

No arbitrary font sizes — no `text-[13px]`, `text-[0.8rem]`, no inline `fontSize`. Use the scale: `text-xs`, `text-sm`, `text-base`, `text-lg`, up. If `app/globals.css` retunes any `--text-*` token, read those values first; the matching class may not be the one its name suggests. If a size is genuinely missing, add a `--text-*` token in `globals.css`, never inline it. Applies to shadcn/registry/Figma imports.

### Conditional classes use object style

In `cn()`, conditionals are objects keyed by class string — never `&&` or ternaries:

```tsx
cn('flex flex-col gap-3', { 'items-center text-center': align === 'center' }, className)
```

A ternary becomes two entries (`{ 'bg-brand': reached, 'bg-border': !reached }`) — don't lean on tailwind-merge for conflicts a condition can state. Unconditional classes stay plain strings; passed-through `className` stays last so it wins merges.

### Underline pairs with underline-offset-4

Every `underline` gets `underline-offset-4`, including variants (`hover:underline underline-offset-4` — offset stays unprefixed). Fix anything pulled in that underlines without it.

## Code quality

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async and promises

- Always `await` promises in async functions — don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### Error handling and debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully — don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (Next.js `<Image>`) over `<img>` tags

### Next.js

- Use the Next.js `<Image>` component for images
- Use the App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

### Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests — use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat — avoid excessive `describe` nesting

## Comments

### Comments default to zero

A comment is earned only by an external fact the code can't carry: an API/service/tool quirk, an upstream-bug workaround, or why a non-obvious constant has its value. Never narrate code, label sections, restate names in JSDoc, mark changes, record refactor history, or address the reviewer. Delete commented-out code; when unsure, delete; prefer renaming over explaining. Machine directives are not comments and stay: `oxlint-disable*`, `ts-expect-error`, `AUTO-GENERATED` banners.
