async function fetchStudentInfo() {
  const studentID = document.getElementById("studentID").value;
  if (!studentID) return alert("Please enter a student ID");

  try {
    const res = await axios.get(`/admin/students/${studentID}`);
    const data = res.data;

    document.getElementById("name").textContent = `${data.firstName} ${data.lastName}`;
    document.getElementById("email").textContent = data.email;
    document.getElementById("department").textContent = data.departmentName;
    document.getElementById("city").textContent = data.city || "N/A";
    document.getElementById("phones").textContent = data.phones || "N/A";

    document.getElementById("studentInfo").style.display = "block";

    fetchAttendance(studentID);
    fetchCourses(studentID);
  } catch (err) {
    alert("Failed to fetch student info");
    console.error(err);
  }
}

async function fetchAttendance(studentID) {
  try {
    const res = await axios.get(`/admin/students/${studentID}/attendance`);
    const data = res.data;

    let html = "<ul>";
    data.forEach(item => {
      html += `<li><strong>${item.courseName}:</strong> ${item.attendancePercentage}%</li>`;
    });
    html += "</ul>";

    document.getElementById("attendanceSection").innerHTML = html;
  } catch (err) {
    document.getElementById("attendanceSection").innerHTML = "<p>Failed to load attendance data.</p>";
    console.error(err);
  }
}

async function fetchCourses(studentID) {
  try {
    const res = await axios.get(`/admin/students/${studentID}/courses`);
    const data = res.data;

    let html = "";
    html += "<h3>Enrolled Courses with credit hours:</h3></br>";
    html += "<ul>";
    data.forEach(course => {
      html += `<li>${course.courseName} - <em>${course.creditHours}</em></li>`;
    });
    html += "</ul>";

    document.getElementById("coursesSection").innerHTML = html;
  } catch (err) {
    document.getElementById("coursesSection").innerHTML = "<p>Failed to load course data.</p>";
    console.error(err);
  }
}
