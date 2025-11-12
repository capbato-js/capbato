import React from 'react';
import { Button, Box } from '@mantine/core';
import { FORM_ACTIONS, FORM_STYLES, getFormActionButtons } from '../config/patientFormConfig';
import { patientFormTestIds } from '@nx-starter/utils-core';

interface PatientFormActionsProps {
  onCancel: () => void;
  isLoading: boolean;
  isFormEmpty: boolean;
}

export const PatientFormActions: React.FC<PatientFormActionsProps> = ({
  onCancel,
  isLoading,
  isFormEmpty
}) => {
  const { cancelIcon, submitIcon } = getFormActionButtons();

  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('🖱️ PatientFormActions: Submit button clicked');
    console.log('🔍 PatientFormActions: isFormEmpty:', isFormEmpty);
    console.log('🔍 PatientFormActions: isLoading:', isLoading);
    console.log('🔍 PatientFormActions: Button disabled?', isFormEmpty || isLoading);
    // Don't prevent default - let the form handle submission
  };

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
        type="submit"
        disabled={isFormEmpty || isLoading}
        loading={isLoading}
        onClick={handleSubmitClick}
        data-testid={patientFormTestIds.savePatientButton}
      >
        {submitIcon}
        {isLoading ? FORM_ACTIONS.submit.loadingText : FORM_ACTIONS.submit.text}
      </Button>
    </Box>
  );
};