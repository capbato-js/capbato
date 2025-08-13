import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Stack,
  Alert,
  Checkbox,
  Box,
  TextInput,
  Grid,
  Title,
  Text,
  Center,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { AddLabTestFormSchema } from '@nx-starter/application-shared';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { FormSelect } from '../../../components/ui/FormSelect';
import { Icon } from '../../../components/common';
import { LAB_TEST_ITEMS, formatTestLabel, calculateTotalPrice, formatTestPrice } from '../constants/labTestConstants';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';

// Type for add lab test form
interface AddLabTestFormData {
  patientName: string;  // This will contain the patient ID selected from dropdown
  ageGender: string;
  requestDate: string;
  selectedTests: string[];
  otherTests?: string;
}

interface AddLabTestFormProps {
  onSubmit: (data: AddLabTestFormData) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

/**
 * AddLabTestForm component handles adding new laboratory test requests
 * with patient information, test selection, and validation.
 */
export const AddLabTestForm: React.FC<AddLabTestFormProps> = ({
  onSubmit,
  isLoading,
  error
}) => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [patients, setPatients] = useState<Array<{ value: string; label: string; patientNumber: string; age: number; gender: string }>>([]);
  const [selectedPatientNumber, setSelectedPatientNumber] = useState<string>('');
  const [selectedPatientAgeGender, setSelectedPatientAgeGender] = useState<string>('');

  // Get patient store
  const patientStore = usePatientStore();

  // Load patients on component mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        await patientStore.loadPatients();
      } catch (error) {
        console.error('Failed to load patients:', error);
      }
    };

    loadPatients();
  }, []);

  // Format patients for select component
  useEffect(() => {
    if (patientStore.patients.length > 0) {
      const formattedPatients = patientStore.patients.map(patient => ({
        value: patient.id,
        label: `${patient.firstName} ${patient.lastName}`,
        patientNumber: patient.patientNumber,
        age: patient.age,
        gender: patient.gender,
      }));
      setPatients(formattedPatients);
    }
  }, [patientStore.patients]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<AddLabTestFormData>({
    resolver: zodResolver(AddLabTestFormSchema),
    mode: 'onBlur',
    defaultValues: {
      patientName: '',
      ageGender: '',
      requestDate: new Date().toISOString().split('T')[0], // Today's date
      selectedTests: [],
      otherTests: '',
    },
  });

  // Watch form values for button state
  const patientName = watch('patientName');
  const ageGender = watch('ageGender');
  const requestDate = watch('requestDate');

  // Check if form fields are empty
  const isFormEmpty = !patientName || !ageGender || !requestDate || selectedTests.length === 0;

  // Handle patient selection to show patient number and auto-populate age/gender
  const handlePatientChange = (patientId: string) => {
    const selectedPatient = patients.find(p => p.value === patientId);
    if (selectedPatient) {
      setSelectedPatientNumber(selectedPatient.patientNumber);
      const ageGenderString = `${selectedPatient.age}/${selectedPatient.gender.charAt(0).toUpperCase()}`;
      setSelectedPatientAgeGender(ageGenderString);
      setValue('patientName', patientId);
      setValue('ageGender', ageGenderString);
    }
  };

  // Handle test selection
  const handleTestSelection = (testId: string, checked: boolean) => {
    let updatedTests: string[];
    
    if (checked) {
      updatedTests = [...selectedTests, testId];
    } else {
      updatedTests = selectedTests.filter(id => id !== testId);
    }
    
    setSelectedTests(updatedTests);
    setValue('selectedTests', updatedTests);
  };

  const handleFormSubmit = handleSubmit(async (data: AddLabTestFormData) => {
    await onSubmit({
      ...data,
      selectedTests,
    });
  });

  // Group tests exactly like the legacy form
  const routineTests = LAB_TEST_ITEMS.filter(test => test.category === 'ROUTINE');
  const serologyTests = LAB_TEST_ITEMS.filter(test => test.category === 'SEROLOGY_IMMUNOLOGY');
  const bloodChemistryTests = LAB_TEST_ITEMS.filter(test => test.category === 'BLOOD_CHEMISTRY');
  const miscellaneousTests = LAB_TEST_ITEMS.filter(test => test.category === 'MISCELLANEOUS');
  const thyroidTests = LAB_TEST_ITEMS.filter(test => test.category === 'THYROID_FUNCTION');

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <Stack gap="lg">
        {error && (
          <Alert color="red" style={{ marginBottom: '10px' }}>
            {error}
          </Alert>
        )}

        {/* Header Section */}
        <Box mb="lg">
          <Center>
            <Stack gap="xs" align="center">
              <Title order={3} style={{ fontWeight: 'bold', margin: 0 }}>
                DMYM DIAGNOSTIC & LABORATORY CENTER
              </Title>
              <Text size="sm" style={{ margin: 0 }}>
                696 Commonwealth Ave., Litex Rd., Quezon City
              </Text>
              <Text size="sm" style={{ margin: 0 }}>
                Contact No: (02) 263-1036 / 0927-254-6213
              </Text>
            </Stack>
          </Center>
        </Box>

        {/* Patient Information Section */}
        <Box>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <Controller
                name="patientName"
                control={control}
                render={({ field, fieldState }) => (
                  <Box>
                    <FormSelect
                      {...field}
                      label="Patient:"
                      placeholder="Search and select patient"
                      data={patients}
                      error={fieldState.error}
                      disabled={isLoading || patientStore.getIsLoading()}
                      onChange={(value) => {
                        field.onChange(value);
                        if (value) handlePatientChange(value);
                      }}
                      leftSection={<Icon icon="fas fa-user" size={16} />}
                    />
                    {/* Patient Number Display */}
                    {selectedPatientNumber && (
                      <Text size="sm" c="dimmed" mt={4}>
                        Patient #: {selectedPatientNumber}
                      </Text>
                    )}
                  </Box>
                )}
              />
            </Grid.Col>
            
            <Grid.Col span={3}>
              <FormTextInput
                {...register('ageGender')}
                label="Age/Gender:"
                placeholder="Age / Gender"
                disabled
                required
                error={errors.ageGender}
                value={selectedPatientAgeGender}
                readOnly
              />
            </Grid.Col>
            
            <Grid.Col span={3}>
              <Controller
                name="requestDate"
                control={control}
                render={({ field, fieldState }) => (
                  <DateInput
                    label="Date:"
                    placeholder="Select date"
                    error={fieldState.error?.message}
                    disabled={isLoading}
                    value={field.value ? new Date(field.value) : null}
                    popoverProps={{
                      position: 'bottom-end',
                      withinPortal: true,
                    }}
                    onChange={(value) => {
                      let dateString = '';
                      if (value && typeof value === 'object' && 'getTime' in value) {
                        const dateObj = value as Date;
                        if (!isNaN(dateObj.getTime())) {
                          dateString = dateObj.toISOString().split('T')[0];
                        }
                      }
                      field.onChange(dateString);
                    }}
                  />
                )}
              />
            </Grid.Col>
          </Grid>
        </Box>

        {/* Lab Tests Selection Section - Three Column Layout */}
        <Box>
          <Grid gutter="lg">
            {/* Column 1: BLOOD CHEMISTRY */}
            <Grid.Col span={4}>
              <Box>
                <Title order={5} mb="sm" style={{ textDecoration: 'underline', fontSize: '16px' }}>
                  BLOOD CHEMISTRY
                </Title>
                <Stack gap="xs">
                  {bloodChemistryTests.map((test) => (
                    <Checkbox
                      key={test.id}
                      label={formatTestLabel(test.name, test.price)}
                      checked={selectedTests.includes(test.id)}
                      onChange={(event) => handleTestSelection(test.id, event.currentTarget.checked)}
                      disabled={isLoading}
                      size="sm"
                    />
                  ))}
                </Stack>
              </Box>
            </Grid.Col>

            {/* Column 2: SEROLOGY & IMMUNOLOGY */}
            <Grid.Col span={4}>
              <Box>
                <Title order={5} mb="sm" style={{ textDecoration: 'underline', fontSize: '16px' }}>
                  SEROLOGY & IMMUNOLOGY
                </Title>
                <Stack gap="xs">
                  {serologyTests.map((test) => (
                    <Checkbox
                      key={test.id}
                      label={formatTestLabel(test.name, test.price)}
                      checked={selectedTests.includes(test.id)}
                      onChange={(event) => handleTestSelection(test.id, event.currentTarget.checked)}
                      disabled={isLoading}
                      size="sm"
                    />
                  ))}
                </Stack>
              </Box>
            </Grid.Col>

            {/* Column 3: ROUTINE, THYROID FUNCTION TEST, MISCELLANEOUS TEST */}
            <Grid.Col span={4}>
              {/* ROUTINE */}
              <Box mb="lg">
                <Title order={5} mb="sm" style={{ textDecoration: 'underline', fontSize: '16px' }}>
                  ROUTINE
                </Title>
                <Stack gap="xs">
                  {routineTests.map((test) => (
                    <Checkbox
                      key={test.id}
                      label={formatTestLabel(test.name, test.price)}
                      checked={selectedTests.includes(test.id)}
                      onChange={(event) => handleTestSelection(test.id, event.currentTarget.checked)}
                      disabled={isLoading}
                      size="sm"
                    />
                  ))}
                </Stack>
              </Box>

              {/* THYROID FUNCTION TEST */}
              <Box mb="lg">
                <Title order={5} mb="sm" style={{ textDecoration: 'underline', fontSize: '16px' }}>
                  THYROID FUNCTION TEST
                </Title>
                <Stack gap="xs">
                  {thyroidTests.map((test) => (
                    <Checkbox
                      key={test.id}
                      label={formatTestLabel(test.name, test.price)}
                      checked={selectedTests.includes(test.id)}
                      onChange={(event) => handleTestSelection(test.id, event.currentTarget.checked)}
                      disabled={isLoading}
                      size="sm"
                    />
                  ))}
                </Stack>
              </Box>

              {/* MISCELLANEOUS TEST */}
              <Box>
                <Title order={5} mb="sm" style={{ textDecoration: 'underline', fontSize: '16px' }}>
                  MISCELLANEOUS TEST
                </Title>
                <Stack gap="xs">
                  {miscellaneousTests.map((test) => (
                    <Checkbox
                      key={test.id}
                      label={formatTestLabel(test.name, test.price)}
                      checked={selectedTests.includes(test.id)}
                      onChange={(event) => handleTestSelection(test.id, event.currentTarget.checked)}
                      disabled={isLoading}
                      size="sm"
                    />
                  ))}
                </Stack>
              </Box>
            </Grid.Col>
          </Grid>
        </Box>

        {/* Other Tests Section */}
        <Box>
          <TextInput
            {...register('otherTests')}
            label="OTHERS (Specify):"
            placeholder="Write here..."
            disabled={isLoading}
          />
        </Box>

        {/* Validation Error for Selected Tests */}
        {errors.selectedTests && (
          <Alert color="red" mt="sm">
            {errors.selectedTests.message}
          </Alert>
        )}

        {/* Total Price Display */}
        {selectedTests.length > 0 && (
          <Box style={{ alignSelf: 'center' }}>
            <Text size="lg" fw={500} ta="center">
              Total: {formatTestPrice(calculateTotalPrice(selectedTests))}
            </Text>
          </Box>
        )}

        {/* Submit Button */}
        <Box style={{ alignSelf: 'center' }}>
          <Button
            type="submit"
            disabled={isFormEmpty || isLoading}
            loading={isLoading}
            size="md"
            mt="lg"
          >
            <Icon icon="fas fa-paper-plane" style={{ marginRight: '8px' }} />
            Submit Request
          </Button>
        </Box>
      </Stack>
    </form>
  );
};
