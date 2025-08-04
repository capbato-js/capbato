import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Checkbox } from '../../../components/ui/checkbox';
import { Separator } from '../../../components/ui/separator';
import { CreateLabRequestCommandSchema } from '@nx-starter/application-shared';
import { useLabRequestFormViewModel } from '../view-models/useLabRequestFormViewModel';
import { LabRequestFormData } from '../types/FormTypes';
import { LAB_TEST_ITEMS, getTestsByCategory } from '../constants/labTestConstants';

interface LabRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  patientId?: string;
  patientName?: string;
}

/**
 * Lab Request Form Component
 * Allows users to create new laboratory test requests
 */
export const LabRequestForm: React.FC<LabRequestFormProps> = ({
  onSuccess,
  onCancel,
  patientId,
  patientName,
}) => {
  const viewModel = useLabRequestFormViewModel();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<LabRequestFormData>({
    resolver: zodResolver(z.object({
      patient_id: z.string().min(1, 'Patient ID is required'),
      patient_name: z.string().min(1, 'Patient name is required'),
      age_gender: z.string().min(1, 'Age and gender is required'),
      request_date: z.string().min(1, 'Request date is required'),
      others: z.string().optional(),
      selectedTests: z.record(z.string(), z.boolean().optional()).refine((tests) => {
        return Object.values(tests).some(value => value === true);
      }, 'At least one test must be selected'),
    })),
    defaultValues: {
      patient_id: patientId || '',
      patient_name: patientName || '',
      age_gender: '',
      request_date: new Date().toISOString().split('T')[0],
      others: '',
      selectedTests: {},
    },
  });

  const selectedTests = watch('selectedTests');
  const testCategories = getTestsByCategory();

  const onSubmit = handleSubmit(async (data) => {
    const success = await viewModel.handleFormSubmit(data as any);
    if (success) {
      reset();
      onSuccess?.();
    }
  });

  const handleTestChange = (testKey: keyof LabRequestFormData['selectedTests'], checked: boolean) => {
    setValue(`selectedTests.${testKey}`, checked);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    Object.entries(selectedTests || {}).forEach(([testKey, isSelected]) => {
      if (isSelected) {
        const testItem = LAB_TEST_ITEMS.find(item => 
          item.id === testKey || 
          item.id === testKey.replace(/_/g, '') ||
          item.name.toLowerCase().replace(/\s/g, '_') === testKey
        );
        if (testItem) {
          total += testItem.price;
        }
      }
    });
    return total;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add Laboratory Test Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Error Alert */}
          {viewModel.submitError && (
            <Alert variant="destructive">
              <AlertDescription>
                {viewModel.submitError}
              </AlertDescription>
            </Alert>
          )}

          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormTextInput
              {...register('patient_id')}
              label="Patient ID"
              placeholder="Enter patient ID"
              error={errors.patient_id}
              required
            />
            <FormTextInput
              {...register('patient_name')}
              label="Patient Name"
              placeholder="Enter patient name"
              error={errors.patient_name}
              required
            />
            <FormTextInput
              {...register('age_gender')}
              label="Age & Gender"
              placeholder="e.g., 25/M or 30/F"
              error={errors.age_gender}
              required
            />
            <FormTextInput
              {...register('request_date')}
              label="Request Date"
              type="date"
              error={errors.request_date}
              required
            />
          </div>

          <FormTextInput
            {...register('others')}
            label="Other Notes"
            placeholder="Additional notes or instructions"
            error={errors.others}
          />

          <Separator />

          {/* Laboratory Tests */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Select Laboratory Tests</h3>
            
            {testCategories.map((category) => (
              <div key={category.key} className="space-y-3">
                <h4 className="text-md font-medium text-gray-700 border-b pb-2">
                  {category.label}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.tests.map((test) => {
                    const isChecked = selectedTests?.[test.fieldName] || false;
                    return (
                      <div key={test.key} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                        <Checkbox
                          id={test.key}
                          checked={isChecked}
                          onCheckedChange={(checked) => 
                            handleTestChange(test.fieldName, checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={test.key} 
                          className="flex-1 text-sm font-medium leading-none cursor-pointer"
                        >
                          <div>{test.label}</div>
                          {test.price && (
                            <div className="text-xs text-gray-500">₱{test.price}</div>
                          )}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Total Price */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span className="text-lg font-semibold">Total Estimated Cost:</span>
            <span className="text-xl font-bold text-blue-600">₱{calculateTotalPrice()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={viewModel.isSubmitting}>
              {viewModel.isSubmitting ? 'Creating Request...' : 'Create Lab Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
