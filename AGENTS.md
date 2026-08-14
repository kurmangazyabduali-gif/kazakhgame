<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ULY DALA Platform Agent Rules

1. Never rewrite working architecture without a clear reason.
2. Never delete working modules casually.
3. Do not duplicate components.
4. Reuse existing components.
5. Strict TypeScript.
6. Avoid any.
7. Never expose secrets client-side.
8. Database changes require migrations.
9. New game modules must follow NationalGame interface.
10. Scores must not be trusted from the client.
11. Keep games isolated from platform infrastructure.
12. Run typecheck after meaningful changes.
13. Run tests after meaningful changes.
14. Run production build before claiming completion.
15. Use semantic and accessible HTML.
16. Preserve responsive behavior.
17. Do not introduce unnecessary dependencies.
18. Read existing architecture before creating new files.
19. Prefer small reusable modules.
20. Never replace a working implementation with mock code unless explicitly requested.
