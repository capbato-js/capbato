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

  // Real-time form validation feedback
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

  // Update back button to check for changes
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", function(e) {
      if (formChanged) {
        if (!confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
          e.preventDefault();
          return;
        }
      }
      window.location.href = "patients.html";
    });
  }

  // Update cancel button to check for changes  
  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function(e) {
      if (formChanged) {
        if (!confirm("Are you sure you want to cancel? All entered data will be lost.")) {
          e.preventDefault();
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

  // Real-time form validation feedback
  const requiredFields = [
    'lastname', 'firstname', 'dob', 'age', 'gender', 'contact',
    'house_no', 'street_name', 'barangay', 'city', 'province',
    'guardian_name', 'guardian_gender', 'guardian_relationship', 'guardian_contact',
    'guardian_house_no', 'guardian_street_name', 'guardian_barangay', 
    'guardian_city', 'guardian_province'
  ];

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
      });
    }
  });

  function validateField(field) {
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
    
    // You can add a progress bar here if desired
    console.log(`Form completion: ${Math.round(progress)}%`);
  }

  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', updateFormProgress);
    }
  });
});

// Form submission handler
document.getElementById("patientFormFields").addEventListener("submit", function (event) {
  event.preventDefault();

  const lastname = document.getElementById("lastname").value.trim();
  if (!lastname) {
    alert("Last name is required.");
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
      alert(`${field.name} is required.`);
      return;
    }
  }

  // Check guardian address fields
  for (const field of requiredGuardianAddressFields) {
    const value = document.getElementById(field.id).value.trim();
    if (!value) {
      alert(`${field.name} is required.`);
      return;
    }
  }

  // Validate contact numbers
  const contactPattern = /^09[0-9]{9}$/;
  const patientContact = document.getElementById("contact").value.trim();
  const guardianContact = document.getElementById("guardian_contact").value.trim();

  if (!contactPattern.test(patientContact)) {
    alert("Please enter a valid patient contact number (09XXXXXXXXX).");
    return;
  }

  if (!contactPattern.test(guardianContact)) {
    alert("Please enter a valid guardian contact number (09XXXXXXXXX).");
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
  fetch("http://localhost:3000/api/patients", {
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
      alert("Patient added successfully!");
      
      // Redirect back to patients page
      window.location.href = "patients.html";
    })
    .catch((error) => {
      console.error("Error adding patient:", error);
      alert("Error adding patient: " + error.message);
      
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    });
});
