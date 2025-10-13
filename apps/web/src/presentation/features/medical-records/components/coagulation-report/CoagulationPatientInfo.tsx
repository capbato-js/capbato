import React from 'react'
import { Box } from '@mantine/core'
import { SerologyPatientData } from '../../utils/serologyReportUtils'
import { CoagulationPatientField } from './CoagulationPatientField'
import { getReportStyles } from '../../utils/serologyReportStyles'

interface CoagulationPatientInfoProps {
  patientData?: SerologyPatientData
}

export const CoagulationPatientInfo: React.FC<CoagulationPatientInfoProps> = ({
  patientData,
}) => {
  const styles = getReportStyles()

  return (
    <Box style={styles.patientInfoContainer}>
      <Box>
        <CoagulationPatientField
          label="Name:"
          value={patientData?.patientName || patientData?.name || ''}
        />
        <CoagulationPatientField
          label="Examination:"
          value="PT PTT"
        />
      </Box>
      <Box>
        <CoagulationPatientField
          label="Age:"
          value={patientData?.age?.toString() || ''}
        />
        <CoagulationPatientField
          label="Date:"
          value={patientData?.dateRequested || ''}
        />
      </Box>
      <Box>
        <CoagulationPatientField
          label="Sex:"
          value={patientData?.gender || patientData?.sex || ''}
        />
      </Box>
    </Box>
  )
}
