# School API — Database Integration with Prisma & PostgreSQL

A backend REST API built with Node.js and Express.js demonstrating 
complete database integration using PostgreSQL and Prisma ORM. 
Features full CRUD operations, model relationships, database indexing, 
and data validation.

## Features

- Full CRUD operations on Students, Courses, and Enrollments
- Relational database design with foreign keys and associations
- Database indexing for query optimization and performance
- Data validation before saving any record to the database
- Proper error handling with meaningful HTTP status codes
- Many-to-many relationship between Students and Courses 
  through Enrollments join table
- Unique constraint to prevent duplicate enrollments
- Cascade delete — removing a student automatically 
  removes their enrollments

## Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: PostgreSQL
- ORM: Prisma (v6)
- Language: JavaScript

## Getting Started

cd school-api
npm install
npx prisma migrate dev --name init
npm run dev

## API Endpoints

### Students
POST   /api/students        Create a student
GET    /api/students        Get all students
GET    /api/students/:id    Get one student
PUT    /api/students/:id    Update a student
DELETE /api/students/:id    Delete a student

### Courses
POST   /api/courses         Create a course
GET    /api/courses         Get all courses
GET    /api/courses/:id     Get one course
PUT    /api/courses/:id     Update a course
DELETE /api/courses/:id     Delete a course

### Enrollments
POST   /api/enrollments           Enroll a student
GET    /api/enrollments           Get all enrollments
PATCH  /api/enrollments/:id/grade Assign a grade
DELETE /api/enrollments/:id       Remove enrollment
