# School Database Design

## Table Explanations
* **students:** Stores the core user profile information for each learner, enforcing a unique email address to prevent duplicate registrations.
* **courses:** Acts as the catalogue of available subjects or modules offered by the institution.
* **enrolments:** The junction table that records which student is taking which course, alongside specific contextual data like their grade. 

## Relationships
* **One-to-Many:** One student can have many enrolments. One course can have many enrolments.
* **Many-to-Many:** Students and courses share a many-to-many relationship (a student takes multiple courses; a course has multiple students).
* **Join Table Necessity:** Relational databases cannot efficiently store arrays or lists of data in a single column. The `enrolments` join table resolves this by breaking the many-to-many relationship down into two separate one-to-many relationships, allowing for strict foreign key constraints and a place to store data specific to that exact pairing (the `grade`).

## Indexing
I would add an index to the `students` table on the `name` column: `CREATE INDEX idx_student_name ON students(name);`. The `email` column is already indexed automatically via the `UNIQUE` constraint, but filtering or searching for students by their name is a highly common operation in a school system. An index here would significantly speed up those string-matching lookups.

## SQL vs. NoSQL
For this specific system, SQL is the superior choice. The data is highly structured, and the core functionality relies on joining heavily related entities (students, courses, and their grades). SQL's strict schema enforcement and ACID compliance guarantee data integrity—ensuring that a student cannot be enrolled in a course that doesn't exist, and preventing duplicate enrolments via composite primary keys. A NoSQL document database would require either deep nesting (leading to duplication and sync issues when a course name changes) or complex application-level logic to maintain these relationships.