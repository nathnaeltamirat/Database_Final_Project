const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./config/db");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.get("", (req, res) => {
    // console.log(req.body);
    // res.sendFile(__dirname + "/public/student_registeration.html");
    });
app.get("/admin", (req, res) => {
    console.log(req.body);
    res.sendFile(__dirname + "/public/admin.html");
    });
app.get("/register", (req, res) => {
    console.log(req.body);
    res.sendFile(__dirname + "/public/student_registeration.html");
    });
app.get("/schedule", (req, res) => {
    console.log(req.body);
    res.sendFile(__dirname + "/public/schedule.html");
    });
app.get("/enrollment", (req, res) => {
    console.log(req.body);
    res.sendFile(__dirname + "/public/coursemark.html");
    });
app.get("/attendance", (req, res) => {
    console.log(req.body);
    res.sendFile(__dirname + "/public/attendance.html");
    });
app.post("/api/register", async (req, res) => {
  const { email, firstName, lastName, phones, woreda, city, subcity, DepartmentID, dateOfBirth } = req.body;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [studentResult] = await connection.query(
      "INSERT INTO students (firstName, lastName, email, dateOfBirth,DepartmentID) VALUES (?, ?, ?, ?,?)",
      [firstName, lastName, email, dateOfBirth,DepartmentID]
    );
    const studentID = studentResult.insertId;

    const [addressResult] = await connection.query(
      "INSERT INTO address (city, subcity, woreda) VALUES (?, ?, ?)",
      [city, subcity, woreda]
    );
    const addressID = addressResult.insertId;



    await connection.query(
      "UPDATE students SET addressID = ? WHERE studentID = ?",
      [addressID, studentID]
    );

    for (const phone of phones) {
      const [phoneResult] = await connection.query(
        "INSERT INTO phone (phoneNumber) VALUES (?)",
        [phone]
      );
      const phoneID = phoneResult.insertId;

      await connection.query(
        "INSERT INTO studPhone (studentID, phoneID) VALUES (?, ?)",
        [studentID, phoneID]
      );
    }

    await connection.commit();
    res.json({ message: "Registration successful" });
    console.log("Registration successful");
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Transaction failed:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  } finally {
    if (connection) connection.release();
  }
});
app.post("/admin/courses", async(req,res)=>{
    const {courseName,creditHours,departmentID} = req.body;
    try{
        const [dep] = await pool.query("SELECT * FROM department WHERE departmentID = ?", [departmentID]);
        if (dep.length === 0) {
            return res.status(400).json({ message: "Department not found" });
        }
        const[rows] = await pool.query("INSERT INTO courses (courseName,creditHours,departmentID) Values(?,?,?)",
        [courseName,creditHours,departmentID]
        )
        if (rows.affectedRows > 0) {
            res.json({ message: "Course added successfully" });
        } else {
            res.status(401).json({ message: "Failed to add course" });
        }
    }catch(err){
        console.error("Course addition error:", err);
        res.status(500).json({ message: "Failed to add course", error: err.message });
    }
})
app.get("/admin/students", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.studentID, s.firstName, s.lastName, s.email, s.dateOfBirth, d.departmentName, a.city, GROUP_CONCAT(p.phoneNumber) AS phones
            FROM students s
            LEFT JOIN department d ON s.DepartmentID = d.DepartmentID
            LEFT JOIN address a ON s.addressID = a.AddressID
            LEFT JOIN studPhone sp ON s.studentID = sp.studentID
            LEFT JOIN phone p ON sp.phoneID = p.PhoneID
            GROUP BY s.studentID LIMIT 5
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Failed to fetch students", error: error.message });
    }
});
app.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const [rows] = await pool.query("SELECT * FROM admin WHERE username = ? AND password = ?", [username, password]);
    
        if (rows.length > 0) {
        res.json({ message: "Login successful" });
        } else {
        res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
    }
);
app.get("/admin/students/:studentID", async (req, res) => {
    const studentID = req.params.studentID;
    try{
               const [rows] = await pool.query(`
            SELECT s.studentID, s.firstName, s.lastName, s.email, s.dateOfBirth, d.departmentName, a.city, GROUP_CONCAT(p.phoneNumber) AS phones
            FROM students s
            LEFT JOIN department d ON s.DepartmentID = d.DepartmentID
            LEFT JOIN address a ON s.addressID = a.AddressID
            LEFT JOIN studPhone sp ON s.studentID = sp.studentID
            LEFT JOIN phone p ON sp.phoneID = p.PhoneID
            where s.studentID = ?
            GROUP BY s.studentID LIMIT 5 

        `, [studentID]);

        if(rows.length > 0){
            res.json(rows[0]);
        }
        else{
            res.status(404).json({ message: "Student not found" });
        }

    }catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ message: "Failed to fetch student", error: error.message });
    }
});
app.post("/admin/schedules", async (req, res) => {
    const {courseID, day, startTime, endTime} = req.body;
    try{
        const [rows ] = await pool.query('select * from courses where courseID = ?', [courseID]);
        if(rows.length === 0){
            return res.status(400).json({ message: "Course not found" });
        }
        const [schedule] = await pool.query('Insert into schedule(day, startTime, endTime, courseID) values(?,?,?,?)',
        [day, startTime, endTime, courseID]
        );
        if (schedule.affectedRows > 0) {
            res.json({ message: "Schedule added successfully" });
        } else {
            res.status(401).json({ message: "Failed to add schedule" });
        }
    }catch (error) {
        console.error("Error adding schedule:", error);
        res.status(500).json({ message: "Failed to add schedule", error: error.message });
    }
});
app.get("/admin/schedules", async (req, res) => {
 
    try{
        const [rows ] = await pool.query('select day, s.courseID, startTime,endTime, courseName from schedule s join courses c on s.courseID = c.courseID');
        if(rows.length === 0){
            return res.status(400).json({ message: "Course not found" });
        }
        res.json(rows);
    }catch (error) {
        console.error("Error adding schedule:", error);
        res.status(500).json({ message: "Failed to add schedule", error: error.message });
    }
});
app.post("/admin/enroll", async (req, res) => {
    const {studentID, courseID, scheduleID, year, semester} = req.body;
    try{
        const [student] = await pool.query('select * from students where studentID = ?', [studentID]);
        if(student.length == 0){
            return res.status(400).json({ message: "Student not found" });
        }
        const [course] = await pool.query('select * from courses where courseID = ?', [courseID]);
        if(course.length == 0){
            return res.status(400).json({ message: "Course not found" });
        }
        const[schedule] = await pool.query('select * from schedule where scheduleID = ?', [scheduleID]);
        if(schedule.length == 0){
            return res.status(400).json({ message: "Schedule not found" });
        }
        const [existing] = await pool.query(
        `SELECT * FROM enrollment 
        WHERE studentID = ? AND courseID = ?`,
        [studentID, courseID]
        );
    

        if (existing.length > 0) {
        return res.status(400).json({ message: "Student already enrolled in this course for the given schedule, year, and semester." });
        }

        const [enroll] = await pool.query('Insert into enrollment(year, semester, studentID, courseID, scheduleID) values(?,?,?,?,?)',
        [year, semester, studentID, courseID, scheduleID]
        );
        if (enroll.affectedRows > 0) {
            res.json({ message: "Enrollment added successfully" });
        } else {
            res.status(401).json({ message: "Failed to add enrollment" });
        }
    }catch(error) {
        console.error("Error adding enrollment:", error);
        res.status(500).json({ message: "Failed to add enrollment", error: error.message });
    }
});
app.post("/admin/mark", async (req, res) => {
    const {studentID, courseID, mark} = req.body;
    try {
        const [student] = await pool.query('select * from students where studentID = ?', [studentID]);
        if (student.length == 0) {
            return res.status(400).json({ message: "Student not found" });
        }
        const [course] = await pool.query('select * from courses where courseID = ?', [courseID]);
        if (course.length == 0) {
            return res.status(400).json({ message: "Course not found" });
        }
        const [existing] = await pool.query(
            `SELECT * FROM mark 
            WHERE studentID = ? AND courseID = ?`,
            [studentID, courseID]
        );
        const[enrolled] = await pool.query(
            `SELECT * FROM enrollment where studentID = ? and courseID = ?`,
            [studentID, courseID]);
        if (enrolled.length == 0) {
            return res.status(400).json({ message: "Student not enrolled in this course." });
        }
        if (existing.length > 0) {
            return res.status(400).json({ message: "Mark already exists for this student and course." });
        }
        const [rows] = await pool.query('Insert into mark(mark, studentID, courseID) values(?,?,?)',
            [mark, studentID, courseID]
        );
        if (rows.affectedRows > 0) {
            res.json({ message: "Mark added successfully" });
        } else {
            res.status(401).json({ message: "Failed to add mark" });
        }
    } catch (err) {
        console.error("Error adding mark:", err);
        res.status(500).json({ message: "Failed to add mark", error: err.message });
    }
});

app.post("/admin/attendance", async (req, res) => {
    const { studentID, scheduleID, date, status } = req.body;

    try{
    const [student] = await pool.query('select * from students where studentID = ?', [studentID]);
        if(student.length == 0){
            return res.status(400).json({ message: "Student not found" });
        }
    const [enrolled] = await pool.query('select * from enrollment where studentID = ? and scheduleID = ?', [studentID, scheduleID]);
    if(enrolled.length == 0){
        return res.status(400).json({ message: "Student not enrolled in this schedule" });
    }
    const[schedule] = await pool.query('select * from schedule where scheduleID = ?', [scheduleID]);
        if(schedule.length == 0){
            return res.status(400).json({ message: "Schedule not found" });
        }
    const [existing] = await pool.query(
        `SELECT * FROM attendance 
        WHERE studentID = ? AND scheduleID = ? AND date = ?`,
        [studentID, scheduleID, date]
    );
    if (existing.length > 0) {
        return res.status(400).json({ message: "Attendance already exists for this student and schedule on the given date." });
    }
    await pool.query('Insert into attendance(date, status, studentID, scheduleID) values(?,?,?,?)',
        [date, status, studentID, scheduleID]
    );
    return res.json({ message: "Attendance added successfully" });
    }catch(err){
        console.error("Error adding attendance:", err);
        res.status(500).json({ message: "Failed to add attendance", error: err.message });
    }
});
app.get("/admin/students/:studentID/attendance", async (req, res) => {
    studentID = req.params.studentID;
    try{
        const [student] = await pool.query('select * from students where studentID = ?', [studentID]);
        if(student.length == 0){
            return res.status(400).json({ message: "Student not found" });
        }
        const [rows] = await pool.query(`
            SELECT c.courseName, AVG(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100 AS attendancePercentage
            FROM attendance a
            JOIN schedule s ON a.scheduleID = s.scheduleID
            JOIN courses c ON s.courseID = c.courseID
            WHERE a.studentID = ?
            GROUP BY c.courseName
        `, [studentID]);
        res.json(rows);
    }catch(err){
        console.error("Error fetching attendance:", err);
        res.status(500).json({ message: "Failed to fetch attendance", error: err.message });
    }
});

app.get("/admin/students/:studentID/courses", async (req, res) => {
    const studentID = req.params.studentID;
    try{
        const [student] = await pool.query('select * from students where studentID = ?', [studentID]);
        if(student.length == 0){
            return res.status(400).json({ message: "Student not found" });
        }
        const [rows] = await pool.query(`
            SELECT c.courseName, c.creditHours
            FROM enrollment e
            JOIN courses c ON e.courseID = c.courseID
            WHERE e.studentID = ?
        `, [studentID]);
        res.json(rows);
    }catch(err){
        console.error("Error fetching courses:", err);
        res.status(500).json({ message: "Failed to fetch courses", error: err.message });
    }
});
module.exports = app
