document.addEventListener("DOMContentLoaded", () => {
  const dateField = document.getElementById("dateField");
  if (dateField) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    dateField.value = today.toISOString().split("T")[0];
  }

  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const patientId = document.getElementById("patientId").value;
      const patientName = document.getElementById("patientName").value;
      const age = document.getElementById("age").value;
      const sex = document.getElementById("sex").value;
      const date = dateField.value;

      const testIds = [
        "color", "consistency", "rbc", "wbc",
        "occult_blood", "urobilinogen", "others"
      ];

      const results = {};
      let filled = false;

      testIds.forEach(id => {
        const input = document.getElementById(id);
        if (input && input.value.trim()) {
          results[id] = input.value.trim();
          filled = true;
        }
      });

      if (!filled) {
        alert("Please fill out at least one result.");
        return;
      }

      const dataToSend = {
        patient_id: patientId,
        patient_name: patientName,
        age,
        sex,
        date_taken: date,
        status: "Complete",
        ...results
      };

      fetch("http://localhost:3001/api/lab_requests", {
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
          toastMessage: "Fecalysis results submitted successfully!"
        }, "*");
      })
      .catch(error => {
        console.error("Error submitting data:", error);
        alert("There was a problem submitting the form.");
      });
    });
  }
});
