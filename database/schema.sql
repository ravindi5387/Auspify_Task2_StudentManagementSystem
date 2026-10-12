-- StudentHub schema for Neon / PostgreSQL
CREATE TABLE IF NOT EXISTS students (
  id BIGSERIAL PRIMARY KEY,
  student_id VARCHAR(30) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(30),
  date_of_birth DATE,
  gender VARCHAR(20) NOT NULL DEFAULT 'Other' CHECK (gender IN ('Male','Female','Other')),
  course VARCHAR(150) NOT NULL,
  year_of_study SMALLINT NOT NULL CHECK (year_of_study BETWEEN 1 AND 8),
  address VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','Inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_name ON students (last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_students_course ON students (course);
CREATE INDEX IF NOT EXISTS idx_students_year ON students (year_of_study);

INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth, gender, course, year_of_study, address)
VALUES
('STU001','Amal','Perera','amal@example.com','0711111111','2004-04-12','Male','BSc Software Engineering',2,'Colombo'),
('STU002','Sithmi','Silva','sithmi@example.com','0773333333','2004-12-03','Female','BSc Information Technology',3,'Galle')
ON CONFLICT DO NOTHING;
