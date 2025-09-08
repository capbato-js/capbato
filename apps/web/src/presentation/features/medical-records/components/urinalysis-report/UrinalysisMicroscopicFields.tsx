import React from 'react';
import { Box } from '@mantine/core';
import { ReportField } from './ReportField';
import { FIELD_LABELS, REFERENCE_VALUES } from '../../config/urinalysisReportConfig';
import { getReportStyles } from '../../utils/urinalysisReportStyles';

interface UrinalysisMicroscopicFieldsProps {
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
}

export const UrinalysisMicroscopicFields: React.FC<UrinalysisMicroscopicFieldsProps> = ({
  labData,
  formatValue,
}) => {
  const styles = getReportStyles();

  return (
    <Box style={styles.sectionContainer}>
      {/* Epithelial Cells and Red Cells */}
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.epithelialCells}
          value={formatValue(labData?.epithelialCells)}
          size="large"
        />
        <ReportField
          label={FIELD_LABELS.redCells}
          value={formatValue(labData?.redCells)}
          size="medium"
          referenceValue={REFERENCE_VALUES.redCells}
          labelWidth="wide"
        />
      </Box>

      {/* Mucus Thread and Pus Cells */}
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.mucusThread}
          value={formatValue(labData?.mucusThread)}
          size="large"
        />
        <ReportField
          label={FIELD_LABELS.pusCells}
          value={formatValue(labData?.pusCells)}
          size="medium"
          referenceValue={REFERENCE_VALUES.pusCells}
          labelWidth="wide"
        />
      </Box>

      {/* A.Urates and Bacteria */}
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.amorphousUrates}
          value={formatValue(labData?.amorphousUrates)}
          size="large"
        />
        <ReportField
          label={FIELD_LABELS.bacteria}
          value={formatValue(labData?.bacteria)}
          size="large"
          labelWidth="wide"
        />
      </Box>

      {/* A.Phosphate - Full width */}
      <Box style={{ marginBottom: '8px' }}>
        <ReportField
          label={FIELD_LABELS.amorphousPhosphate}
          value={formatValue(labData?.amorphousPhosphate)}
          size="full"
        />
      </Box>

      {/* Crystals - Full width */}
      <Box style={{ marginBottom: '8px' }}>
        <ReportField
          label={FIELD_LABELS.crystals}
          value={formatValue(labData?.crystals)}
          size="full"
        />
      </Box>

      {/* Others - Full width */}
      <Box style={{ marginBottom: '8px' }}>
        <ReportField
          label={FIELD_LABELS.others}
          value={formatValue(labData?.others)}
          size="full"
        />
      </Box>

      {/* Pregnancy Test - Full width */}
      <Box style={{ marginBottom: '20px' }}>
        <ReportField
          label={FIELD_LABELS.pregnancyTest}
          value={formatValue(labData?.pregnancyTest)}
          size="full"
        />
      </Box>
    </Box>
  );
};