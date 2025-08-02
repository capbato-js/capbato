import React from 'react';
import { Select, type SelectProps, Grid } from '@mantine/core';
import { Icon } from '../common';
import type { ProvinceDto, CityDto, BarangayDto } from '@nx-starter/application-shared';

/**
 * Address Select Component Props
 */
interface AddressSelectProps extends Omit<SelectProps, 'data' | 'searchable' | 'clearable'> {
  /** Array of options to display */
  options: ProvinceDto[] | CityDto[] | BarangayDto[];
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Placeholder when disabled */
  disabledPlaceholder?: string;
}

/**
 * Searchable Select Component for Address Selection
 * 
 * Features:
 * - Searchable dropdown with filtering
 * - Loading state support
 * - Error state handling
 * - Proper disabled state with messaging
 * - Consistent styling with form components
 */
export const AddressSelect: React.FC<AddressSelectProps> = ({
  options,
  loading = false,
  error,
  disabledPlaceholder = 'Select...',
  disabled,
  placeholder,
  ...props
}) => {
  // Convert options to Select data format
  const selectData = options.map(option => ({
    value: option.code,
    label: option.name,
  }));

  // Determine final placeholder
  const finalPlaceholder = disabled 
    ? disabledPlaceholder 
    : loading 
      ? 'Loading...' 
      : placeholder;

  return (
    <Select
      {...props}
      data={selectData}
      placeholder={finalPlaceholder}
      disabled={disabled || loading}
      searchable
      clearable
      error={error}
      rightSection={loading ? <Icon icon="fas fa-spinner fa-spin" size={14} /> : undefined}
      comboboxProps={{
        transitionProps: { duration: 200, transition: 'pop' }
      }}
      styles={{
        input: {
          '&:disabled': {
            opacity: 0.6,
            backgroundColor: '#f8f9fa',
          }
        }
      }}
    />
  );
};

/**
 * Address Selector Component Props
 */
export interface AddressSelectorProps {
  /** Province field props */
  provinceProps: {
    value: string;
    onChange: (value: string | null) => void;
    error?: string;
    disabled?: boolean;
  };
  
  /** City field props */
  cityProps: {
    value: string;
    onChange: (value: string | null) => void;
    error?: string;
    disabled?: boolean;
  };
  
  /** Barangay field props */
  barangayProps: {
    value: string;
    onChange: (value: string | null) => void;
    error?: string;
    disabled?: boolean;
  };
  
  /** Address data and state */
  addressData: {
    provinces: ProvinceDto[];
    cities: CityDto[];
    barangays: BarangayDto[];
    isLoadingProvinces: boolean;
    isLoadingCities: boolean;
    isLoadingBarangays: boolean;
    error: string | null;
  };
  
  /** Optional class name */
  className?: string;
}

/**
 * Complete Address Selector Component
 * 
 * Provides Province → City/Municipality → Barangay cascading selection
 * with proper loading states and error handling.
 * 
 * Layout:
 * - Province and City/Municipality are displayed in the same row (50/50 split)
 * - Barangay is displayed below as full width
 * - Dynamic placeholders that change based on selection state
 * 
 * Usage:
 * ```tsx
 * <AddressSelector
 *   provinceProps={{
 *     value: selectedProvince,
 *     onChange: handleProvinceChange,
 *     error: errors.province
 *   }}
 *   cityProps={{
 *     value: selectedCity,
 *     onChange: handleCityChange,
 *     error: errors.city
 *   }}
 *   barangayProps={{
 *     value: selectedBarangay,
 *     onChange: handleBarangayChange,
 *     error: errors.barangay
 *   }}
 *   addressData={addressSelectorState}
 * />
 * ```
 */
export const AddressSelector: React.FC<AddressSelectorProps> = ({
  provinceProps,
  cityProps,
  barangayProps,
  addressData,
  className,
}) => {
  const {
    provinces,
    cities,
    barangays,
    isLoadingProvinces,
    isLoadingCities,
    isLoadingBarangays,
    error,
  } = addressData;

  return (
    <div className={className}>
      {/* Province and City/Municipality in the same row */}
      <Grid mb="sm">
        <Grid.Col span={6}>
          <AddressSelect
            label="Province"
            placeholder="Select Province"
            options={provinces}
            loading={isLoadingProvinces}
            error={error || provinceProps.error}
            value={provinceProps.value}
            onChange={provinceProps.onChange}
            disabled={provinceProps.disabled || isLoadingProvinces}
            required
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <AddressSelect
            label="City/Municipality"
            placeholder={provinceProps.value ? "Select City/Municipality" : "Select province first"}
            disabledPlaceholder="Select province first"
            options={cities}
            loading={isLoadingCities}
            error={cityProps.error}
            value={cityProps.value}
            onChange={cityProps.onChange}
            disabled={cityProps.disabled || !provinceProps.value || isLoadingCities}
            required
          />
        </Grid.Col>
      </Grid>

      {/* Barangay Selection - Full width */}
      <AddressSelect
        label="Barangay"
        placeholder={cityProps.value ? "Select Barangay" : "Select city first"}
        disabledPlaceholder="Select city first"
        options={barangays}
        loading={isLoadingBarangays}
        error={barangayProps.error}
        value={barangayProps.value}
        onChange={barangayProps.onChange}
        disabled={barangayProps.disabled || !cityProps.value || isLoadingBarangays}
        required
      />
    </div>
  );
};