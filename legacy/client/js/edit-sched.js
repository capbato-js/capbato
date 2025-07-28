document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editScheduleForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const doctor = document.getElementById("doctorName").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    // Save to backend (optional)
    fetch("https://capstone-legacy.up.railway.app/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctor, date, time })

    })
      .then(res => res.json())
      .then(() => {
        // Notify parent to reload calendar
        window.parent.postMessage({ type: "scheduleUpdated" }, "*");
      })
      .catch(err => {
        alert("Failed to save schedule.");
        console.error(err);
      });
  });
});
