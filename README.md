# Database_Final_Project

# Student Information System – Database Final Project

This is a MySQL-based database project for managing a student information system, developed with Node.js. The project includes a normalized relational schema supporting student records, courses, schedules, and attendance.

---

## 📁 Project Structure
  ```bash 
Database_Final_Project/  
├── config/  
│ ├── config.js # Environment-based config setup  
│ └── db.js # MySQL connection pool setup  
├── model/  
│ └── create_table.js # Script to create database tables  
├── .env # Environment variables  
├── package.json  
└── README.md  
```
## SETUP Instruction
## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Database_Final_Project.git
cd Database_Final_Project
```
### 2. Install neccessary packages
```bash
npm install
```
### 3. Configure Enviromental Variables
```bash
NODE_ENV=development
PORT=3000

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=database_project
```

## 🛠 Run the Table Creation Script

This script will create all necessary tables with proper foreign key constraints.

```bash
node model/create_table.js

```
---


### 🧱 **Database Schema Overview**
```bash

The project defines the following tables:

- `students`
- `phone`
- `address`
- `department`
- `courses`
- `schedule`
- `enrollment`
- `mark`
- `attendance`
- `admin`

Each table is connected through appropriate foreign keys for normalization and referential integrity.
```

### Running The app
```bash
npm start
```
### Displaying on the browser
```bash
on your browsers earch localhost:3000
```





