import React from 'react';
import { Box, Skeleton } from '@mantine/core';
import { LabTestField } from './LabTestField';
import { LabTestFieldConfig } from '../constants/labTestFormConfig';
import { UseFormRegister } from 'react-hook-form';
import { createSkeletonArray } from '../utils/labTestResultFormUtils';
import type { AddLabTestResultFormData } from '../hooks/useLabTestResultFormState';

interface LabTestFieldsGridProps {
  leftFields: LabTestFieldConfig[];
  rightFields: LabTestFieldConfig[];
  register: UseFormRegister<AddLabTestResultFormData>;
  enabledFields?: string[];
  viewMode: boolean;
  isLoadingData: boolean;
}

const gridStyles = {
  display: 'flex',
  gap: '40px',
  marginTop: '0px'
};

const columnStyles = {
  flex: 1
};

const skeletonRowStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
  marginBottom: '5px',
  gap: '10px'
};

export const LabTestFieldsGrid: React.FC<LabTestFieldsGridProps> = ({
  leftFields,
  rightFields,
  register,
  enabledFields,
  viewMode,
  isLoadingData,
}) => {
  if (isLoadingData) {
    return (
      <Box style={gridStyles} className="results">
        {/* Left Column Skeleton */}
        <Box style={columnStyles} className="column">
          {createSkeletonArray(6).map((index) => (
            <Box key={`left-skeleton-${index}`} style={skeletonRowStyles}>
              <Skeleton height={16} width={120} />
              <Skeleton height={32} width={150} />
              <Skeleton height={16} width={80} />
            </Box>
          ))}
        </Box>

        {/* Right Column Skeleton */}
        <Box style={columnStyles}>
          {createSkeletonArray(6).map((index) => (
            <Box key={`right-skeleton-${index}`} style={skeletonRowStyles}>
              <Skeleton height={16} width={120} />
              <Skeleton height={32} width={150} />
              <Skeleton height={16} width={80} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box style={gridStyles} className="results">
      {/* Left Column */}
      <Box style={columnStyles} className="column">
        {leftFields.map(field => (
          <LabTestField
            key={field.id}
            field={field}
            register={register}
            enabledFields={enabledFields}
            viewMode={viewMode}
          />
        ))}
      </Box>

      {/* Right Column */}
      <Box style={columnStyles}>
        {rightFields.map(field => (
          <LabTestField
            key={field.id}
            field={field}
            register={register}
            enabledFields={enabledFields}
            viewMode={viewMode}
          />
        ))}
      </Box>
    </Box>
  );
};