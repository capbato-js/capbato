import { ReactNode } from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T) => ReactNode;
  searchable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  isLoading?: boolean;
  emptyStateMessage?: string;
}

export interface SearchableItem {
  [key: string]: any;
}
