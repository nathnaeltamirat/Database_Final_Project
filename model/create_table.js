const pool = require('../config/db');


async function createTables() {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
try {
    // Clean all data from tables (truncate in reverse FK order)
    await connection.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await connection.query(`TRUNCATE TABLE studPhone;`);
    await connection.query(`TRUNCATE TABLE attendance;`);
    await connection.query(`TRUNCATE TABLE enrollment;`);
    await connection.query(`TRUNCATE TABLE mark;`);
    await connection.query(`TRUNCATE TABLE students;`);
    await connection.query(`TRUNCATE TABLE schedule;`);
    await connection.query(`TRUNCATE TABLE courses;`);
    await connection.query(`TRUNCATE TABLE department;`);
    await connection.query(`TRUNCATE TABLE address;`);
    await connection.query(`TRUNCATE TABLE phone;`);
    await connection.query(`TRUNCATE TABLE admin;`);
    await connection.query(`SET FOREIGN_KEY_CHECKS = 1;`);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS phone (
            PhoneID int auto_increment primary key,
            phoneNumber varchar(15) not null
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS department (
            DepartmentID int auto_increment primary key,
            departmentName varchar(50) not null
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS address (
            AddressID int auto_increment primary key,
            city varchar(50) not null,
            subcity varchar(50) not null,
            woreda varchar(50) not null
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS courses (
            courseID int auto_increment primary key,
            courseName varchar(50) not null unique,
            creditHours int not null,
            DepartmentID int,
            foreign key (DepartmentID) references department(DepartmentID)
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS schedule (
            scheduleID int auto_increment primary key,
            courseID int,
            day enum('Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday') not null,
            startTime time not null,
            endTime time not null,
            foreign key (courseID) references courses(courseID)
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS students (
            studentID int auto_increment primary key,
            firstName varchar(50) not null,
            lastName varchar(50) not null,
            email varchar(50) not null,
            gender enum('M','F') not null,
            dateOfBirth date not null,
            PhoneID int,
            DepartmentID int,
            AddressID int,
            foreign key (PhoneID) references phone(PhoneID),
            foreign key (DepartmentID) references department(DepartmentID),
            foreign key (AddressID) references address(AddressID)
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS mark (
            markID int auto_increment primary key,
            mark int not null,
            studentID int,
            courseID int,
            foreign key (studentID) references students(studentID),
            foreign key (courseID) references courses(courseID)
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS enrollment (
            enrollmentID int auto_increment primary key,
            year int not null,
            semester enum('1','2') not null,
            studentID int,
            courseID int,
            scheduleID int,
            foreign key (studentID) references students(studentID),
            foreign key (courseID) references courses(courseID),
            foreign key (scheduleID) references schedule(scheduleID)
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS attendance (
            attendanceID int auto_increment primary key,
            date date not null,
            status enum('Present','Absent') not null,
            scheduleID int,
            foreign key (scheduleID) references schedule(scheduleID)
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS admin (
            adminID int auto_increment primary key,
            username varchar(50) not null,
            password varchar(50) not null
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS studPhone (
            studPhoneID int auto_increment primary key,
            PhoneID int,
            studentID int,
            foreign key (PhoneID) references phone(PhoneID),
            foreign key (studentID) references students(studentID)
        );
    `);
    await connection.query(`
  CREATE TABLE IF NOT EXISTS department (
    DepartmentID int auto_increment primary key,
    departmentName varchar(50) not null
);
`);

await connection.query(`
  INSERT IGNORE INTO department (DepartmentID, departmentName)
  VALUES 
    (1, 'Software Enginerring'),
    (2, 'Electrical Engineering'),
    (3, 'Mechanical Engineering'),
    (4, 'Electromechanical'),
    (5, 'Biotechnology');
`);



  

    // Drop foreign key constraint temporarily if it exist

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    console.error("Error during table creation:", err);
    throw err;
  } finally {
    connection.release();
  }
}

createTables()
    .then(() => {
        console.log("Tables created successfully");
    })
    .catch((err) => {
        console.error("Error creating tables: ", err);
    });
console.log("DB password is:", process.env.MYSQL_PASSWORD);
