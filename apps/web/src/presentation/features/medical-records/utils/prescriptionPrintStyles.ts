export const getPrescriptionPrintStyles = () => {
  return {
    printContainer: {
      maxWidth: '800px',
      width: '100%',
      margin: '0 auto',
      padding: '40px',
      fontFamily: '"Times New Roman", Times, serif',
      backgroundColor: 'white',
    },
    clinicHeader: {
      textAlign: 'center' as const,
      marginBottom: '30px',
    },
    doctorNameHeader: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    specialty: {
      fontSize: '14px',
      marginBottom: '5px',
    },
    clinicName: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '3px',
    },
    address: {
      fontSize: '13px',
      marginBottom: '2px',
    },
    hours: {
      fontSize: '13px',
      marginTop: '10px',
      marginBottom: '2px',
    },
    contact: {
      fontSize: '13px',
    },
    divider: {
      borderTop: '2px solid #000',
      margin: '20px 0',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      alignItems: 'baseline',
    },
    infoField: {
      fontSize: '16px',
    },
    patientDetails: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginTop: '30px',
      gap: '20px',
    },
    rxImageContainer: {
      flex: '0 0 auto',
    },
    rxImage: {
      width: '80px',
      height: 'auto',
    },
    medicationsList: {
      flex: 1,
    },
    medicationItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '25px',
      pageBreakInside: 'avoid' as const,
    },
    medicationDetails: {
      flex: 1,
    },
    medicationName: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '3px',
    },
    medicationInstructions: {
      fontSize: '16px',
      paddingLeft: '0',
    },
    medicationQuantity: {
      fontSize: '18px',
      fontWeight: 'bold',
      minWidth: '80px',
      textAlign: 'right' as const,
    },
    footer: {
      marginTop: '100px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    followUp: {
      fontSize: '16px',
    },
    signatureSection: {
      textAlign: 'right' as const,
    },
    doctorName: {
      fontSize: '14px',
      fontWeight: 'bold',
    },
    licenseInfo: {
      fontSize: '12px',
    },
    noPrint: {
      '@media print': {
        display: 'none',
      },
    },
  };
};

export const prescriptionPrintCSS = `
@media print {
  .noPrint {
    display: none !important;
  }

  .printArea {
    display: block !important;
  }

  body {
    margin: 0;
    padding: 0;
  }

  @page {
    margin: 0.5in;
  }
}
`;
