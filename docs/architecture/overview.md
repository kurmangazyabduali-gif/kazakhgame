# Architecture Overview

ULY DALA uses a modular monolithic architecture, allowing rapid development while maintaining strict domain boundaries.

## Core Modules
- **Platform Core**: Authentication, Profiles, Leaderboards.
- **Game Engine**: A lightweight integration layer (`GameRegistry`, `GameSession`) to isolate game logic from the platform.
- **Cultural Hub**: Regions, Traditions, Quests.
- **AI Hub**: AI Mentorship and cultural guides.

## Data Flow
- Client Components handle interactivity.
- Server Components fetch data directly from Supabase (SSR).
- Server Actions process mutations and form submissions.
