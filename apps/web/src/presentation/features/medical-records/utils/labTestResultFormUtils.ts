export const createSkeletonArray = (count: number) => 
  Array.from({ length: count }, (_, index) => index);

export const formatPatientName = (patientData?: { patientName?: string; name?: string }) => 
  patientData?.patientName || patientData?.name || '';

export const formatPatientSex = (patientData?: { sex?: string; gender?: string }) => 
  patientData?.sex || patientData?.gender || '';

export const formatDate = (dateString?: string) => 
  dateString || new Date().toLocaleDateString();

export const formatPatientAge = (age?: number) => 
  age?.toString() || '';

export const getContainerStyles = () => ({
  background: 'white',
  maxWidth: '850px',
  margin: 'auto',
  paddingTop: 0
});

export const getPatientInfoStyles = () => ({
  leftGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  rightGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    gap: '30px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
    alignItems: 'flex-start' as const
  },
  field: {
    display: 'flex',
    alignItems: 'center' as const,
    gap: '10px',
    fontWeight: 'bold' as const
  },
  fieldValue: {
    padding: '5px',
    border: 'none',
    borderBottom: '1px solid #000',
    outline: 'none',
    width: '200px',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  fieldValueWide: {
    padding: '5px',
    border: 'none',
    borderBottom: '1px solid #000',
    outline: 'none',
    width: '250px'
  }
});