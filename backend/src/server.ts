import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const app = express();

const port = Number(process.env.PORT || 5000);

// ========================================
// Database Configuration
// ========================================

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is missing.");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl?.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
  max: 10,
});

// ========================================
// CORS Configuration
// ========================================

const allowedOrigins = [
  "http://localhost:5173",

  // Vercel production frontend domain
  "https://auspify-task2-student-management-sy.vercel.app",

  // Vercel preview deployment domain
  "https://auspify-task2-student-management-sy-git-3f94a1-ravindi-projects.vercel.app",
];

const configuredOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const permittedOrigins = [
  ...new Set([...allowedOrigins, ...configuredOrigins]),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an Origin header are allowed.
      // This includes tools such as curl and Postman.
      if (!origin || permittedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "1mb" }));

// ========================================
// Student Database Fields
// ========================================

const selectFields = `
  id,
  student_id AS "studentId",
  first_name AS "firstName",
  last_name AS "lastName",
  email,
  phone,
  date_of_birth AS "dateOfBirth",
  gender,
  course,
  year_of_study AS "yearOfStudy",
  address,
  status,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

// ========================================
// Validation
// ========================================

function validate(body: any): string | null {
  if (!body || typeof body !== "object") {
    return "Invalid request body.";
  }

  if (
    typeof body.studentId !== "string" ||
    !body.studentId.trim() ||
    typeof body.firstName !== "string" ||
    !body.firstName.trim() ||
    typeof body.lastName !== "string" ||
    !body.lastName.trim() ||
    typeof body.email !== "string" ||
    !body.email.trim() ||
    typeof body.course !== "string" ||
    !body.course.trim() ||
    body.yearOfStudy === undefined ||
    body.yearOfStudy === null ||
    body.yearOfStudy === ""
  ) {
    return "Please complete all required fields.";
  }

  const email = body.email.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }

  const year = Number(body.yearOfStudy);

  if (!Number.isInteger(year) || year < 1 || year > 8) {
    return "Year of study must be between 1 and 8.";
  }

  if (body.gender && !["Male", "Female", "Other"].includes(body.gender)) {
    return "Select a valid gender.";
  }

  if (body.status && !["Active", "Inactive"].includes(body.status)) {
    return "Select a valid status.";
  }

  return null;
}

// ========================================
// Database Error Handling
// ========================================

function handleDbError(error: any, res: Response) {
  if (error?.code === "23505") {
    return res.status(409).json({
      message: "Student ID or email already exists.",
    });
  }

  console.error("Database error:", error);

  return res.status(500).json({
    message: "Server error. Check the backend logs and database connection.",
  });
}

// ========================================
// Health Check
// ========================================

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    return res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// ========================================
// GET All Students
// Supports search, course and year filters
// ========================================

app.get("/api/students", async (req, res) => {
  try {
    const search = `%${String(req.query.search || "").trim()}%`;
    const course = String(req.query.course || "");
    const year = String(req.query.year || "");

    const result = await pool.query(
      `SELECT ${selectFields}
       FROM students
       WHERE (
         $1 = '%%'
         OR student_id ILIKE $1
         OR first_name ILIKE $1
         OR last_name ILIKE $1
         OR email ILIKE $1
         OR course ILIKE $1
       )
       AND ($2 = '' OR course = $2)
       AND ($3 = '' OR year_of_study::text = $3)
       ORDER BY created_at DESC, id DESC`,
      [search, course, year],
    );

    return res.json(result.rows);
  } catch (error) {
    return handleDbError(error, res);
  }
});

// ========================================
// GET Student By ID
// ========================================

app.get("/api/students/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${selectFields}
       FROM students
       WHERE id = $1`,
      [req.params.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return handleDbError(error, res);
  }
});

// ========================================
// CREATE Student
// ========================================

app.post("/api/students", async (req, res) => {
  const body = req.body;

  const validationError = validate(body);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO students (
        student_id,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        gender,
        course,
        year_of_study,
        address,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [
        body.studentId.trim(),
        body.firstName.trim(),
        body.lastName.trim(),
        body.email.trim().toLowerCase(),
        body.phone || null,
        body.dateOfBirth || null,
        body.gender || "Other",
        body.course.trim(),
        Number(body.yearOfStudy),
        body.address || null,
        body.status || "Active",
      ],
    );

    const student = await pool.query(
      `SELECT ${selectFields}
       FROM students
       WHERE id = $1`,
      [result.rows[0].id],
    );

    return res.status(201).json(student.rows[0]);
  } catch (error) {
    return handleDbError(error, res);
  }
});

// ========================================
// UPDATE Student
// ========================================

app.put("/api/students/:id", async (req, res) => {
  const body = req.body;

  const validationError = validate(body);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const result = await pool.query(
      `UPDATE students
       SET
         student_id = $1,
         first_name = $2,
         last_name = $3,
         email = $4,
         phone = $5,
         date_of_birth = $6,
         gender = $7,
         course = $8,
         year_of_study = $9,
         address = $10,
         status = $11,
         updated_at = NOW()
       WHERE id = $12
       RETURNING id`,
      [
        body.studentId.trim(),
        body.firstName.trim(),
        body.lastName.trim(),
        body.email.trim().toLowerCase(),
        body.phone || null,
        body.dateOfBirth || null,
        body.gender || "Other",
        body.course.trim(),
        Number(body.yearOfStudy),
        body.address || null,
        body.status || "Active",
        req.params.id,
      ],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    const student = await pool.query(
      `SELECT ${selectFields}
       FROM students
       WHERE id = $1`,
      [req.params.id],
    );

    return res.json(student.rows[0]);
  } catch (error) {
    return handleDbError(error, res);
  }
});

// ========================================
// DELETE Student
// ========================================

app.delete("/api/students/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM students WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    return res.json({
      message: "Student deleted successfully.",
    });
  } catch (error) {
    return handleDbError(error, res);
  }
});

// ========================================
// Not Found Handler
// ========================================

app.use((_req, res) => {
  return res.status(404).json({
    message: "Endpoint not found.",
  });
});

// ========================================
// Error Handler
// ========================================

app.use(
  (error: any, _req: Request, res: Response, _next: express.NextFunction) => {
    console.error("Request error:", error.message);

    if (error.message === "Origin not allowed by CORS") {
      return res.status(403).json({
        message: "Origin not allowed by CORS.",
      });
    }

    return res.status(500).json({
      message: "Internal server error.",
    });
  },
);

// ========================================
// Local Development Server
// ========================================

// Vercel can import the Express app as a request handler.
// Local development still starts a listening server.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`StudentHub API running on port ${port}`);
  });
}

export default app;
