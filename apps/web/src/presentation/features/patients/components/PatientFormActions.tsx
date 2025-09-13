import React from 'react';
import { Button, Box } from '@mantine/core';
import { FORM_ACTIONS, FORM_STYLES, getFormActionButtons } from '../config/patientFormConfig';
import { patientFormTestIds } from '@nx-starter/utils-core';

interface PatientFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isFormEmpty: boolean;
}

export const PatientFormActions: React.FC<PatientFormActionsProps> = ({
  onCancel,
  onSubmit,
  isLoading,
  isFormEmpty
}) => {
  const { cancelIcon, submitIcon } = getFormActionButtons();

  return (
    <Box style={FORM_STYLES.formActions}>
      <Button
        variant={FORM_ACTIONS.cancel.variant}
        color={FORM_ACTIONS.cancel.color}
        onClick={onCancel}
        disabled={isLoading}
        data-testid={patientFormTestIds.cancelPatientButton}
      >
        {cancelIcon}
        {FORM_ACTIONS.cancel.text}
      </Button>
      <Button
        type="button"
        disabled={isFormEmpty || isLoading}
        loading={isLoading}
        onClick={onSubmit}
        data-testid={patientFormTestIds.savePatientButton}
      >
        {submitIcon}
        {isLoading ? FORM_ACTIONS.submit.loadingText : FORM_ACTIONS.submit.text}
      </Button>
    </Box>
  );
};