# StudentHub — Student Management System

A light-blue, responsive full-stack Student Management System for Auspify Technologies Full Stack Development Internship — Task 2.

## Features
- Admin dashboard and student statistics
- Student CRUD: create, view, edit, delete
- Search by student ID, name, email, course
- Filter by course and study year
- Client/server validation and duplicate ID/email handling
- Neon PostgreSQL support, with schema and seed examples
- Responsive light-blue admin interface
- REST API and health check
- Admin demo login (front-end demo only; see security note)

## Tech stack
React + TypeScript + Vite, Node.js + Express + TypeScript, PostgreSQL (Neon compatible).

## 1. Database setup (Neon)
Use your existing Neon project/database. In Neon SQL Editor, run `database/schema.sql` (it creates the `students` table if missing and inserts sample rows only if absent). This is PostgreSQL SQL, not MySQL SQL.

## 2. Backend
Open a terminal in `backend`:
```bash
npm install
```
Create `backend/.env` based on `.env.example` and paste your Neon connection string:
```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
FRONTEND_ORIGIN=http://localhost:5173
```
Run:
```bash
npm run dev
```
Check `http://localhost:5000/api/health` and `http://localhost:5000/api/students`.

## 3. Frontend
Open a second terminal in `frontend`:
```bash
npm install
npm run dev
```
Open the URL printed by Vite (usually `http://localhost:5173`).

## API endpoints
- `GET /api/health`
- `GET /api/students?search=&course=&year=`
- `GET /api/students/:id`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

## Submission checklist
- [ ] Verify Add, View, Update, Delete
- [ ] Verify search and filters
- [ ] Test APIs in Postman
- [ ] Take screenshots of dashboard, student table, create/edit form, API responses, and Neon table
- [ ] Push source code to GitHub (never commit `.env`)
- [ ] Include a short demo video if useful (optional according to the task brief)

## Security note
The built-in admin sign-in is a demonstration UI and does not secure the API. Do not expose real student data or deploy this as a production system without adding server-side authentication/authorization, stronger validation, rate limiting, and secure deployment settings.
