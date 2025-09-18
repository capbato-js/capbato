import { useMemo } from 'react';

/**
 * Hook for handling lab test field mappings and lipid profile expansion
 */
export const useLabTestFieldMapping = () => {
  /**
   * Map lab request fields to form input IDs for proper field enabling
   */
  const mapLabRequestFieldsToFormIds = useMemo(() => (tests: string[]): string[] => {
    const fieldMapping: Record<string, string> = {
      'fbs': 'fastingBloodSugar',
      'fasting_blood_sugar': 'fastingBloodSugar',
      'fastingBloodSugar': 'fastingBloodSugar',
      'rbs': 'randomBloodSugar', 
      'random_blood_sugar': 'randomBloodSugar',
      'randomBloodSugar': 'randomBloodSugar',
      'totalCholesterol': 'cholesterol',
      'total_cholesterol': 'cholesterol',
      'cholesterol': 'cholesterol',
      'triglycerides': 'triglycerides',
      'hdl': 'hdl',
      'hdl_cholesterol': 'hdl',
      'hdlCholesterol': 'hdl',
      'ldl': 'ldl',
      'ldl_cholesterol': 'ldl', 
      'ldlCholesterol': 'ldl',
      'vldl': 'vldl',
      'vldl_cholesterol': 'vldl',
      'vldlCholesterol': 'vldl',
      'creatinine': 'creatinine',
      'bun': 'bloodUreaNitrogen',
      'blood_urea_nitrogen': 'bloodUreaNitrogen',
      'bloodUreaNitrogen': 'bloodUreaNitrogen',
      'sgpt': 'sgpt',
      'alt': 'sgpt',
      'sgot': 'sgot',
      'ast': 'sgot', 
      'blood_uric_acid': 'uricAcid',
      'uricAcid': 'uricAcid'
    };

    return tests.map(test => {
      const mapped = fieldMapping[test];
      if (mapped) {
        return mapped;
      }
      return test;
    });
  }, []);

  /**
   * Expand lipid profile test into individual lipid components
   */
  const expandLipidProfile = useMemo(() => (tests: string[]): string[] => {
    let hasLipidProfile = false;
    
    // Common lipid profile identifiers to look for
    const lipidProfileIdentifiers = [
      'lipid profile',
      'lipid_profile', 
      'lipidProfile',
      'cholesterol panel',
      'lipid panel'
    ];
    
    // Filter out lipid profile identifiers and mark if found
    const filteredTests = tests.filter(test => {
      const testLower = test.toLowerCase();
      
      const isExactMatch = lipidProfileIdentifiers.some(identifier => 
        testLower === identifier.toLowerCase()
      );
      
      const isPartialMatch = lipidProfileIdentifiers.some(identifier => {
        const identifierLower = identifier.toLowerCase();
        // Only allow partial match if the test is a meaningful substring
        // Avoid matching individual components like 'cholesterol' with 'cholesterol panel'
        return identifierLower.includes(testLower) && testLower.length >= 4 && 
               (testLower === 'lipid' || testLower === 'panel' || testLower === 'profile');
      });
      
      if (isExactMatch || isPartialMatch) {
        hasLipidProfile = true;
        return false; // Remove this identifier
      }
      
      return true; // Keep non-lipid-profile tests
    });
    
    // Add all lipid profile components if we found a lipid profile
    const expandedTests = [...filteredTests];
    if (hasLipidProfile) {
      const lipidProfileComponents = [
        'cholesterol',    // Total Cholesterol (matches form config)
        'triglycerides',  // Triglycerides  
        'hdl',           // HDL Cholesterol (matches form config)
        'ldl',           // LDL Cholesterol (matches form config)
        'vldl'           // VLDL Cholesterol (matches form config)
      ];
      
      // Add components that aren't already present (case-insensitive check)
      for (const component of lipidProfileComponents) {
        const componentLower = component.toLowerCase();
        const alreadyExists = expandedTests.some(test => {
          const testLower = test.toLowerCase();
          // Check for exact match or if the component exists as part of another test
          return testLower === componentLower || testLower.includes(componentLower);
        });
        
        if (!alreadyExists) {
          expandedTests.push(component);
        }
      }
    }
    
    // Remove duplicates (case-insensitive, but preserve empty strings)
    const uniqueTests = [];
    const seenLower = new Set();
    
    for (const test of expandedTests) {
      // Handle empty strings specially - don't deduplicate them
      if (test === '') {
        uniqueTests.push(test);
        continue;
      }
      
      const testLower = test.toLowerCase();
      if (!seenLower.has(testLower)) {
        uniqueTests.push(test);
        seenLower.add(testLower);
      }
    }
    
    return uniqueTests;
  }, []);

  return {
    mapLabRequestFieldsToFormIds,
    expandLipidProfile
  };
};
