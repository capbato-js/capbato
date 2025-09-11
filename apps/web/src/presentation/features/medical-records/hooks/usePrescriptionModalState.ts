import { useState } from 'react';
import { Prescription } from '../types';

export const usePrescriptionModalState = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const openAddModal = () => {
    setSelectedPrescription(null);
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const openEditModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedPrescription(null);
  };

  const openViewModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedPrescription(null);
  };

  const openDeleteModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedPrescription(null);
  };

  return {
    // State
    addModalOpen,
    editModalOpen,
    viewModalOpen,
    deleteModalOpen,
    selectedPrescription,
    
    // Actions
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openViewModal,
    closeViewModal,
    openDeleteModal,
    closeDeleteModal,
  };
};