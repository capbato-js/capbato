import { ReactNode } from 'react';
import { ModalProps as MantineModalProps } from '@mantine/core';

export interface CustomModalProps {
  /** Controls modal visibility */
  opened: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string | null;
  /** Modal content */
  children: ReactNode;
  /** Modal size */
  size?: MantineModalProps['size'];
  /** Show/hide close button */
  withCloseButton?: boolean;
  /** Center modal */
  centered?: boolean;
  /** Custom style overrides */
  customStyles?: {
    content?: React.CSSProperties;
    header?: React.CSSProperties;
    body?: React.CSSProperties;
    close?: React.CSSProperties;
    title?: React.CSSProperties;
  };
  /** Additional class name for the modal */
  className?: string;
}
