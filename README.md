# ULY DALA — Digital National Games & Culture

## Project Purpose
ULY DALA is a scalable digital platform dedicated to the national games, traditions, education, and cultural heritage of Kazakhstan. It serves as a unified ecosystem connecting gaming, cultural education, AI mentorship, and regional championships.

## Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS, shadcn/ui
- **Database & Auth**: Supabase, PostgreSQL
- **Testing**: Vitest, Playwright

## Local Setup
1. Clone the repository: `git clone ...`
2. Install dependencies: `npm install`
3. Setup environment variables (see below).
4. Run the development server: `npm run dev`

## Environment Variables
Create a `.env.local` file in the root directory based on `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
AI_API_KEY=your_ai_key
```

## Database Setup
1. Create a Supabase project.
2. Run the SQL schema from `supabase/migrations/20240814000000_initial_schema.sql`.
3. Run the seed data from `supabase/seed.sql`.

## Development Commands
- `npm run dev` — Start the development server
- `npm run build` — Create a production build
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint

## Testing
- Unit tests: `npm run test` (Vitest)
- E2E tests: `npx playwright test`

## Deployment
The project is optimized for deployment on Vercel. Ensure all environment variables are added to the production environment settings.
