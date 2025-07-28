document.addEventListener("DOMContentLoaded", () => {
  const patientInput = document.getElementById("patientName");
  const patientIdInput = document.getElementById("patientId");
  const ageInput = document.getElementById("age");
  const sexInput = document.getElementById("sex");
  const dateField = document.getElementById("dateField");
  const submitBtn = document.getElementById("submitBtn");

  if (dateField) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    dateField.value = today.toISOString().split("T")[0];
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const patientId = patientIdInput.value;
      const patientName = patientInput.value;
      const age = ageInput.value;
      const sex = sexInput.value;
      const doctor = document.getElementById("doctor").value;
      const date = dateField.value;

      const results = {
        ft3: document.getElementById("ft3").value,
        ft4: document.getElementById("ft4").value,
        tsh: document.getElementById("tsh").value
      };

      const filled = Object.values(results).some(value => value.trim() !== "");
      if (!filled) {
        alert("Please fill out at least one result.");
        return;
      }

      const dataToSend = {
        patient_id: patientId,
        patient_name: patientName,
        age,
        sex,
        doctor,
        date_taken: date,
        status: "Complete",
        ...results
      };

      fetch("https://capstone-legacy.up.railway.app/api/lab_requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      })
      .then(response => {
        if (!response.ok) throw new Error("Failed to save data");
        return response.json();
      })
      .then(() => {
        window.parent.postMessage({
          action: "closeLabOverlay",
          toastMessage: "Serology & Immunology results submitted successfully!"
        }, "*");
      })
      .catch(error => {
        console.error("Error submitting data:", error);
        alert("There was a problem submitting the form.");
      });

      fetch(`https://capstone-legacy.up.railway.app/api/lab_requests/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...results, status: "Complete", date_taken: date })
      });
    });
  }
});
