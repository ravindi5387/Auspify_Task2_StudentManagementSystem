import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || 5000);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
  max: 10,
});
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

const selectFields = `id, student_id AS "studentId", first_name AS "firstName",
 last_name AS "lastName", email, phone, date_of_birth AS "dateOfBirth", gender,
 course, year_of_study AS "yearOfStudy", address, status,
 created_at AS "createdAt", updated_at AS "updatedAt"`;

function validate(body: any): string | null {
  if (!body.studentId?.trim() || !body.firstName?.trim() || !body.lastName?.trim() ||
      !body.email?.trim() || !body.course?.trim() || !body.yearOfStudy) return "Please complete all required fields.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "Enter a valid email address.";
  if (!Number.isInteger(Number(body.yearOfStudy)) || Number(body.yearOfStudy) < 1 || Number(body.yearOfStudy) > 8) return "Year of study must be between 1 and 8.";
  if (body.gender && !["Male","Female","Other"].includes(body.gender)) return "Select a valid gender.";
  if (body.status && !["Active","Inactive"].includes(body.status)) return "Select a valid status.";
  return null;
}
function handleDbError(error: any, res: Response) {
  if (error?.code === "23505") return res.status(409).json({ message: "Student ID or email already exists." });
  console.error(error);
  return res.status(500).json({ message: "Server error. Check the backend terminal and database connection." });
}
app.get("/api/health", async (_req, res) => {
  try { await pool.query("SELECT 1"); res.json({ status: "ok", database: "connected" }); }
  catch (e) { console.error(e); res.status(503).json({ status: "error", database: "disconnected" }); }
});
app.get("/api/students", async (req, res) => {
  try {
    const search = `%${String(req.query.search || "").trim()}%`;
    const course = String(req.query.course || "");
    const year = String(req.query.year || "");
    const result = await pool.query(
      `SELECT ${selectFields} FROM students
       WHERE ($1 = '%%' OR student_id ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR course ILIKE $1)
       AND ($2 = '' OR course = $2) AND ($3 = '' OR year_of_study::text = $3)
       ORDER BY created_at DESC, id DESC`,
      [search, course, year]
    );
    res.json(result.rows);
  } catch (e) { handleDbError(e, res); }
});
app.get("/api/students/:id", async (req, res) => {
  try {
    const result = await pool.query(`SELECT ${selectFields} FROM students WHERE id = $1`, [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: "Student not found." });
    res.json(result.rows[0]);
  } catch (e) { handleDbError(e, res); }
});
app.post("/api/students", async (req, res) => {
  const b = req.body;
  const error = validate(b);
  if (error) return res.status(400).json({ message: error });
  try {
    const result = await pool.query(
      `INSERT INTO students (student_id,first_name,last_name,email,phone,date_of_birth,gender,course,year_of_study,address,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [b.studentId.trim(),b.firstName.trim(),b.lastName.trim(),b.email.trim().toLowerCase(),b.phone || null,b.dateOfBirth || null,b.gender || "Other",b.course.trim(),Number(b.yearOfStudy),b.address || null,b.status || "Active"]
    );
    const row = await pool.query(`SELECT ${selectFields} FROM students WHERE id=$1`, [result.rows[0].id]);
    res.status(201).json(row.rows[0]);
  } catch (e) { handleDbError(e, res); }
});
app.put("/api/students/:id", async (req, res) => {
  const b = req.body;
  const error = validate(b);
  if (error) return res.status(400).json({ message: error });
  try {
    const result = await pool.query(
      `UPDATE students SET student_id=$1,first_name=$2,last_name=$3,email=$4,phone=$5,date_of_birth=$6,
       gender=$7,course=$8,year_of_study=$9,address=$10,status=$11,updated_at=NOW()
       WHERE id=$12 RETURNING id`,
      [b.studentId.trim(),b.firstName.trim(),b.lastName.trim(),b.email.trim().toLowerCase(),b.phone || null,b.dateOfBirth || null,b.gender || "Other",b.course.trim(),Number(b.yearOfStudy),b.address || null,b.status || "Active",req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ message: "Student not found." });
    const row = await pool.query(`SELECT ${selectFields} FROM students WHERE id=$1`, [req.params.id]);
    res.json(row.rows[0]);
  } catch (e) { handleDbError(e, res); }
});
app.delete("/api/students/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM students WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: "Student not found." });
    res.json({ message: "Student deleted successfully." });
  } catch (e) { handleDbError(e, res); }
});
app.use((_req, res) => res.status(404).json({ message: "Endpoint not found." }));
app.listen(port, () => console.log(`StudentHub API running at http://localhost:${port}`));
