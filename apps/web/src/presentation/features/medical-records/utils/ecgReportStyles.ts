export const getReportStyles = (editable?: boolean) => ({
  // Container styles
  reportContainer: {
    backgroundColor: 'white',
    padding: '40px 20px 40px 40px',
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
    minWidth: '80px',
    marginBottom: '-12px',
  },

  fieldLabelWide: {
    fontWeight: 'bold',
    minWidth: '140px',
    marginBottom: '-12px',
  },

  // Input field styles
  fieldInput: {
    borderBottom: editable ? 'none' : '1px solid #000',
    minWidth: '150px',
    textAlign: 'center' as const,
    height: editable ? 'auto' : '22px',
  },

  fieldInputSmall: {
    borderBottom: editable ? 'none' : '1px solid #000',
    minWidth: '120px',
    textAlign: 'center' as const,
    height: editable ? 'auto' : '22px',
  },

  // used fields
  fieldInputMedium: {
    borderBottom: editable ? 'none' : '1px solid #000',
    minWidth: editable ? '123px' : '143px',
    textAlign: 'center' as const,
    height: editable ? 'auto' : '22px',
    marginRight: '20px'
  },

  fieldInputLarge: {
    borderBottom: editable ? 'none' : '1px solid #000',
    minWidth: '200px',
    textAlign: 'center' as const,
    height: editable ? 'auto' : '22px',
  },

  // Styling for OTHERS field
  fieldInputXLarge: {
    borderBottom: editable ? 'none' : '1px solid #000',
    minWidth: editable ? '385px' : '395px',
    textAlign: 'center' as const,
    height: editable ? 'auto' : '22px',
    marginRight: editable ? '10px' : '17px',
  },

  fieldInputFull: {
    borderBottom: editable ? 'none' : '1px solid #000',
    minWidth: '500px',
    textAlign: 'center' as const,
    height: editable ? 'auto' : '22px',
  },

  fieldInputInterpretation: {
    borderBottom: editable ? 'none' : '1px solid #000',
    minWidth: '738px',
    textAlign: 'left' as const,
    height: editable ? 'auto' : 'auto',
    marginTop: editable ? '-5px' : '-10px',
    paddingLeft: editable ? 'auto' : '5px'
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
    justifyContent: 'flex-end',
    marginTop: '60px',
    borderTop: '1px solid #ddd',
    paddingTop: '20px',
  },

  signatureBox: {
    textAlign: 'center' as const,
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

  // Utility styles
  referenceValue: {
    fontSize: '12px',
    width: editable ? '50px' : '50px',
    marginLeft: editable ? 0: '10px',
    marginBottom: editable ? '-3px' : '-12px',
    paddingBottom: 0
  },

  printButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
  },
});