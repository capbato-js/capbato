import { useLabTestFieldMapping } from './useLabTestFieldMapping';
import { renderHook } from '@testing-library/react';

describe('Debug vldl issue', () => {
  it('debug lipid profile expansion step by step', () => {
    const { result } = renderHook(() => useLabTestFieldMapping());
    
    // Test with simple lipid profile
    console.log('\n=== Testing simple lipid profile ===');
    const expanded1 = result.current.expandLipidProfile(['lipid profile']);
    console.log('Input: ["lipid profile"]');
    console.log('Output:', expanded1);
    console.log('Length:', expanded1.length);
    console.log('Includes vldl?', expanded1.includes('vldl'));
    
    // Test with no existing components
    console.log('\n=== Testing with no existing components ===');
    const expanded2 = result.current.expandLipidProfile(['lipid_profile']);
    console.log('Input: ["lipid_profile"]');
    console.log('Output:', expanded2);
    
    // Test with some existing components
    console.log('\n=== Testing with existing hdl ===');
    const expanded3 = result.current.expandLipidProfile(['hdl', 'lipid profile']);
    console.log('Input: ["hdl", "lipid profile"]');
    console.log('Output:', expanded3);
    
    // Test with just vldl to see if it gets mapped correctly
    console.log('\n=== Testing just vldl ===');
    const expanded4 = result.current.expandLipidProfile(['vldl']);
    console.log('Input: ["vldl"]');
    console.log('Output:', expanded4);
  });
});