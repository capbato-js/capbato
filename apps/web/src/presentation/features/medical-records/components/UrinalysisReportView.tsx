import React, { useRef } from 'react'
import { Box, Text, Title, Button } from '@mantine/core'
import { IconArrowLeft, IconPrinter } from '@tabler/icons-react'
import { useReactToPrint } from 'react-to-print'
import classes from './UrinalysisReportView.module.css'

interface UrinalysisReportViewProps {
  patientData?: {
    patientNumber?: string
    patientName?: string
    name?: string
    age?: number
    gender?: string
    sex?: string
    dateRequested?: string
  }
  labData?: Record<string, string | undefined>
  onBack?: () => void
}

export const UrinalysisReportView: React.FC<UrinalysisReportViewProps> = ({
  patientData,
  labData,
  onBack,
}) => {
  const printRef = useRef<HTMLDivElement>(null)
  const formatValue = (value?: string) => value || ''

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Urinalysis_${patientData?.patientName?.replace(
      /\s+/g,
      '_',
    )}_${new Date().toISOString().split('T')[0]}`,
  })

  return (
    <Box>
      {/* Report content */}
      <Box
        ref={printRef}
        style={{
          backgroundColor: 'white',
          padding: '40px',
          maxWidth: '800px',
          margin: '0 auto',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          lineHeight: '1.4',
        }}
        className={classes.printArea}
      >
        {/* Header */}
        <Box
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            
          }}
        >
          <Title
            order={2}
            size="h3"
            style={{
              margin: '0 0 5px 0',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            DMYM DIAGNOSTIC & LABORATORY CENTER
          </Title>
          <Text size="sm" style={{ margin: '2px 0', fontSize: '12px' }}>
            696 Commonwealth Ave., Litex Rd. Quezon City
          </Text>
          <Text size="sm" style={{ margin: '2px 0', fontSize: '12px' }}>
            TEL No. 263-1036
          </Text>
          <Text
            size="sm"
            fw={700}
            style={{ margin: '2px 0 15px 0', fontSize: '12px' }}
          >
            LICENSE NUMBER: 1-3-CL-592-06-P
          </Text>
          <Title
            order={3}
            style={{
              margin: '15px 0 30px 0',
              color: 'red',
              letterSpacing: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            U R I N A L Y S I S
          </Title>
        </Box>

        {/* Patient Information */}
        <Box style={{ marginBottom: '30px' }}>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              alignItems: 'baseline',
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px',
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '130px',
                  marginBottom: '-12px',
                }}
              >
                Patient Name:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '250px',
                  paddingBottom: '2px',
                  textAlign: 'left',
                  height: '22px',
                }}
              >
                {patientData?.patientName || ''}
              </Text>
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px',
                flex: 0,
                marginLeft: '40px',
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '60px',
                  marginBottom: '-12px',
                }}
              >
                Age:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '100px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {patientData?.age || ''}
              </Text>
            </Box>
          </Box>

          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              alignItems: 'baseline',
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px',
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '130px',
                  marginBottom: '-12px',
                }}
              >
                Date:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '250px',
                  paddingBottom: '2px',
                  textAlign: 'left',
                  height: '22px',
                }}
              >
                {patientData?.dateRequested || new Date().toLocaleDateString()}
              </Text>
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px',
                flex: 0,
                marginLeft: '40px',
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '60px',
                  marginBottom: '-12px',
                }}
              >
                Sex:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '100px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {patientData?.sex || patientData?.gender || ''}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Microscopic Examination Section */}
        <Box style={{ marginBottom: '25px' }}>
          <Text
            style={{
              fontWeight: 'bold',
              marginBottom: '15px',
              fontSize: '14px',
              textDecoration: 'underline',
            }}
          >
            MICROSCOPIC EXAMINATION:
          </Text>

          {/* Physical Properties Row */}
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '130px',
                  marginBottom: '-12px',
                }}
              >
                Color:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '210px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.color)}
              </Text>
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '140px',
                  marginBottom: '-12px',
                }}
              >
                TRANSPARENCY:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '210px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.transparency)}
              </Text>
            </Box>
          </Box>

          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '130px',
                  marginBottom: '-12px',
                }}
              >
                Specific Gravity:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '200px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.specificGravity)}
              </Text>
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '140px',
                  marginBottom: '-12px',
                }}
              >
                pH:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '210px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.ph)}
              </Text>
            </Box>
          </Box>

          <Box style={{ marginBottom: '20px' }}>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    minWidth: '130px',
                    marginBottom: '-12px',
                  }}
                >
                  Protein:
                </Text>
                <Text
                  style={{
                    borderBottom: '1px solid #000',
                    minWidth: '200px',
                    paddingBottom: '2px',
                    textAlign: 'center',
                    height: '22px',
                  }}
                >
                  {formatValue(labData?.protein)}
                </Text>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    minWidth: '140px',
                    marginBottom: '-12px',
                  }}
                >
                  GLUCOSE:
                </Text>
                <Text
                  style={{
                    borderBottom: '1px solid #000',
                    minWidth: '210px',
                    paddingBottom: '2px',
                    textAlign: 'center',
                    height: '22px',
                  }}
                >
                  {formatValue(labData?.glucose)}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Microscopic Fields Section */}
        <Box style={{ marginBottom: '25px' }}>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '130px',
                  marginBottom: '-12px',
                }}
              >
                Epithelial Cells:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '200px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.epithelialCells)}
              </Text>
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '140px',
                  marginBottom: '-12px',
                }}
              >
                Red Cells:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '150px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.redCells)}
              </Text>
              <Text style={{ fontSize: '12px', marginLeft: '10px' }}>
                0-2/hpf
              </Text>
            </Box>
          </Box>

          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '130px',
                  marginBottom: '-12px',
                }}
              >
                Mucus Thread:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '200px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.mucusThread)}
              </Text>
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '140px',
                  marginBottom: '-12px',
                }}
              >
                Pus Cells:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '150px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.pusCells)}
              </Text>
              <Text style={{ fontSize: '12px', marginLeft: '10px' }}>
                0-5/hpf
              </Text>
            </Box>
          </Box>

          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '130px',
                  marginBottom: '-12px',
                }}
              >
                A.Urates:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '200px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.amorphousUrates)}
              </Text>
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '140px',
                  marginBottom: '-12px',
                }}
              >
                Bacteria:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '210px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.bacteria)}
              </Text>
            </Box>
          </Box>

          <Box style={{ marginBottom: '8px' }}>
            <Box style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '130px',
                  marginBottom: '-12px',
                }}
              >
                A.Phosphate:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '580px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.amorphousPhosphate)}
              </Text>
            </Box>
          </Box>

          <Box style={{ marginBottom: '8px' }}>
            <Box style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '130px',
                  marginBottom: '-12px',
                }}
              >
                Crystals:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '580px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.crystals)}
              </Text>
            </Box>
          </Box>

          <Box style={{ marginBottom: '8px' }}>
            <Box style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '130px',
                  marginBottom: '-12px',
                }}
              >
                Others:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '580px',
                  paddingBottom: '2px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.others)}
              </Text>
            </Box>
          </Box>

          <Box style={{ marginBottom: '20px' }}>
            <Box style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  minWidth: '130px',
                  marginBottom: '-12px',
                }}
              >
                Pregnancy Test:
              </Text>
              <Text
                style={{
                  borderBottom: '1px solid #000',
                  minWidth: '580px',
                  textAlign: 'center',
                  height: '22px',
                }}
              >
                {formatValue(labData?.pregnancyTest)}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Signatures Section */}
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '60px',
            borderTop: '1px solid #ddd',
            paddingTop: '20px',
          }}
        >
          <Box style={{ textAlign: 'center', flex: 1 }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                borderBottom: '1px solid #000',
                paddingBottom: '2px',
                marginBottom: '5px',
                display: 'inline-block',
                minWidth: '200px',
              }}
            >
              MARK C. MADRIAGA, RMT LIC. 42977
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: '12px' }}>
              Medical Technologist
            </Text>
          </Box>
          <Box style={{ textAlign: 'center', flex: 1 }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                borderBottom: '1px solid #000',
                paddingBottom: '2px',
                marginBottom: '5px',
                display: 'inline-block',
                minWidth: '200px',
              }}
            >
              FREDERICK R. LLANERA, MD, FPSP LIC. #86353
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: '12px' }}>
              Pathologist
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Print Report button at the bottom - only visible on screen, not in print */}
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '30px',
          '@media print': {
            display: 'none',
          },
        }}
        className={classes.noPrint}
      >
        <Button
          variant="filled"
          leftSection={<IconPrinter size={20} />}
          onClick={handlePrint}
        >
          Print Report
        </Button>
      </Box>
    </Box>
  )
}
