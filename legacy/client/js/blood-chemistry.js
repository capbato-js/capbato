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
    const { patient_id, patient_name, date, selectedTests = [], readOnly = false } = event.data;

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
        field.disabled = readOnly;
        field.style.backgroundColor = readOnly ? "#e9ecef" : "";

        // Clear the value unless in view mode (readOnly = true)
        if (!readOnly) {
          field.value = "";
        }
      }
    });

    const submitBtn = document.getElementById("submitBtn");
    const printBtn = document.getElementById("printBtn");

    if (submitBtn) {
      submitBtn.style.display = readOnly ? "none" : "inline-block";
    }
    if (printBtn) {
      printBtn.style.display = readOnly ? "inline-block" : "none";
    }

    fetch(`https://capstone-legacy.up.railway.app/patients/${patient_id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("age").value = data.Age || data.age || "";
        document.getElementById("sex").value = data.Gender || data.gender || "";
      })
      .catch(err => console.error("Error fetching patient info:", err));

    fetch(`https://capstone-legacy.up.railway.app/api/lab_requests/${patient_id}`)
      .then(res => res.json())
      .then(results => {
        selectedTests.forEach(testId => {
          const input = document.getElementById(testId);
          if (!input) return;

          const value = results[testId];

          if (readOnly) {
            if (value && value.toLowerCase() !== "no") {
              input.value = value;
            }
          } else {
            if (value && value.toLowerCase() !== "no" && value.toLowerCase() !== "yes") {
              input.value = value;
            } else {
              input.value = ""; // hide "no"/"yes" when adding
            }
          }
        });
      })
      .catch(err => console.error("Error loading previous results:", err));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (patientBtn) patientBtn.addEventListener("click", () => window.location.href = "patients.html");
  if (dashboardBtn) dashboardBtn.addEventListener("click", () => window.location.href = "index.html");
  if (appointmentBtn) appointmentBtn.addEventListener("click", () => window.location.href = "appointments.html");
  if (laboratoryBtn) laboratoryBtn.addEventListener("click", () => window.location.href = "laboratory.html");
  if (prescriptionBtn) prescriptionBtn.addEventListener("click", () => window.location.href = "prescriptions.html");

  const openBloodChemBtn = document.getElementById("openBloodChemBtn");
  const openLabChecklistBtn = document.getElementById("openLabChecklistBtn");
  const labOverlay = document.getElementById("labOverlay");
  const labIframe = document.getElementById("labIframe");
  const closeOverlayBtn = document.getElementById("closeOverlayBtn");
  const submitBtn = document.getElementById("submitBtn");
  const printBtn = document.getElementById("printBtn");

  if (openBloodChemBtn && labOverlay && labIframe) {
    openBloodChemBtn.addEventListener("click", () => {
      labIframe.src = "forms/blood-chemistry.html";
      labOverlay.classList.add("show");
    });
  }

  if (openLabChecklistBtn && labOverlay && labIframe) {
    openLabChecklistBtn.addEventListener("click", () => {
      labIframe.src = "forms/lab-checklist.html";
      labOverlay.classList.add("show");
    });
  }

  if (closeOverlayBtn && labOverlay && labIframe) {
    closeOverlayBtn.addEventListener("click", () => {
      labOverlay.classList.remove("show");
      labIframe.src = "";
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  const patientInput = document.getElementById("patientName");
  const patientIdInput = document.getElementById("patientId");
  const suggestionBox = document.getElementById("customSuggestions");

  if (patientInput && suggestionBox && patientIdInput) {
    patientInput.addEventListener("input", function () {
      const query = this.value.trim();
      suggestionBox.innerHTML = "";
      if (query.length < 2) return;

      fetch(`https://capstone-legacy.up.railway.app/patients/search?name=${encodeURIComponent(query)}`)
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

              fetch(`https://capstone-legacy.up.railway.app/patients/${patient.id}`)
                .then(res => res.json())
                .then(data => {
                  const ageInput = document.getElementById("age");
                  const sexInput = document.getElementById("sex");
                  if (ageInput && data.Age) ageInput.value = data.Age;
                  if (sexInput && data.Gender) sexInput.value = data.Gender;
                })
                .catch(err => console.error("Error fetching patient info:", err));
            });
          });
        })
        .catch(err => {
          console.error("Autocomplete fetch error:", err);
        });
    });

    document.addEventListener("click", (e) => {
      if (!suggestionBox.contains(e.target) && e.target !== patientInput) {
        suggestionBox.innerHTML = "";
      }
    });
  }

  const dateField = document.getElementById("dateField");
  if (dateField) {
    const today = getLocalToday();
    dateField.value = today;
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const patientId = document.getElementById("patientId").value.trim();
      const patientName = document.getElementById("patientName").value.trim();
      const rawDate = document.getElementById("dateField").value.trim();
      const age = document.getElementById("age").value.trim();
      const sex = document.getElementById("sex").value.trim();

      // Sanitize date to YYYY-MM-DD only
      const date = rawDate.split("T")[0];

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

      // ✅ Use patientId and date in the URL to match Express route
      fetch(`https://capstone-legacy.up.railway.app/api/lab_requests/${encodeURIComponent(patientId)}/${encodeURIComponent(date)}`, {
        method: "PUT",
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
            toastMessage: "Blood chemistry results submitted successfully!",
            actionType: "updateLabTable"  // <-- this line is new
          }, "*");
        })
        .catch(error => {
          console.error("Error submitting data:", error);
          alert("There was a problem submitting the form.");
        });
    });
  }
});

function showToast(message, duration = 2000) {
  const toast = document.getElementById("toastNotification");
  const toastText = document.getElementById("toastMessage");

  toastText.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  toast.style.top = "20px";
  toast.style.bottom = "";

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, duration);
}

document.getElementById("printBtn").addEventListener("click", () => {
  window.print();
});
