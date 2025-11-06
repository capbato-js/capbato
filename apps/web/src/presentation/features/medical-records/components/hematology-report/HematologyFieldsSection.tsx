import React from 'react';
import { Box, Text, TextInput, Textarea } from '@mantine/core';
import {
  HEMATOLOGY_FIELD_LABELS,
  HEMATOCRIT_RANGES,
  HEMOGLOBIN_RANGES,
  RBC_RANGES,
  DEMOGRAPHIC_CATEGORIES
} from '../../config/hematologyReportConfig';
import { getInputBackgroundColor } from '../../utils/labTestRangeValidator';

interface HematologyFieldsSectionProps {
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
  editable?: boolean;
  onChange?: (field: string, value: string) => void;
}

export const HematologyFieldsSection: React.FC<HematologyFieldsSectionProps> = ({
  labData,
  formatValue,
  editable = false,
  onChange,
}) => {



  return (
    <Box style={{ paddingLeft: '0px', paddingRight: '40px' }}>
      {/* HEMATOCRIT Section */}
      <Box mb="md">
        <Box style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
          {/* Column 1: Label */}
          <Box style={{ minWidth: '155px', paddingTop: '2px' }}>
            <Text size="sm" style={{ fontSize: '14px', textTransform: 'uppercase' }}>
              {HEMATOLOGY_FIELD_LABELS.hematocrit}
            </Text>
          </Box>

          {/* Column 2: Input Field */}
          <Box style={{ width: '150px', marginLeft: '10px' }}>
            {editable ? (
              <TextInput
                value={labData?.hematocrit || ''}
                onChange={(e) => onChange?.('hematocrit', e.currentTarget.value)}
                styles={{
                  input: {
                    border: '1px solid #007bff',
                    fontSize: '15px',
                    padding: '4px 8px',
                  }
                }}
                size="xs"
              />
            ) : (
              <Text style={{
                borderBottom: '1px solid #333',
                minHeight: '18px',
                fontSize: '13px',
                padding: '2px 4px',
              }}>
                {formatValue(labData?.hematocrit)}
              </Text>
            )}
          </Box>

          {/* Column 3: Demographic Categories and Reference Ranges - Vertical Layout */}
          <Box style={{ width: '300px', marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {Object.entries(HEMATOCRIT_RANGES).map(([category, range]) => (
              <Box key={category} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text size="xs" style={{ fontSize: '11px', textTransform: 'uppercase', width: '80px' }}>
                  {DEMOGRAPHIC_CATEGORIES[category as keyof typeof DEMOGRAPHIC_CATEGORIES]}
                </Text>
                <Text size="xs" style={{ fontSize: '11px' }}>
                  {range}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* HEMOGLOBIN Section */}
      <Box mb="md">
        <Box style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
          {/* Column 1: Label */}
          <Box style={{ minWidth: '155px', paddingTop: '2px' }}>
            <Text size="sm" style={{ fontSize: '14px', textTransform: 'uppercase' }}>
              {HEMATOLOGY_FIELD_LABELS.hemoglobin}
            </Text>
          </Box>

          {/* Column 2: Input Field */}
          <Box style={{ width: '150px', marginLeft: '10px' }}>
            {editable ? (
              <TextInput
                value={labData?.hemoglobin || ''}
                onChange={(e) => onChange?.('hemoglobin', e.currentTarget.value)}
                styles={{
                  input: {
                    border: '1px solid #007bff',
                    fontSize: '15px',
                    padding: '4px 8px',
                  }
                }}
                size="xs"
              />
            ) : (
              <Text style={{
                borderBottom: '1px solid #333',
                minHeight: '18px',
                fontSize: '13px',
                padding: '2px 4px',
              }}>
                {formatValue(labData?.hemoglobin)}
              </Text>
            )}
          </Box>

          {/* Column 3: Demographic Categories and Reference Ranges - Vertical Layout */}
          <Box style={{ width: '300px', marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {Object.entries(HEMOGLOBIN_RANGES).map(([category, range]) => (
              <Box key={category} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text size="xs" style={{ fontSize: '11px', textTransform: 'uppercase', width: '80px' }}>
                  {DEMOGRAPHIC_CATEGORIES[category as keyof typeof DEMOGRAPHIC_CATEGORIES]}
                </Text>
                <Text size="xs" style={{ fontSize: '11px' }}>
                  {range}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* RBC Section */}
      <Box mb="md">
        <Box style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
          {/* Column 1: Label */}
          <Box style={{ minWidth: '155px', paddingTop: '2px' }}>
            <Text size="sm" style={{ fontSize: '14px', textTransform: 'uppercase' }}>
              {HEMATOLOGY_FIELD_LABELS.rbc}
            </Text>
          </Box>

          {/* Column 2: Input Field */}
          <Box style={{ width: '150px', marginLeft: '10px' }}>
            {editable ? (
              <TextInput
                value={labData?.rbc || ''}
                onChange={(e) => onChange?.('rbc', e.currentTarget.value)}
                styles={{
                  input: {
                    border: '1px solid #007bff',
                    fontSize: '15px',
                    padding: '4px 8px',
                  }
                }}
                size="xs"
              />
            ) : (
              <Text style={{
                borderBottom: '1px solid #333',
                minHeight: '18px',
                fontSize: '13px',
                padding: '2px 4px',
              }}>
                {formatValue(labData?.rbc)}
              </Text>
            )}
          </Box>

          {/* Column 3: Demographic Categories and Reference Ranges - Vertical Layout */}
          <Box style={{ width: '300px', marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {Object.entries(RBC_RANGES).map(([category, range]) => (
              <Box key={category} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text size="xs" style={{ fontSize: '11px', textTransform: 'uppercase', width: '80px' }}>
                  {DEMOGRAPHIC_CATEGORIES[category as keyof typeof DEMOGRAPHIC_CATEGORIES]}
                </Text>
                <Text size="xs" style={{ fontSize: '11px' }}>
                  {range}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Other fields - Reference ranges in Column 3, no Column 4 */}
      {[
        { key: 'wbc', label: HEMATOLOGY_FIELD_LABELS.wbc, range: '4.5 - 11.0 x 10⁹/L' },
        { key: 'segmenters', label: HEMATOLOGY_FIELD_LABELS.segmenters, range: '0.50 - 0.60' },
        { key: 'lymphocyte', label: HEMATOLOGY_FIELD_LABELS.lymphocyte, range: '0.20-0.50' },
        { key: 'monocyte', label: HEMATOLOGY_FIELD_LABELS.monocyte, range: '0.0 - 0.08' },
        { key: 'basophils', label: HEMATOLOGY_FIELD_LABELS.basophils, range: '0.01 - 0.03' },
        { key: 'eosinophils', label: HEMATOLOGY_FIELD_LABELS.eosinophils, range: '0.0 - 0.04' },
        { key: 'platelet', label: HEMATOLOGY_FIELD_LABELS.platelet, range: '150-400 g x 10⁹/L' }
      ].map(field => {
        const fieldValue = labData?.[field.key] || '';
        const backgroundColor = getInputBackgroundColor(fieldValue, field.range);

        return (
          <Box key={field.key} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            {/* Column 1: Label */}
            <Box style={{ minWidth: '155px' }}>
              <Text size="sm" style={{ fontSize: '14px', textTransform: 'uppercase' }}>
                {field.label}
              </Text>
            </Box>

            {/* Column 2: Input Field */}
            <Box style={{ width: '150px', marginLeft: '10px' }}>
              {editable ? (
                <TextInput
                  value={fieldValue}
                  onChange={(e) => onChange?.(field.key, e.currentTarget.value)}
                  styles={{
                    input: {
                      border: '1px solid #007bff',
                      fontSize: '15px',
                      padding: '4px 8px',
                      backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : 'white',
                    }
                  }}
                  size="xs"
                />
              ) : (
                <Text style={{
                  borderBottom: '1px solid #333',
                  minHeight: '18px',
                  fontSize: '13px',
                  padding: '2px 4px',
                  backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : 'transparent',
                }}>
                  {formatValue(labData?.[field.key])}
                </Text>
              )}
            </Box>
          
          {/* Column 3: Reference Range */}
          <Box style={{ width: '180px', marginLeft: '20px' }}>
            <Text size="xs" style={{ fontSize: '12px' }}>
              {field.range}
            </Text>
          </Box>
          
          {/* Column 4: Empty for these fields */}
          <Box style={{ width: '120px', marginLeft: '10px' }} />
        </Box>
        );
      })}

      {/* OTHERS field with wider input spanning multiple columns */}
      <Box style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        {/* Column 1: Label */}
        <Box style={{ minWidth: '155px' }}>
          <Text size="sm" style={{ fontSize: '14px', textTransform: 'uppercase' }}>
            Others:
          </Text>
        </Box>

        {/* Column 2 + 3: Wider Input Field */}
        <Box style={{ width: '450px', marginLeft: '10px' }}>
          {editable ? (
            <Textarea
              value={labData?.others || ''}
              onChange={(e) => onChange?.('others', e.currentTarget.value)}
              minRows={1}
              autosize
              styles={{
                input: {
                  border: '1px solid #007bff',
                  fontSize: '15px',
                  padding: '4px 8px',
                }
              }}
              size="xs"
            />
          ) : (
            <Text style={{
              borderBottom: '1px solid #333',
              minHeight: '18px',
              fontSize: '13px',
              padding: '2px 4px',
            }}>
              {formatValue(labData?.others)}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};