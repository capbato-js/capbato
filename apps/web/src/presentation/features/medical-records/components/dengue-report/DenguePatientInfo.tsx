import React from 'react'
import { Box } from '@mantine/core'
import { SerologyPatientData } from '../../utils/serologyReportUtils'
import { DenguePatientField } from './DenguePatientField'
import { DengueDoctorField } from './DengueDoctorField'
import { getReportStyles } from '../../utils/serologyReportStyles'

interface DenguePatientInfoProps {
  patientData?: SerologyPatientData
  editable?: boolean
  doctorId?: string
  onDoctorChange?: (doctorId: string) => void
  error?: string
}

export const DenguePatientInfo: React.FC<DenguePatientInfoProps> = ({
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
        <DenguePatientField
          label="Name :"
          value={patientData?.patientName || patientData?.name || ''}
        />

        <DenguePatientField
          label="Date :"
          value={patientData?.dateRequested || ''}
        />
      </Box>
      <Box>
        <DenguePatientField
          label="Age :"
          value={patientData?.age?.toString() || ''}
        />
        <DenguePatientField
          label="Sex :"
          value={patientData?.gender || patientData?.sex || ''}
        />
      </Box>
      <Box>
        <DengueDoctorField
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
