import React from 'react'
import { Box } from '@mantine/core'
import { SerologyPatientData } from '../../utils/serologyReportUtils'
import { HematologyPatientField } from './HematologyPatientField'
import { getReportStyles } from '../../utils/serologyReportStyles'

interface HematologyPatientInfoProps {
  patientData?: SerologyPatientData
}

export const HematologyPatientInfo: React.FC<HematologyPatientInfoProps> = ({
  patientData,
}) => {
  const styles = getReportStyles()

  return (
    <Box style={styles.patientInfoContainer}>
      <Box>
        <HematologyPatientField
          label="Patient Name:"
          value={patientData?.patientName || patientData?.name || ''}
        />
        <HematologyPatientField
          label="Examination:"
          value="HEMATOLOGY"
        />
      </Box>
      <Box>
        <HematologyPatientField
          label="Age:"
          value={patientData?.age?.toString() || ''}
        />
        <HematologyPatientField
          label="Date:"
          value={patientData?.dateRequested || ''}
        />
      </Box>
      <Box>
        <HematologyPatientField
          label="Sex:"
          value={patientData?.gender || patientData?.sex || ''}
        />
      </Box>
    </Box>
  )
}
