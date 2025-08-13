AI-Assisted Code Review & Bug Detection (Node.js + MySQL) - Starter Kit
======================================================================
email:hadi108.abdul@gmail.com
What's included
- frontend/: React + Vite + Monaco Editor
- backend/: Node.js + Express + Sequelize (MySQL)
- docker-compose.yml to run MySQL, backend, and frontend
- Dockerfiles for backend and frontend

Quick start (Docker - recommended)
1. Install Docker & Docker Compose
2. Copy `.env.example` to `.env` and edit values if needed
3. Run:
   docker-compose up --build

- Frontend will be available at http://localhost:5173
- Backend API at http://localhost:8000
- MySQL on port 3306 (root user/password per .env)

Quick start (Local without Docker)
Backend:
  - cd backend
  - npm install
  - copy .env.example to .env and update
  - npm run migrate
  - npm run dev

Frontend:
  - cd frontend
  - npm install
  - npm run dev

Notes
- The backend will try to call OpenAI if OPENAI_API_KEY is set in .env.
- For production, secure secrets and use managed DB.
