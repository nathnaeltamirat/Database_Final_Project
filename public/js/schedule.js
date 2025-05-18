document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("schedule-form");
  const tableBody = document.querySelector("#schedule-table tbody");

  const fetchSchedules = async () => {
    try {
      const res = await axios.get("/admin/schedules");
      tableBody.innerHTML = "";

      res.data.forEach(sch => {
        const row = `
          <tr>
            <td>${sch.courseID}</td>
            <td>${sch.courseName}</td>
            <td>${sch.day}</td>
            <td>${sch.startTime}</td>
            <td>${sch.endTime}</td>
          </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
      });
    } catch (err) {
      console.error("Failed to load schedules", err);
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const courseID = document.getElementById("courseID").value;
    const day = document.getElementById("day").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    try {
      await axios.post("/admin/schedules", {
        courseID,
        day,
        startTime,
        endTime
      });

      alert("Schedule added successfully!");
      form.reset();
      fetchSchedules();
    } catch (err) {
      console.error("Failed to add schedule", err);
      alert("Failed to add schedule.");
    }
  });

  fetchSchedules();
});
