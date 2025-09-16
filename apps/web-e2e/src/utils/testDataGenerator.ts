type PatientData = {
  firstName: string
  lastName: string
  contactNumber: string
  dateOfBirth: string
  gender: string
  province: string
  city: string
  barangay: string
  middleName?: string
  houseNumber?: string
  streetName?: string
  guardianName?: string
  guardianGender?: string
  guardianRelationship?: string
  guardianContact?: string
  guardianHouseNumber?: string
  guardianStreetName?: string
  guardianProvince?: string
  guardianCity?: string
  guardianBarangay?: string
}

export class TestDataGenerator {
  static generateUniqueText(baseText: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `${baseText}_${timestamp}_${random}`
  }

  /**
   * Generate unique letters-only suffix for names
   */
  static generateLettersOnlySuffix(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz' // Use lowercase to match form input behavior
    const randomLetters = Array.from({ length: 2 }, () => 
      letters[Math.floor(Math.random() * letters.length)]
    ).join('')
    const timeBasedLetters = (Date.now() % 100).toString().split('').map(digit => 
      letters[parseInt(digit)]
    ).join('')
    return randomLetters + timeBasedLetters
  }

  /**
   * Add letters-only suffix to names while preserving spaces
   */
  static makeNameUnique(name: string): string {
    const suffix = this.generateLettersOnlySuffix()
    // If name has spaces, add suffix to the last word
    const parts = name.split(' ')
    if (parts.length > 1) {
      parts[parts.length - 1] = parts[parts.length - 1] + suffix
      return parts.join(' ')
    }
    return name + suffix
  }

  /**
   * Generate unique contact number that follows Philippine format
   */
  static generateUniqueContactNumber(baseNumber: string): string {
    // Keep the prefix (09) and modify last 4 digits
    const prefix = baseNumber.substring(0, 7) // "0912345"
    const randomSuffix = Math.floor(1000 + Math.random() * 9000) // 4-digit number
    return `${prefix}${randomSuffix}`
  }

  static generateUniquePatientData(basePatient: PatientData): PatientData {
    return {
      ...basePatient,
      // Names: only letters and spaces allowed, add suffix to last word
      firstName: this.makeNameUnique(basePatient.firstName),
      lastName: this.makeNameUnique(basePatient.lastName),
      
      // Contact number: generate valid Philippine mobile number
      contactNumber: this.generateUniqueContactNumber(basePatient.contactNumber),
      
      // Guardian name if present
      ...(basePatient.guardianName && {
        guardianName: this.makeNameUnique(basePatient.guardianName),
      }),
      
      // Guardian contact if present
      ...(basePatient.guardianContact && {
        guardianContact: this.generateUniqueContactNumber(basePatient.guardianContact),
      })
    }
  }

  static generateMultipleUniquePatients(basePatients: PatientData[]): PatientData[] {
    return basePatients.map(patient => this.generateUniquePatientData(patient))
  }
}