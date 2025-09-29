import React from 'react';
import { Box, Button, Group, Alert } from '@mantine/core';
import { IconPrinter, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { FecalysisPatientData } from '../../utils/fecalysisReportUtils';
import { getReportStyles } from '../../utils/fecalysisReportStyles';
import { FecalysisReportHeader } from './FecalysisReportHeader';
import { FecalysisPatientInfo } from './FecalysisPatientInfo';
import { FecalysisFields } from './FecalysisFields';
import { FecalysisSignatures } from './FecalysisSignatures';
import classes from './FecalysisReportView.module.css';

interface FecalysisReportViewPresenterProps {
  printRef: React.RefObject<HTMLDivElement>;
  patientData?: FecalysisPatientData;
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

export const FecalysisReportViewPresenter: React.FC<FecalysisReportViewPresenterProps> = ({
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
        <FecalysisReportHeader />

        <FecalysisPatientInfo patientData={patientData} />

        <FecalysisFields
          labData={labData}
          formatValue={formatValue}
          editable={editable}
          enabledFields={enabledFields}
          onChange={onChange}
          errors={errors}
        />

        <FecalysisSignatures />
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