import React from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { useLabRequestListViewModel } from '../view-models/useLabRequestListViewModel';
import { LabRequestDto } from '@nx-starter/application-shared';

interface LabRequestListProps {
  onCreateNew?: () => void;
  onViewDetails?: (labRequest: LabRequestDto) => void;
  onUpdateResults?: (labRequest: LabRequestDto) => void;
  showCompleted?: boolean;
}

/**
 * Lab Request List Component
 * Displays list of laboratory test requests
 */
export const LabRequestList: React.FC<LabRequestListProps> = ({
  onCreateNew,
  onViewDetails,
  onUpdateResults,
  showCompleted = false,
}) => {
  const viewModel = useLabRequestListViewModel();

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
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTests = (tests: string[]) => {
    if (tests.length === 0) return 'No tests selected';
    if (tests.length <= 3) return tests.join(', ');
    return `${tests.slice(0, 3).join(', ')} and ${tests.length - 3} more`;
  };

  if (viewModel.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lab requests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Laboratory Requests</h2>
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            Add New Lab Request
          </Button>
        )}
      </div>

      {/* Error Alert */}
      {viewModel.loadError && (
        <Alert variant="destructive">
          <AlertDescription>
            {viewModel.loadError}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={viewModel.clearError}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={viewModel.loadLabRequests}
          disabled={viewModel.isLoading}
        >
          All Requests
        </Button>
        <Button 
          variant="outline" 
          onClick={viewModel.loadCompletedLabRequests}
          disabled={viewModel.isLoading}
        >
          Completed Only
        </Button>
        <Button 
          variant="outline" 
          onClick={viewModel.refreshData}
          disabled={viewModel.isLoading}
        >
          Refresh
        </Button>
      </div>

      {/* Lab Requests List */}
      {viewModel.labRequests.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <p className="text-gray-600 mb-4">No lab requests found</p>
            {onCreateNew && (
              <Button onClick={onCreateNew}>
                Create Your First Lab Request
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {viewModel.labRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {request.patient.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      ID: {request.patient.id} • {request.patient.ageGender}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(request.status)}>
                    {request.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Request Date</p>
                    <p className="text-sm">{formatDate(request.requestDate)}</p>
                  </div>
                  {request.dateTaken && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date Taken</p>
                      <p className="text-sm">{formatDate(request.dateTaken)}</p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Selected Tests</p>
                    <p className="text-sm text-gray-600">
                      {formatTests(request.selectedTests)}
                    </p>
                  </div>
                  {request.others && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                      <p className="text-sm text-gray-600">{request.others}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Created: {formatDate(request.createdAt)}
                  </p>
                  <div className="flex space-x-2">
                    {onViewDetails && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewDetails(request)}
                      >
                        View Details
                      </Button>
                    )}
                    {onUpdateResults && request.status === 'pending' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => onUpdateResults(request)}
                      >
                        Update Results
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
