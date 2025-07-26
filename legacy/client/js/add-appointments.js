const timeSelect = document.getElementById("time");
const dateInput = document.getElementById("date");
const timeNotice = document.getElementById("timeNotice");
const formError = document.getElementById("formError");
const patientInput = document.getElementById("patientName");
const suggestionsBox = document.getElementById("autocompleteSuggestions");
const patientIdDisplay = document.getElementById("patientIdDisplay");
const patientIdWrapper = document.getElementById("patientIdWrapper");

let timeSlotNotice = document.getElementById("timeSlotNotice");
if (!timeSlotNotice) {
  timeSlotNotice = document.createElement("small");
  timeSlotNotice.id = "timeSlotNotice";
  timeSlotNotice.className = "text-danger d-block mt-1";
  timeSlotNotice.style.display = "none";
  timeSelect.parentNode.appendChild(timeSlotNotice);
}

const hiddenPatientIdInput = document.createElement("input");
hiddenPatientIdInput.type = "hidden";
hiddenPatientIdInput.id = "selectedPatientId";
hiddenPatientIdInput.name = "patient_id";
document.getElementById("addAppointmentForm").appendChild(hiddenPatientIdInput);

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8);
let latestAppointments = [];
let patientsList = [];

document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
  populateTimeOptions();  // This already includes availability check
  loadPatients();
  loadDoctors();
  setupVisitTypeHandler(); // Add handler for visit type dropdown
});

dateInput.addEventListener("change", () => {
  populateTimeOptions();  // Re-check time availability on date change
});

timeSelect.addEventListener("change", () => {
  checkTimeSlotAvailability();
});

// Handle visit type dropdown to show/hide custom reason field
function setupVisitTypeHandler() {
  const visitTypeSelect = document.getElementById("visitType");
  const customReasonGroup = document.getElementById("customReasonGroup");
  const customReasonInput = document.getElementById("customReason");

  visitTypeSelect.addEventListener("change", function() {
    if (this.value === "Others") {
      customReasonGroup.style.display = "block";
      customReasonInput.setAttribute("required", "true");
    } else {
      customReasonGroup.style.display = "none";
      customReasonInput.removeAttribute("required");
      customReasonInput.value = ""; // Clear the custom reason when not needed
    }
  });
}

async function populateTimeOptions() {
  const selectedDate = dateInput.value;
  const now = new Date();
  now.setSeconds(0, 0);
  const isToday = selectedDate === now.toISOString().split("T")[0];

  try {
    const response = await fetch("http://localhost:3001/appointments");
    const appointments = await response.json();
    latestAppointments = appointments;

    // Get all confirmed booked times for selected date, normalize to HH:mm
    const takenTimes = new Set(
      appointments
        .filter(app => {
          return app.appointment_date === selectedDate && app.status === "Confirmed";
        })
        .map(app => {
          // Normalize to HH:mm
          const [h, m] = app.appointment_time.split(":");
          return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
        })
    );

    timeSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.text = "Select Time";
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    timeSelect.appendChild(placeholder);

    let availableFound = false;

    for (let hour = 8; hour <= 17; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        const optionTime = new Date(`${selectedDate}T${timeStr}`);
        optionTime.setSeconds(0, 0);

        const isPast = isToday && optionTime <= now;
        const isTaken = takenTimes.has(timeStr);

        if (isPast || isTaken) continue;  // Skip past or booked slots

        const option = document.createElement("option");
        option.value = timeStr;
        option.text = formatOptionLabel(timeStr);
        timeSelect.appendChild(option);
        availableFound = true;
      }
    }

    timeNotice.style.display = availableFound ? "none" : "block";
    timeSlotNotice.style.display = "none";
  } catch (error) {
    console.error("Error loading time availability:", error);
  }
}


function formatOptionLabel(value) {
  const [hourStr, minuteStr] = value.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour}:${minute} ${ampm}`;
}

function formatTimeLabel(timeStr) {
  const [hourStr, minuteStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteStr} ${ampm}`;
}

async function fetchTimeAvailability(date) {
  try {
    const response = await fetch("http://localhost:3001/appointments");
    const appointments = await response.json();
    latestAppointments = appointments;

    const takenTimes = new Set(
      appointments
        .filter(app => app.appointment_date === date && app.status === "Confirmed")
        .map(app => app.appointment_time)
    );

    const now = new Date();
    const isToday = date === now.toISOString().split("T")[0];
    let allDisabled = true;

    Array.from(timeSelect.options).forEach(option => {
      if (!option.value) return; // skip placeholder

      const slotTime = new Date(`${date}T${option.value}`);
      const isPast = isToday && slotTime <= now;
      const isTaken = takenTimes.has(option.value);

      if (isPast || isTaken) {
        option.disabled = true;
        option.style.color = "#999";
        option.text = `${formatOptionLabel(option.value)} (${isPast ? "Past" : "Taken"})`;
      } else {
        option.disabled = false;
        option.style.color = "#000";
        option.text = formatOptionLabel(option.value);
        allDisabled = false;
      }
    });

    timeNotice.style.display = allDisabled ? "block" : "none";
    timeSlotNotice.style.display = "none";

  } catch (error) {
    console.error("Error loading time availability:", error);
  }
}


function checkTimeSlotAvailability() {
  const selectedOption = timeSelect.options[timeSelect.selectedIndex];
  const selectedTime = timeSelect.value;
  const selectedDate = dateInput.value;

  const count = latestAppointments.filter(
    (app) =>
      app.appointment_date === selectedDate &&
      app.appointment_time === selectedTime &&
      app.status === "Confirmed"
  ).length;

  const now = new Date();
  const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);

  // Check if the selected option is disabled (past or full)
  if (selectedOption.disabled) {
    timeSlotNotice.textContent = "That time is no longer available. Please choose another.";
    timeSlotNotice.style.display = "block";
    timeSelect.selectedIndex = 0; // Reset selection
    return;
  }

  // Validation feedback
  if (selectedDateTime <= now) {
    timeSlotNotice.textContent = "You cannot select a time in the past.";
    timeSlotNotice.style.display = "block";
  } else if (count >= 4) {
    timeSlotNotice.textContent = "This timeslot is already full.";
    timeSlotNotice.style.display = "block";
  } else {
    timeSlotNotice.style.display = "none";
  }
}


function showInlineError(msg) {
  formError.textContent = msg;
  formError.style.display = "block";
}

function clearInlineError() {
  formError.textContent = "";
  formError.style.display = "none";
}

function loadPatients() {
  patientInput.addEventListener("input", async () => {
    const query = patientInput.value.trim();
    suggestionsBox.innerHTML = "";
    suggestionsBox.style.display = "none";
    patientIdDisplay.textContent = "";
    patientIdWrapper.style.display = "none";
    hiddenPatientIdInput.value = "";

    if (query.length < 2) return;

    try {
      const res = await fetch(`http://localhost:3001/patients/search?name=${encodeURIComponent(query)}`);
      const matches = await res.json();

      if (!Array.isArray(matches)) return;

      if (matches.length > 0) {
        suggestionsBox.style.display = "block";
      }

      matches.forEach((p) => {
        const item = document.createElement("div");
        item.classList.add("suggestion-item");
        item.textContent = p.name;
        item.addEventListener("click", () => {
          patientInput.value = p.name;
          patientIdDisplay.textContent = `Patient #: ${p.patient_id || p.id}`;
          patientIdWrapper.style.display = "block";
          hiddenPatientIdInput.value = p.patient_id || p.id;
          suggestionsBox.innerHTML = "";
          suggestionsBox.style.display = "none";
        });
        suggestionsBox.appendChild(item);
      });
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  });

  document.addEventListener("click", (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== patientInput) {
      suggestionsBox.innerHTML = "";
      suggestionsBox.style.display = "none";
    }
  });
}

function loadDoctors() {
  fetch("http://localhost:3001/doctors")
    .then((res) => res.json())
    .then((doctors) => {
      const select = document.getElementById("doctorSelect");
      select.innerHTML = '<option value="">Select Doctor</option>';
      doctors.forEach(doc => {
        const option = document.createElement("option");
        option.value = doc.DoctorID;
        option.text = `${doc.LastName}, ${doc.FirstName} (${doc.Specialization})`;
        select.appendChild(option);
      });
    })
    .catch((err) => console.error("Failed to load doctors:", err));
}

document.getElementById("addAppointmentForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  clearInlineError();

  const patient_name = patientInput.value.trim();
  const patient_id = hiddenPatientIdInput.value.trim();
  const visitTypeSelect = document.getElementById("visitType");
  const customReasonInput = document.getElementById("customReason");
  
  // Get the reason for visit - use custom reason if "Others" is selected
  let reason_for_visit = visitTypeSelect.value.trim();
  if (reason_for_visit === "Others") {
    const customReason = customReasonInput.value.trim();
    if (!customReason) {
      showInlineError("Please specify the reason for your visit.");
      return;
    }
    reason_for_visit = customReason;
  }
  
  const appointment_date = document.getElementById("date").value;
  const appointment_time = document.getElementById("time").value;
  const doctorSelect = document.getElementById("doctorSelect");
  const doctor_name = doctorSelect.options[doctorSelect.selectedIndex].text;


  if (!patient_id) {
    showInlineError("Please select a patient from the suggestions.");
    return;
  }

  if (!patient_name || !reason_for_visit || !appointment_date || !appointment_time || !doctor_name) {
    showInlineError("Please fill in all fields.");
    return;
  }


  const editId = this.dataset.editId;
  const isEditing = !!editId;
  const originalApp = latestAppointments.find(app => app.id == editId);

  let status = "Confirmed";
  if (isEditing && originalApp?.status === "Cancelled") {
    status = "Confirmed";
  } else if (isEditing) {
    status = originalApp.status;
  }

  const timeCounts = {};
  latestAppointments
    .filter(app =>
      app.appointment_date === appointment_date &&
      app.status === "Confirmed" &&
      (!isEditing || app.id != editId))
    .forEach(app => {
      timeCounts[app.appointment_time] = (timeCounts[app.appointment_time] || 0) + 1;
    });

  if (timeCounts[appointment_time] >= 4) {
    showInlineError("That time is already fully booked. Please choose another.");
    return;
  }

  const url = isEditing
    ? `http://localhost:3001/appointments/update/${editId}`
    : "http://localhost:3001/appointments/add";
  const method = isEditing ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      patient_name,
      patient_id,
      reason_for_visit,
      appointment_date,
      appointment_time,
      status,
      doctor_name
    })
    });

    const data = await response.json();

    if (response.ok) {
      window.parent.postMessage({ type: "appointmentAdded", date: appointment_date }, "*");
      window.parent.document.getElementById("addAppointmentOverlay").style.display = "none";
      this.reset();
      delete this.dataset.editId;

      patientIdDisplay.textContent = "";
      hiddenPatientIdInput.value = "";
      patientIdWrapper.style.display = "none";

      const message = isEditing
        ? "Appointment updated successfully!"
        : "Appointment added successfully!";
      window.parent.postMessage({ type: "showToast", message }, "*");
    } else {
      console.error("Backend error:", data);
      showInlineError(data.error || "An error occurred while submitting the appointment.");
    }

  } catch (error) {
    console.error("Error submitting appointment:", error);
    showInlineError("Failed to submit appointment.");
  }
});

window.addEventListener("message", function (event) {
  if (event.data && event.data.type === "editAppointment") {
    const app = event.data.data;
    
    // Update form title and button for edit mode
    const formTitle = document.getElementById("formTitle");
    const submitBtn = document.getElementById("submitBtn");
    if (formTitle) formTitle.textContent = "Update Appointment";
    if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-edit"></i> Update Appointment';
    
    patientInput.value = app.patient_name;
    
    // Handle reason for visit - check if it's one of the predefined options
    const visitTypeSelect = document.getElementById("visitType");
    const customReasonGroup = document.getElementById("customReasonGroup");
    const customReasonInput = document.getElementById("customReason");
    
    const predefinedOptions = [
      "Consultation",
      "Laboratory: Blood chemistry", 
      "Laboratory: Hematology",
      "Laboratory: Serology & Immunology",
      "Laboratory: Urinalysis", 
      "Laboratory: Fecalysis",
      "Prescription",
      "Follow-up check-up",
      "Medical Certificate"
    ];
    
    if (predefinedOptions.includes(app.reason_for_visit)) {
      visitTypeSelect.value = app.reason_for_visit;
      customReasonGroup.style.display = "none";
      customReasonInput.removeAttribute("required");
    } else {
      // It's a custom reason
      visitTypeSelect.value = "Others";
      customReasonGroup.style.display = "block";
      customReasonInput.setAttribute("required", "true");
      customReasonInput.value = app.reason_for_visit;
    }
    
    document.getElementById("date").value = app.appointment_date;

    fetchTimeAvailability(app.appointment_date).then(() => {
      document.getElementById("time").value = app.appointment_time;
      timeNotice.style.display = "none";
      timeSlotNotice.style.display = "none";
    });

    hiddenPatientIdInput.value = app.patient_id;
    patientIdDisplay.textContent = `Patient #: ${app.patient_id}`;
    patientIdWrapper.style.display = "block";
    document.getElementById("addAppointmentForm").dataset.editId = app.id;
  }
});

window.addEventListener("message", function (event) {
  if (event.data && event.data.type === "resetForm") {
    const form = document.getElementById("addAppointmentForm");
    form.reset();
    delete form.dataset.editId;

    // Reset form title and button for add mode
    const formTitle = document.getElementById("formTitle");
    const submitBtn = document.getElementById("submitBtn");
    if (formTitle) formTitle.textContent = "Add Appointment";
    if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-calendar-plus"></i> Add Appointment';

    hiddenPatientIdInput.value = "";
    patientIdDisplay.textContent = "";
    patientIdWrapper.style.display = "none";

    // Reset custom reason field
    const customReasonGroup = document.getElementById("customReasonGroup");
    const customReasonInput = document.getElementById("customReason");
    customReasonGroup.style.display = "none";
    customReasonInput.removeAttribute("required");
    customReasonInput.value = "";

    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
    fetchTimeAvailability(today);
    timeNotice.style.display = "none";
    timeSlotNotice.style.display = "none";
  }
});
