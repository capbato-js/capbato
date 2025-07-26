/**
 * Philippine Mobile Number Validation Utility
 * Format: 09XXXXXXXXX (11 digits total, starting with 09)
 */

// Philippine mobile number validation function
function validatePhilippineMobile(contactNumber) {
  // Check if exactly 11 digits, starts with 09, and contains only numbers
  const phoneRegex = /^09\d{9}$/;
  return phoneRegex.test(contactNumber);
}

// Function to check if the current input is following the correct pattern so far
function isValidPartialInput(contactNumber) {
  if (!contactNumber) return true; // Empty is okay
  
  const value = contactNumber.trim();
  
  // Allow partial inputs that could lead to valid numbers
  if (value.length === 1 && value === '0') return true;
  if (value.length >= 2 && value.startsWith('09')) return true;
  
  return false; // Any other pattern is invalid
}

// Function to format contact number input (remove non-digits and limit to 11 characters)
function formatContactNumber(input) {
  // Remove all non-digit characters
  let value = input.value.replace(/\D/g, '');
  
  // Limit to 11 digits
  if (value.length > 11) {
    value = value.substring(0, 11);
  }
  
  input.value = value;
}

// Function to show validation error
function showContactError(inputElement, message) {
  // Remove existing error message
  const existingError = inputElement.parentNode.querySelector('.contact-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Add error styling
  inputElement.classList.remove('valid');
  inputElement.classList.add('error');
  
  // Create and add error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'contact-error';
  errorDiv.textContent = message;
  inputElement.parentNode.appendChild(errorDiv);
}

// Function to clear validation error
function clearContactError(inputElement) {
  const existingError = inputElement.parentNode.querySelector('.contact-error');
  if (existingError) {
    existingError.remove();
  }
  inputElement.classList.remove('error');
  inputElement.classList.add('valid');
}

// Function to setup phone validation on an input element
function setupPhoneValidation(inputElement, errorMessage = 'Contact number must be 11 digits starting with 09 (e.g., 09278479061)') {
  if (!inputElement) return;
  
  inputElement.addEventListener('input', function() {
    formatContactNumber(this);
    
    if (this.value.length === 0) {
      // Clear all styling when field is empty
      const existingError = this.parentNode.querySelector('.contact-error');
      if (existingError) {
        existingError.remove();
      }
      this.classList.remove('error', 'valid');
    } else if (validatePhilippineMobile(this.value)) {
      // Complete and valid number
      clearContactError(this);
    } else if (isValidPartialInput(this.value)) {
      // Still typing, following correct pattern - clear any errors but don't show success yet
      const existingError = this.parentNode.querySelector('.contact-error');
      if (existingError) {
        existingError.remove();
      }
      this.classList.remove('error', 'valid');
    } else {
      // Invalid pattern - show error immediately
      showContactError(this, errorMessage);
    }
  });
  
  inputElement.addEventListener('blur', function() {
    // On blur, validate completely if there's content
    if (this.value.length > 0 && !validatePhilippineMobile(this.value)) {
      showContactError(this, errorMessage);
    }
  });
}

// Function to validate all phone inputs before form submission
function validateAllPhoneInputs(formElement) {
  const phoneInputs = formElement.querySelectorAll('input[type="tel"]');
  const errors = [];
  
  phoneInputs.forEach(input => {
    const value = input.value.trim();
    if (value && !validatePhilippineMobile(value)) {
      const label = input.parentNode.querySelector('label');
      const fieldName = label ? label.textContent.replace(':', '') : 'Contact number';
      errors.push(`${fieldName} must be 11 digits starting with 09 (e.g., 09278479061)`);
    }
  });
  
  return errors;
}
