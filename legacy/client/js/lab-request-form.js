document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://capstone-legacy.up.railway.app";
  const nameInput = document.getElementById("patientName");
  const suggestionsContainer = document.getElementById("patientSuggestions");
  const patientIdField = document.getElementById("patientId");
  const ageGenderField = document.getElementById("ageGender");
  const dateInput = document.getElementById("request_date");

  if (dateInput) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const formatted = now.toISOString().split("T")[0]; // ✅ fixed: just the date
    dateInput.value = formatted;
  }


  nameInput.addEventListener("input", async () => {
    const query = nameInput.value.trim();
    if (query.length < 2) {
      suggestionsContainer.innerHTML = "";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/patients/search?name=${encodeURIComponent(query)}`);
      const matches = await res.json();

      suggestionsContainer.innerHTML = "";
      matches.forEach(patient => {
        const div = document.createElement("div");
        div.textContent = patient.name;
        div.addEventListener("click", () => {
          nameInput.value = patient.name;
          patientIdField.value = patient.id;

          fetch(`${API_BASE}/patients/${patient.id}`)
            .then(res => res.json())
            .then(data => {
              ageGenderField.value = `${data.Age} / ${data.Gender}`;
            });

          suggestionsContainer.innerHTML = "";
        });
        suggestionsContainer.appendChild(div);
      });
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  });
});

document.getElementById("labRequestForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    patient_id: document.getElementById("patientId").value,
    patient_name: form.querySelector('input[placeholder="Full Name"]').value,
    age_gender: form.querySelector('input[placeholder="Age / Gender"]').value,
    request_date: document.getElementById("request_date").value,
    others: form.querySelector('input[placeholder="Write here..."]').value
  };

  // Validation: Check required patient details
  if (!data.patient_name.trim()) {
    showToast("Please enter patient's full name.", "error");
    return;
  }

  if (!data.age_gender.trim()) {
    showToast("Please enter patient's age and gender.", "error");
    return;
  }

  const testFieldMap = {
    "CBC with Platelet": "cbc_with_platelet",
    "Pregnancy Test": "pregnancy_test",
    "Urinalysis": "urinalysis",
    "Fecalysis": "fecalysis",
    "Occult Blood Test": "occult_blood_test",
    "Hepa B Screening": "hepa_b_screening",
    "Hepa A Screening": "hepa_a_screening",
    "Hepatitis Profile": "hepatitis_profile",
    "VDRL/RPR": "vdrl_rpr",
    "Dengue NS1": "dengue_ns1",
    "CA 125 / CEA / PSA": "ca_125_cea_psa",
    "FBS": "fbs",
    "BUN": "bun",
    "Creatinine": "creatinine",
    "Blood Uric Acid": "blood_uric_acid",
    "Lipid Profile": "lipid_profile",
    "SGOT": "sgot",
    "SGPT": "sgpt",
    "ALP": "alp",
    "Sodium Na": "sodium_na",
    "Potassium K+": "potassium_k",
    "HBA1C": "hbalc",
    "ECG": "ecg",
    "T3": "t3",
    "T4": "t4",
    "FT3": "ft3",
    "FT4": "ft4",
    "TSH": "tsh"
  };

  const labels = form.querySelectorAll(".tests label");
  let hasSelectedTest = false;
  
  labels.forEach(label => {
    const checkbox = label.querySelector("input[type='checkbox']");
    const labelText = label.textContent.replace(/\(.*\)/, "").trim();

    const field = testFieldMap[labelText];
    if (field) {
      data[field] = checkbox.checked ? "yes" : "no";
      if (checkbox.checked) {
        hasSelectedTest = true;
      }
    }
  });

  // Validation: Check if at least one lab test is selected
  if (!hasSelectedTest) {
    showToast("Please select at least one lab test.", "error");
    return;
  }

  try {
    const res = await fetch("https://capstone-legacy.up.railway.app/api/lab_requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      window.parent.postMessage({
        action: "closeLabOverlay",
        actionType: "updateLabTable",
        toastMessage: "Lab request submitted successfully!"
      }, "*");
    } else {
      const errorText = await res.text();
      console.error("Server error:", errorText);
      showToast("Something went wrong while submitting the form.", "error");
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    showToast("Failed to submit form.", "error");
  }
});

function showToast(message, type = "success", duration = 3000) {
  const toast = document.getElementById("labToast");

  if (!toast) return;

  // Remove existing type classes
  toast.classList.remove("error", "success");
  
  // Add the appropriate type class
  toast.classList.add(type);

  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, duration);
}
