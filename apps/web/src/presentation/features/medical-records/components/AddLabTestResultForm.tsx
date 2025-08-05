import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Button,
  Stack,
  Box,
  Title,
  Text,
  Divider,
} from '@mantine/core';
import { Icon } from '../../../components/common/Icon';
import classes from './AddLabTestResultForm.module.css';

// Schema for lab test result form validation
const AddLabTestResultSchema = z.object({
  fbs: z.string().optional(),
  bun: z.string().optional(),
  creatinine: z.string().optional(),
  uricAcid: z.string().optional(),
  cholesterol: z.string().optional(),
  triglycerides: z.string().optional(),
  hdl: z.string().optional(),
  ldl: z.string().optional(),
  vldl: z.string().optional(),
  sodium: z.string().optional(),
  potassium: z.string().optional(),
  chloride: z.string().optional(),
  calcium: z.string().optional(),
  sgot: z.string().optional(),
  sgpt: z.string().optional(),
  rbs: z.string().optional(),
  protein: z.string().optional(),
  albumin: z.string().optional(),
  globulin: z.string().optional(),
  agRatio: z.string().optional(),
  bilirubinDirect: z.string().optional(),
  bilirubinIndirect: z.string().optional(),
  bilirubinTotal: z.string().optional(),
  hba1c: z.string().optional(),
  psa: z.string().optional(),
  magnesium: z.string().optional(),
  phosphorus: z.string().optional(),
  amylase: z.string().optional(),
  lipase: z.string().optional(),
  ldh: z.string().optional(),
  cpk: z.string().optional(),
});

type AddLabTestResultFormData = z.infer<typeof AddLabTestResultSchema>;

interface AddLabTestResultFormProps {
  patientData?: {
    patientNumber?: string;
    patientName?: string;
    name?: string;
    age?: number;
    gender?: string;
    sex?: string;
    address?: string;
    doctorName?: string;
    dateRequested?: string;
  };
  onSubmit: (data: AddLabTestResultFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const AddLabTestResultForm: React.FC<AddLabTestResultFormProps> = ({
  patientData,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
}) => {
  const {
    register,
    handleSubmit,
  } = useForm<AddLabTestResultFormData>({
    resolver: zodResolver(AddLabTestResultSchema),
  });

  const handleFormSubmit = (data: AddLabTestResultFormData) => {
    onSubmit(data);
  };

  return (
    <Box p="sm" data-id="add-lab" style={{ background: 'white', maxWidth: '850px', margin: 'auto', paddingTop: 0}}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack gap="sm">
          {/* Header */}
          <Box style={{ textAlign: 'center' }}>
            <Title order={2} size="h3" style={{ margin: '0', fontSize: '20px' }}>
              DMYM DIAGNOSTIC & LABORATORY CENTER
            </Title>
            <Text size="sm" style={{ margin: '0' }}>
              696 Commonwealth Ave., Litex Rd. Quezon City
            </Text>
            <Text size="sm" style={{ margin: '0' }}>
              TEL No. 263-1036
            </Text>
            <Text size="sm" fw={700} style={{ margin: '0' }}>
              LICENSE NUMBER. 1-3-CL-592-06-P
            </Text>
            <Title order={3} style={{ 
              margin: '10px 0', 
              color: '#cc0000', 
              letterSpacing: '3px',
              fontSize: '18px'
            }}>
              BLOOD CHEMISTRY
            </Title>
          </Box>

          {/* Patient Information */}
          <Box style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: '30px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
          }}>
            {/* Left Group */}
            <Box style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontWeight: 'bold'
              }}>
                <Text size="sm" fw={700}>Patient Name:</Text>
                <Box style={{ 
                  padding: '5px',
                  border: 'none',
                  borderBottom: '1px solid #000',
                  outline: 'none',
                  width: '200px',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <Text size="sm">{patientData?.patientName || patientData?.name || ''}</Text>
                </Box>
              </Box>

              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontWeight: 'bold'
              }}>
                <Text size="sm" fw={700}>Date:</Text>
                <Box style={{ 
                  padding: '5px',
                  border: 'none',
                  borderBottom: '1px solid #000',
                  outline: 'none',
                  width: '250px'
                }}>
                  <Text size="sm">{patientData?.dateRequested || new Date().toLocaleDateString()}</Text>
                </Box>
              </Box>
            </Box>

            {/* Right Group */}
            <Box style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontWeight: 'bold'
              }}>
                <Text size="sm" fw={700}>Age:</Text>
                <Box style={{ 
                  padding: '5px',
                  border: 'none',
                  borderBottom: '1px solid #000',
                  outline: 'none',
                  width: '250px'
                }}>
                  <Text size="sm">{patientData?.age || ''}</Text>
                </Box>
              </Box>

              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontWeight: 'bold'
              }}>
                <Text size="sm" fw={700}>Sex:</Text>
                <Box style={{ 
                  padding: '5px',
                  border: 'none',
                  borderBottom: '1px solid #000',
                  outline: 'none',
                  width: '250px'
                }}>
                  <Text size="sm">{patientData?.sex || patientData?.gender || ''}</Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Blood Chemistry Results Section */}
          <Box style={{ display: 'flex', gap: '40px', marginTop: '0px' }} className="results">
            {/* Left Column */}
            <Box style={{ flex: 1 }} className="column">
              {/* FBS */}
              <Box component="label" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>FBS</Text>
                <input
                  {...register('fbs')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}> 3.3-6.10 mmol/L </Text>
              </Box>

              {/* BUN */}
              <Box component="label" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>BUN</Text>
                <input
                  {...register('bun')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>2.86-8.20 mmol/L</Text>
              </Box>

              {/* CREATININE */}
              <Box component="label" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>CREATININE</Text>
                <input
                  {...register('creatinine')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>53-115 umol/L</Text>
              </Box>

              {/* URIC ACID */}
              <Box component="label" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>URIC ACID</Text>
                <input
                  {...register('uricAcid')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>0.15-0.41 mmol/L</Text>
              </Box>

              {/* CHOLESTEROL */}
              <Box component="label" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>CHOLESTEROL</Text>
                <input
                  {...register('cholesterol')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>3.35-7.37 mmol/L</Text>
              </Box>

              {/* TRIGLYCERIDES */}
              <Box component="label" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '5px' 
              }}>
                <Text size="sm" fw={500}>TRIGLYCERIDES</Text>
                <input
                  {...register('triglycerides')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>0.56-1.69 mmol/L</Text>
              </Box>

              {/* HDL */}
              <Box component="label" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>HDL</Text>
                <input
                  {...register('hdl')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>1.04-1.55 mmol/L</Text>
              </Box>

              {/* LDL */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>LDL</Text>
                <input
                  {...register('ldl')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>1.7-4.5 mmol/L</Text>
              </Box>

              {/* VLDL */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>VLDL</Text>
                <input
                  {...register('vldl')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>0.0-1.04 mmol/L</Text>
              </Box>

              {/* SODIUM */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>SODIUM</Text>
                <input
                  {...register('sodium')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>135-145 mmol/L</Text>
              </Box>

              {/* POTASSIUM */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>POTASSIUM</Text>
                <input
                  {...register('potassium')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>3.50-5.50 mmol/L</Text>
              </Box>

              {/* CHLORIDE */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>CHLORIDE</Text>
                <input
                  {...register('chloride')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>95-107 mmol/L</Text>
              </Box>

              {/* CALCIUM */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>CALCIUM</Text>
                <input
                  {...register('calcium')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>2.02-2.60 mEq/L</Text>
              </Box>

              {/* SGOT */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>SGOT</Text>
                <input
                  {...register('sgot')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>0-38 U/L</Text>
              </Box>

              {/* SGPT */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>SGPT</Text>
                <input
                  {...register('sgpt')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>0-40 U/L</Text>
              </Box>

              {/* RBS */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>RBS</Text>
                <input
                  {...register('rbs')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>7.1-11.1 mmol/L</Text>
              </Box>
            </Box>

            {/* Right Column */}
            <Box style={{ flex: 1 }}>
              {/* PROTEIN */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>PROTEIN</Text>
                <input
                  {...register('protein')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>66-83 g/L</Text>
              </Box>

              {/* ALBUMIN */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>ALBUMIN</Text>
                <input
                  {...register('albumin')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>35-50 g/L</Text>
              </Box>

              {/* GLOBULIN */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>GLOBULIN</Text>
                <input
                  {...register('globulin')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>26-35 g/L</Text>
              </Box>

              {/* A/G RATIO */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>A/G RATIO</Text>
                <input
                  {...register('agRatio')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>1.0-2.5</Text>
              </Box>

              {/* BILIRUBIN DIRECT */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>BILIRUBIN DIRECT</Text>
                <input
                  {...register('bilirubinDirect')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>0-3.4 umol/L</Text>
              </Box>

              {/* BILIRUBIN INDIRECT */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>BILIRUBIN INDIRECT</Text>
                <input
                  {...register('bilirubinIndirect')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>0-17.1 umol/L</Text>
              </Box>

              {/* BILIRUBIN TOTAL */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>BILIRUBIN TOTAL</Text>
                <input
                  {...register('bilirubinTotal')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>5.1-20.5 umol/L</Text>
              </Box>

              {/* HBA1C */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>HBA1C</Text>
                <input
                  {...register('hba1c')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>4.0-6.0%</Text>
              </Box>

              {/* PSA */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>PSA</Text>
                <input
                  {...register('psa')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>0-4.0 ng/mL</Text>
              </Box>

              {/* MAGNESIUM */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>MAGNESIUM</Text>
                <input
                  {...register('magnesium')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>0.70-1.10 mmol/L</Text>
              </Box>

              {/* PHOSPHORUS */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>PHOSPHORUS</Text>
                <input
                  {...register('phosphorus')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>0.87-1.45 mmol/L</Text>
              </Box>

              {/* AMYLASE */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>AMYLASE</Text>
                <input
                  {...register('amylase')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>25-125 U/L</Text>
              </Box>

              {/* LIPASE */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>LIPASE</Text>
                <input
                  {...register('lipase')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>10-140 U/L</Text>
              </Box>

              {/* LDH */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>LDH</Text>
                <input
                  {...register('ldh')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>84-246 U/L</Text>
              </Box>

              {/* CPK */}
              <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                marginBottom: '5px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                gap: '10px' 
              }}>
                <Text size="sm" fw={500}>CPK</Text>
                <input
                  {...register('cpk')}
                  type="text"
                  className={classes.nativeInput}
                />
                <Text size="sm" style={{ fontSize: '14px' }}>25-200 U/L</Text>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Error Display */}
          {error && (
            <Box style={{ 
              color: 'red', 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#ffebee', 
              borderRadius: '4px' 
            }}>
              <Text size="sm">{error}</Text>
            </Box>
          )}

          {/* Signatures Section */}
          <Box style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '20px', 
            fontSize: '14px', 
            fontWeight: 'bold', 
            textAlign: 'center' 
          }}>
            <Box>
              <Text size="sm" fw={700}>MARK C. MADRIAGA, RMT LIC. 42977</Text>
              <Text size="sm" fw={700}>Medical Technologist</Text>
            </Box>
            <Box>
              <Text size="sm" fw={700}>FREDERICK R. LLANERA, MD, FPSP LIC. #86353</Text>
              <Text size="sm" fw={700}>Pathologist</Text>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                style={{ minWidth: '100px' }}
                disabled={isLoading}
                leftSection={<Icon icon="fas fa-times" size={14} />}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              style={{ minWidth: '100px' }}
              loading={isLoading}
              disabled={isLoading}
              leftSection={<Icon icon="fas fa-save" size={14} />}
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};
