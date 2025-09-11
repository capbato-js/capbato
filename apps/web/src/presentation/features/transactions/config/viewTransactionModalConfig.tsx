import React from 'react';
import { Icon } from '../../../components/common';

export const VIEW_TRANSACTION_MODAL_CONFIG = {
  title: 'Transaction Details',
  size: 'lg' as const
} as const;

export const SECTION_CONFIG = {
  header: {
    backgroundColor: '#f8f9fa'
  },
  spacing: {
    gap: 'lg' as const,
    sectionGap: 'md' as const
  }
} as const;

export const BADGE_CONFIG = {
  paymentMethod: {
    variant: 'light' as const,
    color: 'green' as const
  },
  patientNumber: {
    variant: 'light' as const,
    color: 'blue' as const
  },
  quantity: {
    variant: 'light' as const
  },
  paymentMethodLarge: {
    variant: 'light' as const,
    color: 'green' as const,
    size: 'lg' as const
  }
} as const;

export const TABLE_CONFIG = {
  striped: true,
  highlightOnHover: true,
  columns: {
    service: 'Service/Item',
    description: 'Description',
    quantity: 'Qty',
    unitPrice: 'Unit Price',
    subtotal: 'Subtotal'
  }
} as const;

export const ICONS = {
  receipt: <Icon icon="fas fa-receipt" />,
  user: <Icon icon="fas fa-user" />,
  calendar: <Icon icon="fas fa-calendar" />,
  userCircle: <Icon icon="fas fa-user-circle" />,
  list: <Icon icon="fas fa-list" />,
  moneyBill: <Icon icon="fas fa-money-bill-wave" />
} as const;

export const MESSAGES = {
  noItems: 'No items found for this transaction'
} as const;