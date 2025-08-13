Backend (Node.js + Express)
--------------------------
Quick start (local, without docker):
1. cd backend
2. npm install
3. copy .env.example to .env and update DB connection values
4. npm run migrate
5. npm run dev

The backend exposes:
POST /review/analyze  { code, language } -> runs linter + LLM and saves result
GET /review/history   -> list past reviews
