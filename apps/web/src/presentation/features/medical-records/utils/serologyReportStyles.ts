export const getReportStyles = (editable?: boolean) => ({
  // Container styles
  reportContainer: {
    backgroundColor: 'white',
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.4',
  },

  // Header styles
  headerContainer: {
    textAlign: 'center' as const,
    marginBottom: '30px',
  },

  labTitle: {
    margin: '0 0 5px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#000',
  },

  labInfo: {
    margin: '2px 0',
    fontSize: '12px',
  },

  licenseInfo: {
    margin: '2px 0 15px 0',
    fontSize: '12px',
  },

  reportTitle: {
    margin: '15px 0 30px 0',
    color: 'red',
    letterSpacing: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
  },

  // Patient info styles
  patientInfoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '30px',
    alignItems: 'flex-start',
  },

  patientInfoField: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },

  patientLabel: {
    fontWeight: 'normal',
    marginRight: '10px',
  },

  patientValue: {
    borderBottom: editable ? 'none' : '1px solid #000',
    minWidth: '120px',
    textAlign: 'left' as const,
    height: editable ? 'auto' : '22px',
    paddingBottom: '2px',
  },

  // Table styles with borders
  tableContainer: {
    marginBottom: '30px',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    border: '1px solid #000',
    fontSize: '14px',
  },

  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    padding: '12px 8px',
    border: '1px solid #000',
  },

  tableCell: {
    padding: '12px 8px',
    border: '1px solid #000',
    textAlign: 'center' as const,
    verticalAlign: 'middle' as const,
    minHeight: '40px',
  },

  testNameCell: {
    textAlign: 'left' as const,
    fontWeight: 'bold' as const,
    paddingLeft: '16px',
  },

  resultCell: {
    minWidth: '120px',
  },

  referenceCell: {
    fontSize: '12px',
    color: '#666',
  },

  // Input field styles for editable mode
  tableInput: {
    width: '100%',
    border: editable ? '1px solid #007bff' : 'none',
    background: editable ? 'white' : 'transparent',
    textAlign: 'center' as const,
    paddingLeft: editable ? '5px' : '0',
    fontSize: '14px',
    outline: 'none',
  },

  // Signature styles
  signatureContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '60px',
    borderTop: '1px solid #ddd',
    paddingTop: '20px',
  },

  signatureBox: {
    textAlign: 'center' as const,
    flex: 1,
  },

  signatureName: {
    fontWeight: 'bold',
    fontSize: '12px',
    borderBottom: editable ? 'none' : '1px solid #000',
    paddingBottom: '2px',
    marginBottom: '5px',
    display: 'inline-block',
    minWidth: '200px',
  },

  signatureTitle: {
    fontWeight: 'bold',
    fontSize: '12px',
  },

  signatureLicense: {
    fontSize: '10px',
    marginTop: '5px',
  },

  // Utility styles
  printButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
  },

  // Error styles
  errorText: {
    color: 'red',
    fontSize: '12px',
    marginTop: '4px',
  },
});