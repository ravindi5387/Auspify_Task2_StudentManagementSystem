StudentHub --- Student Management System

A full-stack Student Management System developed for Auspify
Technologies' Full Stack Development Internship --- Task 2. StudentHub
provides a clean interface to manage student records through a React
frontend, Express REST API, and PostgreSQL database.

✨ Features

Dashboard with student statistics

View student records

Add, edit, and delete students

Search student records

Filter by course and year of study

Export student records to CSV

REST API for student CRUD operations

PostgreSQL database persistence

Responsive dashboard interface

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

git clone https://github.com/ravindi5387/Auspify_Task2_StudentManagementSystem.git
cd Auspify_Task2_StudentManagementSystem

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

1. Dashboard
 <img width="1917" height="961" alt="01-dashboard" src="https://github.com/user-attachments/assets/189db4a0-4c32-4ede-be6b-d55c76ac6e24" />

2. Student Directory
 <img width="1915" height="962" alt="02-student-directory" src="https://github.com/user-attachments/assets/2f4f845e-cd7d-441c-8210-ce29eedc9831" />

3. Add Student Form
 <img width="1910" height="966" alt="03-add-student-form" src="https://github.com/user-attachments/assets/8f8c8fdb-8775-4e7e-bc96-19973cf9cbfd" />

4. Student Added Successfully <img width="1882" height="631" alt="04-student-added" src="https://github.com/user-attachments/assets/812344b7-055e-4531-aecb-3e7e6272fb7b" />

5. Edit Student<img width="1632" height="970" alt="05-edit-student" src="https://github.com/user-attachments/assets/5a891c6c-7ad7-447e-863c-791acdda5dad" />

6. Search and Filter<img width="1895" height="872" alt="06-search-filter" src="https://github.com/user-attachments/assets/768e2fbd-f883-47de-ab77-faf85b32c8f2" />

7. CSV Export<img width="1906" height="965" alt="csv-export" src="https://github.com/user-attachments/assets/cb3155c5-d815-43b0-9567-7802ee62ef7b" />

<img width="1905" height="956" alt="csv-export-report" src="https://github.com/user-attachments/assets/7a0867e2-72d6-4db7-9b25-0d68bb4abb79" />

8. Postman API Response
<img width="1907" height="995" alt="08-postman-api" src="https://github.com/user-attachments/assets/cd5e572d-f342-4b77-bb96-d57c51fcec06" />

9. Database Records <img width="1917" height="937" alt="09-database-records" src="https://github.com/user-attachments/assets/19755a5f-6370-4b00-aa14-89b915244d29" />



🧪 Testing Checklist

Dashboard loads successfully

Student records load from the backend

Add a student and refresh to confirm persistence

Edit a student and verify the updated values

Delete a test student

Search and filters work

CSV export downloads a file

/api/health reports a connected database

Test API endpoints using Postman

🔐 Environment and Security

Keep database connection strings in environment variables.

Do not commit .env files, passwords, or database credentials.

Set the frontend VITE_API_URL to the backend base URL.

Set backend DATABASE_URL and FRONTEND_ORIGIN in the backend deployment.

Redeploy the frontend after changing Vite environment variables.

🌐 Deployment

The frontend and backend can be hosted separately with PostgreSQL as the
database. Configure the frontend API base URL and environment variables
for deployed services, then test the full application.

Live demo:[ https://auspify-task2-student-management-sy.vercel.app/](url)

🔧 Backend Health Check:[https://smssystem.vercel.app/api/health?utm_source=chatgpt.com](url)

📊 Students API:[https://smssystem.vercel.app/api/students?utm_source=chatgpt.com](url)


👩‍💻 Author

Ravindi Sandali Perera
BSc (Hons) Software Engineering
Cardiff Metropolitan University degree programme through ICBT Campus,
Sri Lanka
