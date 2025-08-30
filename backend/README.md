Backend for E-Certify

This minimal Express backend provides endpoints to register/login users stored in Supabase and to fetch the current user using a JWT.

Setup
1. Copy `.env.example` to `.env` and fill values (SUPABASE_URL and SUPABASE_SERVICE_KEY).
2. From this folder run `npm install`.
3. Start server: `npm run dev` (requires `nodemon`) or `npm start`.

Endpoints
- POST /api/register { name, email, password, role, institution_name?, company_name? }
- POST /api/login { email, password } -> returns { token, user }
- GET /api/me -> requires Authorization: Bearer <token>

Integration notes
- Use server-side Supabase service role key to read/write the `users` table. Keep this key secret.
- The frontend should call `/api/login` after registration to obtain a token and store it (e.g., localStorage) and then redirect based on role.
