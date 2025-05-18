const form = document.getElementById("attendanceForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentID = document.getElementById("studentID").value;
  const scheduleID = document.getElementById("scheduleID").value;
  const date = document.getElementById("date").value;
  const status = document.getElementById("status").value;

  try {
    const res = await axios.post("/admin/attendance", {
      studentID,
      scheduleID,
      date,
      status
    });

    alert(res.data.message || "Attendance marked successfully!");
    form.reset();
  } catch (error) {
    console.error("Error marking attendance:", error);
    alert("Failed to mark attendance.");
  }
});
