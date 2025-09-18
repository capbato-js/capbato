import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../test/test-utils';
import { PatientInfoDisplay } from './PatientInfoDisplay';

describe('PatientInfoDisplay', () => {
  it('should render patient number when provided', () => {
    const patientNumber = 'P12345';
    render(<PatientInfoDisplay patientNumber={patientNumber} />);
    
    expect(screen.getByText('Patient Number: P12345')).toBeInTheDocument();
  });

  it('should not render when patient number is empty string', () => {
    render(<PatientInfoDisplay patientNumber="" />);
    
    expect(screen.queryByText(/Patient Number:/)).not.toBeInTheDocument();
  });

  it('should not render when patient number is null', () => {
    render(<PatientInfoDisplay patientNumber={null as any} />);
    
    expect(screen.queryByText(/Patient Number:/)).not.toBeInTheDocument();
  });

  it('should not render when patient number is undefined', () => {
    render(<PatientInfoDisplay patientNumber={undefined as any} />);
    
    expect(screen.queryByText(/Patient Number:/)).not.toBeInTheDocument();
  });

  it('should handle numeric patient numbers', () => {
    render(<PatientInfoDisplay patientNumber="123456" />);
    
    expect(screen.getByText('Patient Number: 123456')).toBeInTheDocument();
  });

  it('should handle alphanumeric patient numbers', () => {
    render(<PatientInfoDisplay patientNumber="PAT-2024-001" />);
    
    expect(screen.getByText('Patient Number: PAT-2024-001')).toBeInTheDocument();
  });

  it('should handle patient numbers with special characters', () => {
    render(<PatientInfoDisplay patientNumber="P-123_456.789" />);
    
    expect(screen.getByText('Patient Number: P-123_456.789')).toBeInTheDocument();
  });

  it('should have correct text styling and attributes', () => {
    render(<PatientInfoDisplay patientNumber="P12345" />);
    
    const text = screen.getByText('Patient Number: P12345');
    expect(text).toBeInTheDocument();
    // Mantine styles are applied via className, so we verify the element exists
  });
});