document.addEventListener('DOMContentLoaded', function() {
  const contactInput = document.getElementById('contact');
  const guardianContactInput = document.getElementById('guardian_contact');
  
  // Setup phone validation using utility functions
  setupPhoneValidation(contactInput);
  setupPhoneValidation(guardianContactInput);

  // Initialize Philippine Address Selectors
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
    { id: "street_name", name: "Street Name" }
  ];

  const requiredGuardianAddressFields = [
    { id: "guardian_house_no", name: "Guardian House No." },
    { id: "guardian_street_name", name: "Guardian Street Name" }
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

  // Validate address selections
  const patientAddress = window.patientAddressSelector.getSelectedValues();
  if (!patientAddress.province.code || !patientAddress.city.code || !patientAddress.barangay.code) {
    alert('Please select complete address information (Province, City/Municipality, and Barangay).');
    return;
  }

  const guardianAddress = window.guardianAddressSelector.getSelectedValues();
  if (!guardianAddress.province.code || !guardianAddress.city.code || !guardianAddress.barangay.code) {
    alert('Please select complete guardian address information (Province, City/Municipality, and Barangay).');
    return;
  }

  // Validate all phone inputs using utility function
  const phoneErrors = validateAllPhoneInputs(this);
  if (phoneErrors.length > 0) {
    alert(phoneErrors.join('\n'));
    return;
  }

  // Function to combine address components into a full address
  function combineAddress(houseNo, streetName, barangay, city, province) {
    const components = [houseNo, streetName, barangay, city, province]
      .map(component => component ? component.trim() : '')
      .filter(component => component.length > 0);
    return components.join(', ');
  }

  // Get address selections and combine with house/street info
  const patientAddressData = window.patientAddressSelector.getSelectedValues();
  const patientFullAddress = combineAddress(
    document.getElementById("house_no").value,
    document.getElementById("street_name").value,
    patientAddressData.barangay.name,
    patientAddressData.city.name,
    patientAddressData.province.name
  );

  const guardianAddressData = window.guardianAddressSelector.getSelectedValues();
  const guardianFullAddress = combineAddress(
    document.getElementById("guardian_house_no").value,
    document.getElementById("guardian_street_name").value,
    guardianAddressData.barangay.name,
    guardianAddressData.city.name,
    guardianAddressData.province.name
  );

  const patientData = {
    lastname,
    firstname: document.getElementById("firstname").value.trim(),
    middlename: document.getElementById("middlename").value.trim(),
    dob: document.getElementById("dob").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    contact: document.getElementById("contact").value,
    address: patientFullAddress,

    guardian_name: document.getElementById("guardian_name").value.trim(),
    guardian_gender: document.getElementById("guardian_gender").value,
    guardian_relationship: document.getElementById("guardian_relationship").value.trim(),
    guardian_contact: document.getElementById("guardian_contact").value,
    guardian_address: guardianFullAddress
  };

  console.log("Sending Data:", patientData);

  fetch("http://localhost:3001/patients/add-patient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patientData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Server Response:", data);
      if (data.message) {
        window.parent.postMessage("patientAdded", "*");
        const overlay = window.parent.document.getElementById("overlay");
        if (overlay) overlay.style.display = "none";
        document.getElementById("patientFormFields").reset();
      } else {
        alert(data.error || "Failed to add patient.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    });
});

document.getElementById("dob").addEventListener("change", function () {
  const dobValue = this.value;
  if (dobValue) {
    const today = new Date();
    const birthDate = new Date(dobValue);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    document.getElementById("age").value = age >= 0 ? age : '';
  } else {
    document.getElementById("age").value = '';
  }
});
