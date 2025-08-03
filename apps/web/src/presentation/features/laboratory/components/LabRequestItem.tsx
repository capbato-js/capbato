import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { useLabRequestItemViewModel } from '../view-models/useLabRequestItemViewModel';
import { LabRequestDto } from '@nx-starter/application-shared';

interface LabRequestItemProps {
  labRequest: LabRequestDto;
  onUpdateSuccess?: () => void;
  onCancel?: () => void;
  allowEdit?: boolean;
}

/**
 * Lab Request Item Component
 * Displays detailed lab request information with editing capabilities
 */
export const LabRequestItem: React.FC<LabRequestItemProps> = ({
  labRequest,
  onUpdateSuccess,
  onCancel,
  allowEdit = false,
}) => {
  const viewModel = useLabRequestItemViewModel();
  const [isEditing, setIsEditing] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'complete':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    // Initialize results with existing data if any
    const initialResults: Record<string, string> = {};
    labRequest.selectedTests.forEach(test => {
      initialResults[test] = ''; // Initialize with empty or existing values
    });
    setResults(initialResults);
  };

  const handleSaveResults = async () => {
    const success = await viewModel.updateResults(
      labRequest.patient.id,
      labRequest.requestDate,
      results
    );
    
    if (success) {
      setIsEditing(false);
      onUpdateSuccess?.();
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setResults({});
  };

  const handleResultChange = (testName: string, value: string) => {
    setResults(prev => ({
      ...prev,
      [testName]: value,
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Laboratory Test Request Details</CardTitle>
          <Badge variant={getStatusBadgeVariant(labRequest.status)}>
            {labRequest.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Error Alert */}
        {viewModel.updateError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {viewModel.updateError}
              <Button 
                variant="link" 
                className="ml-2 p-0 h-auto" 
                onClick={viewModel.clearError}
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Patient Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Patient Name</p>
                <p className="text-sm">{labRequest.patient.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Patient ID</p>
                <p className="text-sm">{labRequest.patient.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Age & Gender</p>
                <p className="text-sm">{labRequest.patient.ageGender}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Request Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Request Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Request Date</p>
                <p className="text-sm">{formatDate(labRequest.requestDate)}</p>
              </div>
              {labRequest.dateTaken && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Date Taken</p>
                  <p className="text-sm">{formatDate(labRequest.dateTaken)}</p>
                </div>
              )}
              {labRequest.others && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-700">Additional Notes</p>
                  <p className="text-sm">{labRequest.others}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Selected Tests */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Selected Laboratory Tests</h3>
            <div className="space-y-3">
              {labRequest.selectedTests.map((test, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">{test}</span>
                  {isEditing ? (
                    <FormTextInput
                      placeholder="Enter result"
                      value={results[test] || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleResultChange(test, e.target.value)}
                      className="w-48"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">
                      {results[test] || 'Pending'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Close
              </Button>
            )}
            
            {allowEdit && labRequest.status === 'pending' && (
              <>
                {!isEditing ? (
                  <Button onClick={handleEditClick}>
                    Update Results
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      disabled={viewModel.isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveResults}
                      disabled={viewModel.isUpdating}
                    >
                      {viewModel.isUpdating ? 'Saving...' : 'Save Results'}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
