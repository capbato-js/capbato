import { useState, useCallback } from 'react';
import { Transaction } from '../types';

/**
 * Transaction view model hook
 * Handles transaction data management and operations
 * Currently uses dummy data as specified in requirements
 */
export const useTransactionViewModel = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dummy data as specified in the requirements
  const dummyTransactions: Transaction[] = [
    {
      id: 1,
      receiptNumber: "R-2025-001",
      date: "2025-08-11",
      patient: {
        id: "d7b20ad40f44478db25fe3ac78a1dd16",
        patientNumber: "2025-D2",
        firstName: "Juan",
        lastName: "Dela Cruz",
        middleName: "Santos",
        fullName: "Juan Santos Dela Cruz"
      },
      totalAmount: 1500.0,
      paymentMethod: "Cash",
      receivedBy: "Dr. Alice Smith",
      items: [
        {
          serviceName: "Consultation",
          description: "General checkup",
          quantity: 1,
          unitPrice: 800.0,
          subtotal: 800.0
        },
        {
          serviceName: "Lab Tests",
          description: "Blood work",
          quantity: 2,
          unitPrice: 350.0,
          subtotal: 700.0
        }
      ],
      itemsSummary: "Consultation, Lab Tests",
      createdAt: "2025-08-11T10:30:00Z",
      updatedAt: "2025-08-11T10:30:00Z"
    },
    {
      id: 2,
      receiptNumber: "R-2025-002",
      date: "2025-08-10",
      patient: {
        id: "e8c30bd50f55589ec36ff4bd78b2ee27",
        patientNumber: "2025-D3",
        firstName: "Maria",
        lastName: "Garcia",
        middleName: "Elena",
        fullName: "Maria Elena Garcia"
      },
      totalAmount: 2200.0,
      paymentMethod: "Credit Card",
      receivedBy: "Dr. Bob Johnson",
      items: [
        {
          serviceName: "Consultation",
          description: "Follow-up visit",
          quantity: 1,
          unitPrice: 800.0,
          subtotal: 800.0
        },
        {
          serviceName: "X-Ray",
          description: "Chest X-Ray",
          quantity: 1,
          unitPrice: 1400.0,
          subtotal: 1400.0
        }
      ],
      itemsSummary: "Consultation, X-Ray",
      createdAt: "2025-08-10T14:15:00Z",
      updatedAt: "2025-08-10T14:15:00Z"
    },
    {
      id: 3,
      receiptNumber: "R-2025-003",
      date: "2025-08-09",
      patient: {
        id: "f9d41ce61f66690fd47gg5ce89c3ff38",
        patientNumber: "2025-D1",
        firstName: "Pedro",
        lastName: "Santos",
        middleName: "Miguel",
        fullName: "Pedro Miguel Santos"
      },
      totalAmount: 950.0,
      paymentMethod: "Cash",
      receivedBy: "Dr. Alice Smith",
      items: [
        {
          serviceName: "Vaccination",
          description: "COVID-19 booster",
          quantity: 1,
          unitPrice: 500.0,
          subtotal: 500.0
        },
        {
          serviceName: "Consultation",
          description: "Pre-vaccination consultation",
          quantity: 1,
          unitPrice: 450.0,
          subtotal: 450.0
        }
      ],
      itemsSummary: "Vaccination, Consultation",
      createdAt: "2025-08-09T09:45:00Z",
      updatedAt: "2025-08-09T09:45:00Z"
    }
  ];

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setTransactions(dummyTransactions);
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Error loading transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    transactions,
    isLoading,
    error,
    loadTransactions,
    clearError,
  };
};