import React from 'react';
import { Box, Button, Group, Alert } from '@mantine/core';
import { IconPrinter, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { SerologyPatientData } from '../../utils/serologyReportUtils';
import { getReportStyles } from '../../utils/serologyReportStyles';
import { SerologyReportHeader } from './SerologyReportHeader';
import { SerologyPatientInfo } from './SerologyPatientInfo';
import { SerologyFieldsTable } from './SerologyFieldsTable';
import { SerologySignatures } from './SerologySignatures';
import classes from './SerologyReportView.module.css';

interface SerologyReportViewPresenterProps {
  printRef: React.RefObject<HTMLDivElement>;
  patientData?: SerologyPatientData;
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
  onPrint: () => void;
  onBack?: () => void;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (field: string, value: string) => void;
  onDoctorChange?: (doctorId: string) => void;
  errors?: Record<string, string>;
  onSubmit?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
  submitButtonText?: string;
}

export const SerologyReportViewPresenter: React.FC<SerologyReportViewPresenterProps> = ({
  printRef,
  patientData,
  labData,
  formatValue,
  onPrint,
  onBack,
  editable = false,
  enabledFields = [],
  onChange,
  onDoctorChange,
  errors = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  error,
  submitButtonText = 'Submit Result',
}) => {
  const styles = getReportStyles(editable);

  return (
    <Box>
      {/* Report content */}
      <Box
        ref={printRef}
        style={styles.reportContainer}
        className={classes.printArea}
      >
        <SerologyReportHeader />

        <SerologyPatientInfo
          patientData={patientData}
          editable={editable}
          doctorId={labData?.doctorId}
          onDoctorChange={onDoctorChange}
          error={errors.doctorId}
        />

        <SerologyFieldsTable
          labData={labData}
          formatValue={formatValue}
          editable={editable}
          enabledFields={enabledFields}
          onChange={onChange}
          errors={errors}
        />

        <SerologySignatures />
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