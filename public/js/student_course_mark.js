document.getElementById("enroll-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentID = document.getElementById("studentID").value;
  const courseID = document.getElementById("courseID").value;
  const scheduleID = document.getElementById("scheduleID").value;
  const year = document.getElementById("year").value;
  const semester = document.getElementById("semester").value;

  try {
    const res = await axios.post("/admin/enroll", {
      studentID,
      courseID,
      scheduleID,
      year,
      semester
    });
    alert(res.data.message);
  } catch (err) {
    alert("Enrollment failed.");
    console.error(err);
  }
});

document.getElementById("mark-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentID = document.getElementById("mark-studentID").value;
  const courseID = document.getElementById("mark-courseID").value;
  const mark = document.getElementById("mark-value").value;

  try {
    const res = await axios.post("/admin/mark", {
      studentID,
      courseID,
      mark
    });
    alert(res.data.message);
  } catch (err) {
    alert("Mark assignment failed.");
    console.error(err);
  }
});
