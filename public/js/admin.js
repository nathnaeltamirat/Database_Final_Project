document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const adminPanel = document.getElementById("admin-panel");
  const studentTable = document.querySelector("#student-table tbody");
  const courseForm = document.getElementById("course-form");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchStudentID");

  searchBtn.addEventListener("click", async () => {
    const studentID = searchInput.value.trim();
    if (!studentID) {
      return alert("Please enter a student ID.");
    }

    try {
      const res = await axios.get(`/admin/students/${studentID}`);
      studentTable.innerHTML = ""; 

      const student = res.data;
      const row = `
        <tr>
          <td>${student.studentID}</td>
          <td>${student.firstName} ${student.lastName}</td>
          <td>${student.email}</td>
          <td>${student.dateOfBirth}</td>
          <td>${student.departmentName || ""}</td>
          <td>${student.city || ""}</td>
          <td>${student.phones || ""}</td>
        </tr>
      `;
      studentTable.insertAdjacentHTML("beforeend", row);
    } catch (err) {
      alert("Student not found or error occurred.");
      console.error(err);
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const res = await axios.post("/admin/login", { username, password });
      alert(res.data.message);
      adminPanel.style.display = "block";
      loginForm.style.display = "none";
      document.getElementById("title").style.display = "none";
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  });

  window.fetchStudents = async function () {
    try {
      const res = await axios.get("/admin/students");
      studentTable.innerHTML = "";
      res.data.forEach(student => {
        const row = `
          <tr>
            <td>${student.studentID}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.email}</td>
            <td>${student.dateOfBirth}</td>
            <td>${student.departmentName || ""}</td>
            <td>${student.city || ""}</td>
            <td>${student.phones || ""}</td>
          </tr>
        `;
        studentTable.insertAdjacentHTML("beforeend", row);
      });
    } catch (err) {
      alert("Failed to load students");
      console.error(err);
    }
  }

  courseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const courseName = document.getElementById("courseName").value;
    const creditHours = document.getElementById("creditHours").value;
    const departmentID = document.getElementById("departmentID").value;

    try {
      await axios.post("/admin/courses", {
        courseName,
        creditHours,
        departmentID
      });
      alert("Course added successfully");
      courseForm.reset();
    } catch (err) {
      alert("Failed to add course");
      console.error(err);
    }
  });
});
