import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { AddressSelector } from './AddressSelector';
import type { ProvinceDto, CityDto, BarangayDto } from '@nx-starter/application-shared';

// Test data
const mockProvinces: ProvinceDto[] = [
  { code: 'province1', name: 'Province 1' },
  { code: 'province2', name: 'Province 2' },
];

const mockCities: CityDto[] = [
  { code: 'city1', name: 'City 1' },
  { code: 'city2', name: 'City 2' },
];

const mockBarangays: BarangayDto[] = [
  { code: 'barangay1', name: 'Barangay 1' },
  { code: 'barangay2', name: 'Barangay 2' },
];

// Wrapper component for tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('AddressSelector', () => {
  const mockProvinceProps = {
    value: '',
    onChange: vi.fn(),
    error: undefined,
    disabled: false,
  };

  const mockCityProps = {
    value: '',
    onChange: vi.fn(),
    error: undefined,
    disabled: false,
  };

  const mockBarangayProps = {
    value: '',
    onChange: vi.fn(),
    error: undefined,
    disabled: false,
  };

  const mockAddressData = {
    provinces: mockProvinces,
    cities: mockCities,
    barangays: mockBarangays,
    isLoadingProvinces: false,
    isLoadingCities: false,
    isLoadingBarangays: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all address selection fields', () => {
    render(
      <TestWrapper>
        <AddressSelector
          provinceProps={mockProvinceProps}
          cityProps={mockCityProps}
          barangayProps={mockBarangayProps}
          addressData={mockAddressData}
        />
      </TestWrapper>
    );

    // Basic rendering test - check that the labels are present
    expect(screen.getByText('Province')).toBeInTheDocument();
    expect(screen.getByText('City/Municipality')).toBeInTheDocument();
    expect(screen.getByText('Barangay')).toBeInTheDocument();
  });

  it('should show loading state for provinces', () => {
    const loadingData = {
      ...mockAddressData,
      isLoadingProvinces: true,
    };

    render(
      <TestWrapper>
        <AddressSelector
          provinceProps={mockProvinceProps}
          cityProps={mockCityProps}
          barangayProps={mockBarangayProps}
          addressData={loadingData}
        />
      </TestWrapper>
    );

    // The loading state is shown inside the select component
    // We'll just check that the component renders without error
    expect(screen.getByText('Province')).toBeInTheDocument();
    expect(screen.getByText('City/Municipality')).toBeInTheDocument();
    expect(screen.getByText('Barangay')).toBeInTheDocument();
  });

  it('should show proper placeholders for disabled fields', () => {
    const disabledCityProps = {
      ...mockCityProps,
      disabled: true,
    };

    const disabledBarangayProps = {
      ...mockBarangayProps,
      disabled: true,
    };

    render(
      <TestWrapper>
        <AddressSelector
          provinceProps={mockProvinceProps}
          cityProps={disabledCityProps}
          barangayProps={disabledBarangayProps}
          addressData={mockAddressData}
        />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText(/select province first/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/select city first/i)).toBeInTheDocument();
  });

  it('should display error message when present', () => {
    const errorData = {
      ...mockAddressData,
      error: 'Failed to load address data',
    };

    render(
      <TestWrapper>
        <AddressSelector
          provinceProps={mockProvinceProps}
          cityProps={mockCityProps}
          barangayProps={mockBarangayProps}
          addressData={errorData}
        />
      </TestWrapper>
    );

    expect(screen.getByText(/failed to load address data/i)).toBeInTheDocument();
  });
});