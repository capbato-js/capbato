import React from 'react';
import { Box, Button, Group, Alert } from '@mantine/core';
import { IconPrinter, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { BloodChemistryPatientData } from '../../utils/bloodChemistryReportUtils';
import { getReportStyles } from '../../utils/bloodChemistryReportStyles';
import { BloodChemistryReportHeader } from './BloodChemistryReportHeader';
import { BloodChemistryPatientInfo } from './BloodChemistryPatientInfo';
import { BloodChemistryLeftFields } from './BloodChemistryLeftFields';
import { BloodChemistryRightFields } from './BloodChemistryRightFields';
import { BloodChemistrySignatures } from './BloodChemistrySignatures';
import classes from './BloodChemistryReportView.module.css';

interface BloodChemistryReportViewPresenterProps {
  printRef: React.RefObject<HTMLDivElement>;
  patientData?: BloodChemistryPatientData;
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
  onPrint: () => void;
  onBack?: () => void;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (field: string, value: string) => void;
  errors?: Record<string, string>;
  onSubmit?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
  submitButtonText?: string;
}

export const BloodChemistryReportViewPresenter: React.FC<BloodChemistryReportViewPresenterProps> = ({
  printRef,
  patientData,
  labData,
  formatValue,
  onPrint,
  onBack,
  editable = false,
  enabledFields = [],
  onChange,
  errors = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  error,
  submitButtonText = 'Submit Result',
}) => {
  const styles = getReportStyles();

  return (
    <Box>
      {/* Report content */}
      <Box
        ref={printRef}
        style={styles.reportContainer}
        className={classes.printArea}
      >
        <BloodChemistryReportHeader />

        <BloodChemistryPatientInfo patientData={patientData} />

        <Box style={styles.twoColumnContainer}>
          <BloodChemistryLeftFields
            labData={labData}
            formatValue={formatValue}
            editable={editable}
            enabledFields={enabledFields}
            onChange={onChange}
            errors={errors}
          />

          <BloodChemistryRightFields
            labData={labData}
            formatValue={formatValue}
            editable={editable}
            enabledFields={enabledFields}
            onChange={onChange}
            errors={errors}
          />
        </Box>

        <BloodChemistrySignatures />
      </Box>

      {/* Error display */}
      {error && (
        <Box style={{ margin: '16px 0' }} className={classes.noPrint}>
          <Alert color="red" title="Error">
            {error}
          </Alert>
        </Box>
      )}

      {/* Action buttons */}
      <Box
        style={styles.printButtonContainer}
        className={classes.noPrint}
      >
        {editable ? (
          <Group>
            <Button
              variant="filled"
              leftSection={<IconDeviceFloppy size={20} />}
              onClick={onSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {submitButtonText}
            </Button>
            <Button
              variant="outline"
              leftSection={<IconX size={20} />}
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </Group>
        ) : (
          <Button
            variant="filled"
            leftSection={<IconPrinter size={20} />}
            onClick={onPrint}
          >
            Print Report
          </Button>
        )}
      </Box>
    </Box>
  );
};