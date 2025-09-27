import React from 'react';
import { Box } from '@mantine/core';
import { ReportField } from './ReportField';
import { FIELD_LABELS, REFERENCE_VALUES } from '../../config/urinalysisReportConfig';
import { getReportStyles } from '../../utils/urinalysisReportStyles';

interface UrinalysisMicroscopicFieldsProps {
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const UrinalysisMicroscopicFields: React.FC<UrinalysisMicroscopicFieldsProps> = ({
  labData,
  formatValue,
  editable = false,
  enabledFields = [],
  onChange,
  errors = {},
}) => {
  const styles = getReportStyles();

  return (
    <Box style={styles.sectionContainer}>
      {/* Epithelial Cells and Red Cells */}
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.epithelialCells}
          value={editable ? labData?.epithelialCells || '' : formatValue(labData?.epithelialCells)}
          size="large"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('epithelialCells', value)}
          error={errors.epithelialCells}
          name="epithelialCells"
        />
        <ReportField
          label={FIELD_LABELS.redCells}
          value={editable ? labData?.redCells || '' : formatValue(labData?.redCells)}
          size="medium"
          referenceValue={REFERENCE_VALUES.redCells}
          labelWidth="wide"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('redCells', value)}
          error={errors.redCells}
          name="redCells"
        />
      </Box>

      {/* Mucus Thread and Pus Cells */}
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.mucusThread}
          value={editable ? labData?.mucusThread || '' : formatValue(labData?.mucusThread)}
          size="large"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('mucusThread', value)}
          error={errors.mucusThread}
          name="mucusThread"
        />
        <ReportField
          label={FIELD_LABELS.pusCells}
          value={editable ? labData?.pusCells || '' : formatValue(labData?.pusCells)}
          size="medium"
          referenceValue={REFERENCE_VALUES.pusCells}
          labelWidth="wide"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('pusCells', value)}
          error={errors.pusCells}
          name="pusCells"
        />
      </Box>

      {/* A.Urates and Bacteria */}
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.amorphousUrates}
          value={editable ? labData?.amorphousUrates || '' : formatValue(labData?.amorphousUrates)}
          size="large"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('amorphousUrates', value)}
          error={errors.amorphousUrates}
          name="amorphousUrates"
        />
        <ReportField
          label={FIELD_LABELS.bacteria}
          value={editable ? labData?.bacteria || '' : formatValue(labData?.bacteria)}
          size="large"
          labelWidth="wide"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('bacteria', value)}
          error={errors.bacteria}
          name="bacteria"
        />
      </Box>

      {/* A.Phosphate - Full width */}
      <Box style={{ marginBottom: '8px' }}>
        <ReportField
          label={FIELD_LABELS.amorphousPhosphate}
          value={editable ? labData?.amorphousPhosphate || '' : formatValue(labData?.amorphousPhosphate)}
          size="full"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('amorphousPhosphate', value)}
          error={errors.amorphousPhosphate}
          name="amorphousPhosphate"
        />
      </Box>

      {/* Crystals - Full width */}
      <Box style={{ marginBottom: '8px' }}>
        <ReportField
          label={FIELD_LABELS.crystals}
          value={editable ? labData?.crystals || '' : formatValue(labData?.crystals)}
          size="full"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('crystals', value)}
          error={errors.crystals}
          name="crystals"
        />
      </Box>

      {/* Others - Full width */}
      <Box style={{ marginBottom: '8px' }}>
        <ReportField
          label={FIELD_LABELS.others}
          value={editable ? labData?.others || '' : formatValue(labData?.others)}
          size="full"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('others', value)}
          error={errors.others}
          name="others"
        />
      </Box>

      {/* Pregnancy Test - Full width */}
      <Box style={{ marginBottom: '20px' }}>
        <ReportField
          label={FIELD_LABELS.pregnancyTest}
          value={editable ? labData?.pregnancyTest || '' : formatValue(labData?.pregnancyTest)}
          size="full"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('pregnancyTest', value)}
          error={errors.pregnancyTest}
          name="pregnancyTest"
        />
      </Box>
    </Box>
  );
};