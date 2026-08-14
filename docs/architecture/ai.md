# AI Architecture

The AI Mentor is designed to act as a cultural guide and mentor for the users.

## Integration
- Requests are sent from the client to a Next.js Server Route (API).
- The Server Route communicates securely with the AI provider (e.g., OpenAI, Anthropic).
- API Keys are NEVER exposed to the client.
- Conversations are stored in the `ai_conversations` table.
