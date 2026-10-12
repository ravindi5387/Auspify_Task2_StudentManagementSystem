StudentHub --- Student Management System

A full-stack Student Management System developed for Auspify
Technologies' Full Stack Development Internship --- Task 2. StudentHub
provides a clean interface to manage student records through a React
frontend, Express REST API, and PostgreSQL database.

✨ Features

Dashboard overview of student records.

Create, view, update, and delete student records.

Search and filter students by available course/year fields.

Export the filtered student list to CSV.

Validate student information before saving.

Persist student records in PostgreSQL.

REST API for student operations.

Clean, light-themed interface.

🛠️ Technology Stack

Layer      Technologies

Frontend   React, TypeScript, Vite, CSS
Backend    Node.js, Express.js, TypeScript
Database   PostgreSQL (Neon-compatible)
HTTP       REST API, Axios
Tools      Postman, Git, GitHub, Visual Studio Code

🏗️ System Architecture

<img width="1774" height="887" alt="image" src="https://github.com/user-attachments/assets/480b270b-2ece-448f-b9fa-d794ca3a2839" />


📁 Repository Structure

<img width="1312" height="1199" alt="image" src="https://github.com/user-attachments/assets/62ccd2bd-8ba6-4f78-a440-58865a54df31" />

🚀 Local Setup

Prerequisites

Node.js and npm

Git

PostgreSQL database (local PostgreSQL or Neon)

Visual Studio Code or another code editor

1. Clone the repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd student-management-system-liteblue

Replace <YOUR_GITHUB_REPOSITORY_URL> with your actual GitHub
repository URL.

2. Configure the database

Create/select a PostgreSQL database. Copy the example environment file:

copy backend\.env.example backend\.env

Open backend/.env and enter your own database connection string and
required environment values. If the database has not been initialized,
use database/schema.sql to create the required table(s).

Never commit .env files or publish database credentials.

3. Start the backend

cd backend
npm install
npm run dev

The local backend uses port 5000 unless configured otherwise.

4. Start the frontend

Open a second terminal from the project root:

cd frontend
npm install
npm run dev

Open the local URL printed by Vite.

🔌 API Endpoints

Method   Endpoint              Purpose

GET      /api/health         Health check, if configured
GET      /api/students       List students
POST     /api/students       Create a student
GET      /api/students/:id   Get one student
PUT      /api/students/:id   Update a student
DELETE   /api/students/:id   Delete a student

🧪 Testing Checklist

Dashboard loads.

Student data loads from the API/database.

New student can be added and persists after refresh.

Student can be edited and changes persist.

Student can be deleted.

Search and filters work.

CSV export downloads the expected records.

API requests can be tested in Postman.

Invalid form values are handled appropriately.

📸 Application Screenshots

## 📸 Project Screenshots

Click the links below to view the screenshots.

1. [Dashboard](screenshots/01-dashboard.png)
2. [Student Directory](screenshots/02-student-directory.png)
3. [Add Student Form](screenshots/03-add-student-form.png)
4. [Student Added Successfully](screenshots/04-student-added.png)
5. [Edit Student](screenshots/05-edit-student.png)
6. [Search and Filter](screenshots/06-search-filter.png)
7. [CSV Export](screenshots/07-csv-export.png)
8. [Postman API Response](screenshots/08-postman-api.png)
9. [Database Records](screenshots/09-database-records.png)
10. [Project Repository Structure](screenshots/project-structure.png)

🔒 Security Notes

Keep .env files out of Git.

Store database credentials in environment variables.

Use sample/demo data in public screenshots; do not expose private
student information.

Hide passwords, connection strings, tokens, and secrets in
screenshots.

Rotate any credential that has accidentally been exposed.

🌐 Deployment

The frontend and backend can be hosted separately with PostgreSQL as the
database. Configure the frontend API base URL and environment variables
for deployed services, then test the full application.

Live demo: Add the deployed frontend URL after deployment.

Backend API: Add the deployed API URL after deployment.

Do not add URLs until deployment is complete and tested.

👩‍💻 Author

Ravindi Sandali Perera
BSc (Hons) Software Engineering
Cardiff Metropolitan University degree programme through ICBT Campus,
Sri Lanka
