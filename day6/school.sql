-- 1. Create Tables
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
);

CREATE TABLE enrolments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 2. Insert Sample Data
INSERT INTO students (name, email) VALUES
('Alice Mwangi', 'alice@example.com'),
('Brian Omondi', 'brian@example.com'),
('Catherine Wanjiku', 'catherine@example.com'),
('David Mutua', 'david@example.com'); -- Added to test "no enrolments" query

INSERT INTO courses (title) VALUES
('Web Development'),
('Electrical Principles'),
('Control Engineering');

INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'),
(1, 2, 'B'),
(2, 1, 'C'),
(2, 3, 'A'),
(3, 2, 'B');

-- 3. Queries

-- All courses for one student (by name)
SELECT courses.title
FROM courses
JOIN enrolments ON courses.id = enrolments.course_id
JOIN students ON enrolments.student_id = students.id
WHERE students.name = 'Alice Mwangi';

-- All students on one course
SELECT students.name
FROM students
JOIN enrolments ON students.id = enrolments.student_id
JOIN courses ON enrolments.course_id = courses.id
WHERE courses.title = 'Web Development';

-- The number of students per course
SELECT courses.title, COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON courses.id = enrolments.course_id
GROUP BY courses.id, courses.title;

-- Students who have no enrolments
SELECT students.name
FROM students
LEFT JOIN enrolments ON students.id = enrolments.student_id
WHERE enrolments.course_id IS NULL;

-- Update of one enrolment's grade
UPDATE enrolments
SET grade = 'A+'
WHERE student_id = 1 AND course_id = 2;