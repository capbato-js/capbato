import { ReactNode } from 'react';
import { ScrollAreaProps } from '@mantine/core';

export interface ActionButton<T> {
  icon: string;
  tooltip: string;
  onClick: (record: T) => void;
  color?: string;
  hidden?: (record: T) => boolean;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T) => ReactNode;
  searchable?: boolean;
}

export interface TableActions<T> {
  buttons: ActionButton<T>[];
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableActions<T>;
  onRowClick?: (record: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  isLoading?: boolean;
  emptyStateMessage?: string;
  skeletonRowCount?: number;
  cursor?: 'default' | 'pointer';
  maxHeight?: string | number;
  scrollAreaProps?: Omit<ScrollAreaProps, 'children'>;
  useViewportHeight?: boolean;
  bottomPadding?: number;
  testId?: string;
  searchInputTestId?: string;
}

export interface SearchableItem {
  [key: string]: any;
}
