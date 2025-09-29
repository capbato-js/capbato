import React from 'react';
import { Box, Text } from '@mantine/core';
import { EcgReportField } from './EcgReportField';
import { getReportStyles } from '../../utils/ecgReportStyles';

interface EcgFieldsProps {
  labData?: Record<string, string | undefined>;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const EcgFields: React.FC<EcgFieldsProps> = ({
  labData = {},
  editable = false,
  enabledFields = [],
  onChange,
  errors = {},
}) => {
  const styles = getReportStyles(editable);

  const handleFieldChange = (field: string, value: string) => {
    onChange?.(field, value);
  };

  return (
    <Box style={styles.sectionContainer}>
      {/* First Row - AV, QRS, AXIS */}
      <Box style={styles.fieldRow}>
        <EcgReportField
          label="AV-"
          name="av"
          value={labData.av}
          size="medium"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => handleFieldChange('av', value)}
          error={errors.av}
          flex={1}
        />
        <EcgReportField
          label="QRS-"
          name="qrs"
          value={labData.qrs}
          size="medium"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => handleFieldChange('qrs', value)}
          error={errors.qrs}
          flex={1}
        />
        <EcgReportField
          label="AXIS-"
          name="axis"
          value={labData.axis}
          size="medium"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => handleFieldChange('axis', value)}
          error={errors.axis}
          flex={1}
        />
      </Box>

      {/* Second Row - PR, QT, ST-T */}
      <Box style={styles.fieldRow}>
        <EcgReportField
          label="PR+"
          name="pr"
          value={labData.pr}
          size="medium"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => handleFieldChange('pr', value)}
          error={errors.pr}
          flex={1}
        />
        <EcgReportField
          label="QT"
          name="qt"
          value={labData.qt}
          size="medium"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => handleFieldChange('qt', value)}
          error={errors.qt}
          flex={1}
        />
        <EcgReportField
          label="ST-T"
          name="stT"
          value={labData.stT}
          size="medium"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => handleFieldChange('stT', value)}
          error={errors.stT}
          flex={1}
        />
      </Box>

      {/* Third Row - RHYTHM, OTHERS */}
      <Box style={styles.fieldRow}>
        <EcgReportField
          label="RHYTHM"
          name="rhythm"
          value={labData.rhythm}
          size="medium"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => handleFieldChange('rhythm', value)}
          error={errors.rhythm}
          flex={1}
        />
        <EcgReportField
          label="OTHERS"
          name="others"
          value={labData.others}
          size="xlarge"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => handleFieldChange('others', value)}
          error={errors.others}
          flex={2}
        />
      </Box>

      {/* Interpretation Section */}
      <Box style={{ marginTop: '30px' }}>
        <EcgReportField
          label="Interpretation:"
          name="interpretation"
          value={labData.interpretation}
          size="interpretation"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => handleFieldChange('interpretation', value)}
          error={errors.interpretation}
          isTextarea={true}
          flex={1}
        />
      </Box>
    </Box>
  );
};