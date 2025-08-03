import React, { useState } from 'react';
import { LabRequestForm } from '../components/LabRequestForm';
import { LabRequestList } from '../components/LabRequestList';
import { LabRequestItem } from '../components/LabRequestItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { LabRequestDto } from '@nx-starter/application-shared';

/**
 * Laboratory Page Component
 * Main page for laboratory management features
 */
export const LaboratoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'completed' | 'form'>('requests');
  const [selectedLabRequest, setSelectedLabRequest] = useState<LabRequestDto | null>(null);

  const handleCreateNew = () => {
    setActiveTab('form');
  };

  const handleFormSuccess = () => {
    setActiveTab('requests');
    // Optionally refresh the list here
  };

  const handleFormCancel = () => {
    setActiveTab('requests');
  };

  const handleViewDetails = (labRequest: LabRequestDto) => {
    setSelectedLabRequest(labRequest);
  };

  const handleCloseDetails = () => {
    setSelectedLabRequest(null);
  };

  const handleUpdateResults = (labRequest: LabRequestDto) => {
    setSelectedLabRequest(labRequest);
  };

  const handleUpdateSuccess = () => {
    setSelectedLabRequest(null);
    // Optionally refresh the list here
  };

  // If viewing details, show the item component
  if (selectedLabRequest) {
    return (
      <div className="container mx-auto p-6">
        <LabRequestItem
          labRequest={selectedLabRequest}
          onCancel={handleCloseDetails}
          onUpdateSuccess={handleUpdateSuccess}
          allowEdit={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Laboratory Management</h1>
        <p className="text-gray-600">Manage laboratory test requests and results</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'requests' | 'completed' | 'form')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">Lab Requests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="form">Add New Request</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-6">
          <LabRequestList
            onCreateNew={handleCreateNew}
            onViewDetails={handleViewDetails}
            onUpdateResults={handleUpdateResults}
            showCompleted={false}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <LabRequestList
            onCreateNew={handleCreateNew}
            onViewDetails={handleViewDetails}
            showCompleted={true}
          />
        </TabsContent>

        <TabsContent value="form" className="mt-6">
          <LabRequestForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
