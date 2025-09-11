export const getReportStyles = () => ({
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
  
  // Field styles
  fieldRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    alignItems: 'baseline',
  },
  
  fieldContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
  },
  
  fieldLabel: {
    fontWeight: 'bold',
    minWidth: '130px',
    marginBottom: '-12px',
  },
  
  fieldLabelWide: {
    fontWeight: 'bold',
    minWidth: '140px',
    marginBottom: '-12px',
  },
  
  // Input field styles
  fieldInput: {
    borderBottom: '1px solid #000',
    minWidth: '210px',
    paddingBottom: '2px',
    textAlign: 'center' as const,
    height: '22px',
  },
  
  fieldInputSmall: {
    borderBottom: '1px solid #000',
    minWidth: '100px',
    paddingBottom: '2px',
    textAlign: 'center' as const,
    height: '22px',
  },
  
  fieldInputMedium: {
    borderBottom: '1px solid #000',
    minWidth: '150px',
    paddingBottom: '2px',
    textAlign: 'center' as const,
    height: '22px',
  },
  
  fieldInputLarge: {
    borderBottom: '1px solid #000',
    minWidth: '200px',
    paddingBottom: '2px',
    textAlign: 'center' as const,
    height: '22px',
  },
  
  fieldInputXLarge: {
    borderBottom: '1px solid #000',
    minWidth: '250px',
    paddingBottom: '2px',
    textAlign: 'left' as const,
    height: '22px',
  },
  
  fieldInputFull: {
    borderBottom: '1px solid #000',
    minWidth: '580px',
    paddingBottom: '2px',
    textAlign: 'center' as const,
    height: '22px',
  },
  
  // Section styles
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: '15px',
    fontSize: '14px',
    textDecoration: 'underline',
  },
  
  sectionContainer: {
    marginBottom: '25px',
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
    borderBottom: '1px solid #000',
    paddingBottom: '2px',
    marginBottom: '5px',
    display: 'inline-block',
    minWidth: '200px',
  },
  
  signatureTitle: {
    fontWeight: 'bold',
    fontSize: '12px',
  },
  
  // Utility styles
  referenceValue: {
    fontSize: '12px',
    marginLeft: '10px',
  },
  
  printButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
  },
});