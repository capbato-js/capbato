# Philippine Mobile Number Validation

This project implements comprehensive validation for Philippine mobile phone numbers with the format: **09XXXXXXXXX** (11 digits, starting with 09).

## Features

- ✅ **Frontend Validation**: Real-time input validation with user feedback
- ✅ **Backend Validation**: Server-side validation for data integrity
- ✅ **Format Enforcement**: Only allows numbers, automatically formats input
- ✅ **Visual Feedback**: Green/red styling with error messages
- ✅ **Sanitization**: Removes non-digit characters automatically

## Frontend Implementation

### Files Updated:
- `client/js/phone-validation.js` - Utility functions for phone validation
- `client/js/addpatientbtnform.js` - Add patient form validation
- `client/pages/addpatientbtnform.html` - HTML form with validation attributes
- `client/assets/styles/addpatientbtnform.css` - Styling for validation feedback

### Key Functions:
```javascript
validatePhilippineMobile(contactNumber)  // Returns true if valid format
formatContactNumber(input)               // Removes non-digits, limits to 11 chars
setupPhoneValidation(inputElement)       // Sets up real-time validation
validateAllPhoneInputs(formElement)      // Validates all phone inputs in form
```

### Usage:
```javascript
// Setup validation on input element
const phoneInput = document.getElementById('contact');
setupPhoneValidation(phoneInput);

// Validate all phone inputs before form submission
const errors = validateAllPhoneInputs(document.getElementById('myForm'));
if (errors.length > 0) {
    alert(errors.join('\n'));
    return;
}
```

## Backend Implementation

### Files Updated:
- `server/src/utils/phoneValidation.js` - Server-side validation utilities
- `server/src/controllers/patients.controllers.js` - Patient creation validation
- `server/src/controllers/appointments.controller.js` - Contact number verification

### Key Functions:
```javascript
validatePhilippineMobile(contactNumber)  // Validates phone format
validateContactNumbers(contacts)         // Validates multiple contacts
sanitizePhoneNumber(contactNumber)       // Cleans and validates phone number
```

### Usage:
```javascript
import { validateContactNumbers, sanitizePhoneNumber } from '../utils/phoneValidation.js';

// Validate contact numbers
const errors = validateContactNumbers({
    'Patient contact': req.body.contact,
    'Guardian contact': req.body.guardian_contact
});

if (errors.length > 0) {
    return res.status(400).json({ error: 'Invalid contact format', details: errors });
}

// Sanitize before saving to database
const cleanContact = sanitizePhoneNumber(req.body.contact);
```

## Validation Rules

1. **Exact Length**: Must be exactly 11 digits
2. **Start Pattern**: Must start with "09"
3. **Numbers Only**: Only numeric characters allowed
4. **Format**: 09XXXXXXXXX (where X is any digit 0-9)

### Valid Examples:
- `09123456789`
- `09987654321`
- `09278479061`

### Invalid Examples:
- `091234567890` (12 digits - too long)
- `0912345678` (10 digits - too short)
- `08123456789` (doesn't start with 09)
- `09-123-456-789` (contains non-digit characters)
- `639123456789` (+63 country code format)

## User Experience

### Real-time Feedback:
- **Green border**: Valid phone number
- **Red border**: Invalid phone number
- **Error message**: Specific validation message below input
- **Auto-formatting**: Removes non-digits automatically
- **Placeholder**: Shows example format (09278479061)

### Form Submission:
- Prevents submission with invalid phone numbers
- Shows detailed error messages for all invalid fields
- Validates both patient and guardian contact numbers

## Error Handling

### Frontend Errors:
- Real-time validation with visual feedback
- Form submission blocked for invalid numbers
- Clear error messages with examples

### Backend Errors:
- HTTP 400 status for validation failures
- Detailed error messages in JSON response
- Warning logs for invalid numbers found in database

## Testing

To test the validation:

1. **Valid Input**: Enter `09278479061` - should show green styling
2. **Invalid Length**: Enter `0912345678` - should show error
3. **Invalid Start**: Enter `08123456789` - should show error
4. **Non-digits**: Enter `09-123-456-789` - auto-removes dashes
5. **Form Submission**: Try submitting with invalid numbers - should be blocked

## Browser Compatibility

- Uses standard JavaScript (ES6+)
- Compatible with modern browsers
- Fallback validation on form submission
- Progressive enhancement approach
