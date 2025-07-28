const buttons = {
  patientbtn: "patients.html",
  dashboardbtn: "index.html",
  appointmentbtn: "appointments.html",
  laboratorybtn: "laboratory.html",
  prescriptionbtn: "prescriptions.html",
  schedulebtn: "doctor-schedule.html"
};

document.addEventListener("DOMContentLoaded", function () {
  // Role & Username Display
  const role = localStorage.getItem("loggedInRole");
  const username = localStorage.getItem("loggedInUsername");

  const roleDisplay = document.getElementById("roleDisplay");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const profileAvatar = document.getElementById("profileAvatar");

  if (role && roleDisplay) {
    roleDisplay.textContent = role.toUpperCase();
  }

  if (username && usernameDisplay) {
    usernameDisplay.textContent = username;
  }

  // Profile Avatar Setup
  if (username && profileAvatar) {
    const firstLetter = username.charAt(0).toUpperCase();
    profileAvatar.textContent = firstLetter;
    
    // Generate random color based on username
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#10AC84', '#EE5A6F', '#0ABDE3', '#006BA6', '#F79F1F',
      '#A3CB38', '#FDA7DF', '#12CBC4', '#ED4C67', '#F79F1F'
    ];
    
    // Use username hash to consistently assign same color
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    profileAvatar.style.backgroundColor = colors[colorIndex];
  }

  // Profile Dropdown Functionality
  const profileDropdown = document.getElementById("profileDropdown");
  
  if (profileAvatar && profileDropdown) {
    profileAvatar.addEventListener("click", function(event) {
      event.stopPropagation();
      profileDropdown.classList.toggle("hidden");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function() {
      profileDropdown.classList.add("hidden");
    });

    // Prevent dropdown from closing when clicking inside it
    profileDropdown.addEventListener("click", function(event) {
      event.stopPropagation();
    });
  }

  // Dropdown menu handlers
  const settingsOption = document.getElementById("settingsOption");
  const logoutOption = document.getElementById("logoutOption");

  if (settingsOption) {
    settingsOption.addEventListener("click", function() {
      alert("Settings functionality coming soon!");
    });
  }

  if (logoutOption) {
    logoutOption.addEventListener("click", function() {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }

  // Navigation buttons
  Object.keys(buttons).forEach(buttonId => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener("click", function() {
        window.location.href = buttons[buttonId];
      });
    }
  });

  // Form validation setup
  const requiredFields = [
    'lastname', 'firstname', 'dob', 'age', 'gender', 'contact',
    'house_no', 'street_name', 'barangay', 'city', 'province',
    'guardian_name', 'guardian_gender', 'guardian_relationship', 'guardian_contact',
    'guardian_house_no', 'guardian_street_name', 'guardian_barangay', 
    'guardian_city', 'guardian_province'
  ];

  // Track form changes for unsaved changes warning
  let formChanged = false;
  let originalFormData = {};

  // Store original form state
  function storeOriginalFormData() {
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        originalFormData[fieldId] = field.value;
      }
    });
  }

  // Check if form has been modified
  function hasFormChanged() {
    return requiredFields.some(fieldId => {
      const field = document.getElementById(fieldId);
      return field && field.value !== (originalFormData[fieldId] || '');
    });
  }

  function validateField(field) {
    // Skip validation styling for auto-computed age field
    if (field.id === 'age') {
      return;
    }
    
    const value = field.value.trim();
    const isValid = value !== '';
    
    if (isValid) {
      field.classList.remove('error');
      field.classList.add('valid');
    } else {
      field.classList.remove('valid');
      field.classList.add('error');
    }
  }

  // Form progress tracking
  function updateFormProgress() {
    const filledFields = requiredFields.filter(fieldId => {
      const field = document.getElementById(fieldId);
      return field && field.value.trim() !== '';
    });
    
    const progress = (filledFields.length / requiredFields.length) * 100;
    console.log(`Form completion: ${Math.round(progress)}%`);
  }

  // Set up form field event listeners
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('blur', function() {
        validateField(this);
      });
      
      field.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          validateField(this);
        }
        formChanged = hasFormChanged();
        updateFormProgress();
      });
    }
  });

  // Set up change tracking
  storeOriginalFormData();

  // Warn before leaving page if form has unsaved changes
  window.addEventListener('beforeunload', function(e) {
    if (formChanged) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });

  // Back button functionality with unsaved changes check
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", function(e) {
      e.preventDefault();
      if (formChanged) {
        if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
          return;
        }
      }
      window.location.href = "patients.html";
    });
  }

  // Cancel button functionality with unsaved changes check
  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function(e) {
      e.preventDefault();
      if (formChanged) {
        if (!confirm("Are you sure you want to cancel? All entered data will be lost.")) {
          return;
        }
      }
      window.location.href = "patients.html";
    });
  }

  // Setup phone validation
  const contactInput = document.getElementById('contact');
  const guardianContactInput = document.getElementById('guardian_contact');
  
  if (contactInput) {
    setupPhoneValidation(contactInput);
  }
  
  if (guardianContactInput) {
    setupPhoneValidation(guardianContactInput);
  }

  // Auto-calculate age when date of birth changes
  const dobInput = document.getElementById('dob');
  const ageInput = document.getElementById('age');
  
  if (dobInput && ageInput) {
    dobInput.addEventListener('change', function() {
      const dob = new Date(this.value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      if (age >= 0) {
        ageInput.value = age;
      }
    });
  }

  // Initialize Philippine Address Selectors
  console.log('Initializing Philippine Address Selectors...');
  
  const patientAddressSelector = new PHAddressSelector({
    onSelectionChange: (level, value) => {
      console.log(`Patient ${level} selected:`, value);
    }
  });

  const guardianAddressSelector = new PHAddressSelector({
    onSelectionChange: (level, value) => {
      console.log(`Guardian ${level} selected:`, value);
    }
  });

  // Initialize patient address selector
  patientAddressSelector.init({
    province: document.getElementById('province'),
    city: document.getElementById('city'),
    barangay: document.getElementById('barangay')
  });

  // Initialize guardian address selector
  guardianAddressSelector.init({
    province: document.getElementById('guardian_province'),
    city: document.getElementById('guardian_city'),
    barangay: document.getElementById('guardian_barangay')
  });

  // Store selectors globally for form submission
  window.patientAddressSelector = patientAddressSelector;
  window.guardianAddressSelector = guardianAddressSelector;
});

// Form submission handler
document.getElementById("patientFormFields").addEventListener("submit", function (event) {
  event.preventDefault();

  const lastname = document.getElementById("lastname").value.trim();
  if (!lastname) {
    showToast("Last name is required.", "error");
    return;
  }

  // Validate address components
  const requiredAddressFields = [
    { id: "house_no", name: "House No." },
    { id: "street_name", name: "Street Name" },
    { id: "barangay", name: "Barangay" },
    { id: "city", name: "City/Municipality" },
    { id: "province", name: "Province" }
  ];

  const requiredGuardianAddressFields = [
    { id: "guardian_house_no", name: "Guardian House No." },
    { id: "guardian_street_name", name: "Guardian Street Name" },
    { id: "guardian_barangay", name: "Guardian Barangay" },
    { id: "guardian_city", name: "Guardian City/Municipality" },
    { id: "guardian_province", name: "Guardian Province" }
  ];

  // Check patient address fields
  for (const field of requiredAddressFields) {
    const value = document.getElementById(field.id).value.trim();
    if (!value) {
      showToast(`${field.name} is required.`, "error");
      return;
    }
  }

  // Check guardian address fields
  for (const field of requiredGuardianAddressFields) {
    const value = document.getElementById(field.id).value.trim();
    if (!value) {
      showToast(`${field.name} is required.`, "error");
      return;
    }
  }

  // Validate contact numbers
  const contactPattern = /^09[0-9]{9}$/;
  const patientContact = document.getElementById("contact").value.trim();
  const guardianContact = document.getElementById("guardian_contact").value.trim();

  if (!contactPattern.test(patientContact)) {
    showToast("Please enter a valid patient contact number (09XXXXXXXXX).", "error");
    return;
  }

  if (!contactPattern.test(guardianContact)) {
    showToast("Please enter a valid guardian contact number (09XXXXXXXXX).", "error");
    return;
  }

  // Prepare patient data
  const patientData = {
    lastname: document.getElementById("lastname").value.trim(),
    firstname: document.getElementById("firstname").value.trim(),
    middlename: document.getElementById("middlename").value.trim(),
    dob: document.getElementById("dob").value,
    age: parseInt(document.getElementById("age").value),
    gender: document.getElementById("gender").value,
    contact: document.getElementById("contact").value.trim(),
    house_no: document.getElementById("house_no").value.trim(),
    street_name: document.getElementById("street_name").value.trim(),
    barangay: document.getElementById("barangay").value.trim(),
    city: document.getElementById("city").value.trim(),
    province: document.getElementById("province").value.trim(),
    guardian_name: document.getElementById("guardian_name").value.trim(),
    guardian_gender: document.getElementById("guardian_gender").value,
    guardian_relationship: document.getElementById("guardian_relationship").value.trim(),
    guardian_contact: document.getElementById("guardian_contact").value.trim(),
    guardian_house_no: document.getElementById("guardian_house_no").value.trim(),
    guardian_street_name: document.getElementById("guardian_street_name").value.trim(),
    guardian_barangay: document.getElementById("guardian_barangay").value.trim(),
    guardian_city: document.getElementById("guardian_city").value.trim(),
    guardian_province: document.getElementById("guardian_province").value.trim()
  };

  // Disable submit button to prevent double submission
  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Patient...';

  // Submit data to server
  fetch("https://capstone-legacy.up.railway.app/patients/add-patient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.error || 'Failed to add patient');
        });
      }
      return response.json();
    })
    .then((data) => {
      showToast("Patient added successfully!");
      
      // Wait for toast to be visible before redirecting
      setTimeout(() => {
        window.location.href = "patients.html";
      }, 1500);
    })
    .catch((error) => {
      console.error("Error adding patient:", error);
      showToast("Error adding patient: " + error.message, "error");
      
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    });
});

// Toast notification function
function showToast(message, type = "success", duration = 3000) {
  const toast = document.getElementById("toast");

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
