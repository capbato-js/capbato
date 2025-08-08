# MG Amores Medical Clinic Management System

Steps to run locally

1. pnpm install

2. Create .env for apps/web and apps/api
For apps/web/.env content:
VITE_API_BASE_URL=http://localhost:4000

For apps/api/.env content:
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

DB_TYPE=mysql
DB_ORM=typeorm
DATABASE_URL=mysql://<username>:<password>@localhost:3306/cms

3. Make sure MySQL is running, then create new DB named cms.

4. Run pnpm api

5. Run pnpm web

6. Voila! App is now running at http://localhost:3000.