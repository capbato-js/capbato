import React from 'react'
import { Box } from '@mantine/core'
import { SerologyPatientData } from '../../utils/serologyReportUtils'
import { SerologyPatientField } from './SerologyPatientField'
import { SerologyDoctorField } from './SerologyDoctorField'
import { getReportStyles } from '../../utils/serologyReportStyles'

interface SerologyPatientInfoProps {
  patientData?: SerologyPatientData
  editable?: boolean
  doctorId?: string
  onDoctorChange?: (doctorId: string) => void
  error?: string
}

export const SerologyPatientInfo: React.FC<SerologyPatientInfoProps> = ({
  patientData,
  editable = false,
  doctorId,
  onDoctorChange,
  error,
}) => {
  const styles = getReportStyles()

  return (
    <Box style={styles.patientInfoContainer}>
      <Box>
        <SerologyPatientField
          label="Name :"
          value={patientData?.patientName || patientData?.name || ''}
        />

        <SerologyPatientField
          label="Date :"
          value={patientData?.dateRequested || ''}
        />
      </Box>
      <Box>
        <SerologyPatientField
          label="Age :"
          value={patientData?.age?.toString() || ''}
        />
        <SerologyPatientField
          label="Sex :"
          value={patientData?.gender || patientData?.sex || ''}
        />
      </Box>
      <Box>
        <SerologyDoctorField
          label="DOCTOR :"
          editable={editable}
          doctorId={doctorId}
          doctorName={patientData?.doctorName}
          onChange={onDoctorChange}
          error={error}
        />
      </Box>
    </Box>
  )
}
