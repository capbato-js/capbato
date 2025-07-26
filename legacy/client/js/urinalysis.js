const buttons = {
  patientbtn: "patients.html",
  dashboardbtn: "index.html",
  appointmentbtn: "appointments.html",
  laboratorybtn: "laboratory.html",
  prescriptionbtn: "prescriptions.html",
  schedulebtn: "doctor-schedule.html"
};

const patientBtn = document.getElementById("patientbtn");
const dashboardBtn = document.getElementById("dashboardbtn");
const appointmentBtn = document.getElementById("appointmentbtn");
const laboratoryBtn = document.getElementById("laboratorybtn");
const prescriptionBtn = document.getElementById("prescriptionbtn");
const scheduleBtn = document.getElementById("schedulebtn");

function formatDate(input) {
  if (!input) return getLocalToday();
  const d = new Date(input);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

function getLocalToday() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().split("T")[0];
}

window.addEventListener("message", (event) => {
  if (event.data?.type === "openLabForm") {
    const { patient_id, patient_name, date, selectedTests = [] } = event.data;

    document.getElementById("patientId").value = patient_id;
    document.getElementById("patientName").value = patient_name;
    document.getElementById("dateField").value = formatDate(date);

    document.querySelectorAll(".results input").forEach(input => {
      input.disabled = true;
      input.style.backgroundColor = "#e9ecef";
    });

    selectedTests.forEach(testId => {
      const field = document.getElementById(testId);
      if (field) {
        field.disabled = false;
        field.style.backgroundColor = "";
      }
    });

    fetch(`http://localhost:3001/patients/${patient_id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("age").value = data.Age || data.age || "";
        document.getElementById("sex").value = data.Gender || data.gender || "";
      })
      .catch(err => console.error("Error fetching patient info:", err));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (patientBtn) patientBtn.addEventListener("click", () => window.location.href = "patients.html");
  if (dashboardBtn) dashboardBtn.addEventListener("click", () => window.location.href = "index.html");
  if (appointmentBtn) appointmentBtn.addEventListener("click", () => window.location.href = "appointments.html");
  if (laboratoryBtn) laboratoryBtn.addEventListener("click", () => window.location.href = "laboratory.html");
  if (prescriptionBtn) prescriptionBtn.addEventListener("click", () => window.location.href = "prescriptions.html");

  const patientInput = document.getElementById("patientName");
  const patientIdInput = document.getElementById("patientId");
  const suggestionBox = document.getElementById("customSuggestions");

  if (patientInput && suggestionBox && patientIdInput) {
    patientInput.addEventListener("input", function () {
      const query = this.value.trim();
      suggestionBox.innerHTML = "";
      if (query.length < 2) return;

      fetch(`http://localhost:3001/patients/search?name=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data)) return;

          data.forEach(patient => {
            const item = document.createElement("div");
            item.textContent = patient.name;
            item.dataset.id = patient.id;
            suggestionBox.appendChild(item);

            item.addEventListener("click", () => {
              patientInput.value = patient.name;
              patientIdInput.value = patient.id;
              suggestionBox.innerHTML = "";

              fetch(`http://localhost:3001/patients/${patient.id}`)
                .then(res => res.json())
                .then(data => {
                  document.getElementById("age").value = data.Age || "";
                  document.getElementById("sex").value = data.Gender || "";
                })
                .catch(err => console.error("Error fetching patient info:", err));
            });
          });
        })
        .catch(err => console.error("Autocomplete fetch error:", err));
    });

    document.addEventListener("click", (e) => {
      if (!suggestionBox.contains(e.target) && e.target !== patientInput) {
        suggestionBox.innerHTML = "";
      }
    });
  }

  const dateField = document.getElementById("dateField");
  if (dateField) {
    dateField.value = getLocalToday();
  }

  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const patientId = document.getElementById("patientId").value;
      const patientName = document.getElementById("patientName").value;
      const date = document.getElementById("dateField").value;
      const age = document.getElementById("age").value;
      const sex = document.getElementById("sex").value;

      const selectedTestIds = Array.from(document.querySelectorAll(".results input"))
        .filter(input => !input.disabled)
        .map(input => input.id);

      const results = {};
      let filled = false;

      selectedTestIds.forEach(id => {
        const input = document.getElementById(id);
        const value = input.value.trim();
        if (value) {
          results[id] = value;
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
        .then(result => {
          window.parent.postMessage({
            action: "closeLabOverlay",
            toastMessage: "Urinalysis results submitted successfully!"
          }, "*");
        })
        .catch(error => {
          console.error("Error submitting data:", error);
          alert("There was a problem submitting the form.");
        });

      fetch(`http://localhost:3001/api/lab_requests/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...results,
          status: "Complete",
          date_taken: date
        })
      });
    });
  }
});
