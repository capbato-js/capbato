import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { ReadOnlyField } from './ReadOnlyField';

// Mock the Icon component
vi.mock('../../../components/common', () => ({
  Icon: ({ icon, size, style }: { icon: string; size: number; style: object }) => (
    <div data-testid="icon" data-icon={icon} style={style}>
      {icon}
    </div>
  ),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('ReadOnlyField Component', () => {
  const defaultProps = {
    label: 'Test Label',
    value: 'Test Value',
    icon: 'fas fa-user',
  };

  describe('basic rendering', () => {
    it('renders label and value correctly', () => {
      render(
        <TestWrapper>
          <ReadOnlyField {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByText('Test Value')).toBeInTheDocument();
    });

    it('renders icon with correct props', () => {
      render(
        <TestWrapper>
          <ReadOnlyField {...defaultProps} />
        </TestWrapper>
      );

      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-icon', 'fas fa-user');
    });

    it('renders without helper text by default', () => {
      render(
        <TestWrapper>
          <ReadOnlyField {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.queryByText(/helper/i)).not.toBeInTheDocument();
    });

    it('does not show required asterisk by default', () => {
      render(
        <TestWrapper>
          <ReadOnlyField {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('optional props', () => {
    it('renders helper text when provided', () => {
      render(
        <TestWrapper>
          <ReadOnlyField {...defaultProps} helperText="This is helper text" />
        </TestWrapper>
      );

      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('shows required asterisk when required is true', () => {
      render(
        <TestWrapper>
          <ReadOnlyField {...defaultProps} required={true} />
        </TestWrapper>
      );

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders with all optional props', () => {
      render(
        <TestWrapper>
          <ReadOnlyField
            {...defaultProps}
            helperText="Complete helper text"
            required={true}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('Test Value')).toBeInTheDocument();
      expect(screen.getByText('Complete helper text')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('renders with empty value', () => {
      render(
        <TestWrapper>
          <ReadOnlyField {...defaultProps} value="" />
        </TestWrapper>
      );

      expect(screen.getByText('Test Label')).toBeInTheDocument();
      // The icon should still be rendered even with empty value
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders with long value', () => {
      const longValue = 'This is a very long value that might wrap to multiple lines or overflow the container';
      render(
        <TestWrapper>
          <ReadOnlyField {...defaultProps} value={longValue} />
        </TestWrapper>
      );

      expect(screen.getByText(longValue)).toBeInTheDocument();
    });

    it('renders with special characters in value', () => {
      const specialValue = 'Value with <script>alert("xss")</script> & special chars';
      render(
        <TestWrapper>
          <ReadOnlyField {...defaultProps} value={specialValue} />
        </TestWrapper>
      );

      expect(screen.getByText(specialValue)).toBeInTheDocument();
    });

    it('renders with different icon types', () => {
      render(
        <TestWrapper>
          <ReadOnlyField {...defaultProps} icon="fas fa-calendar" />
        </TestWrapper>
      );

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon', 'fas fa-calendar');
    });
  });

  describe('styling', () => {
    it('applies correct styling to the value container', () => {
      render(
        <TestWrapper>
          <ReadOnlyField {...defaultProps} />
        </TestWrapper>
      );

      const valueContainer = screen.getByText('Test Value').parentElement;
      expect(valueContainer).toHaveStyle({
        padding: '10px 12px',
        border: '1px solid #e9ecef',
        borderRadius: '6px',
        backgroundColor: '#f8f9fa',
        minHeight: '36px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      });
    });
  });

  describe('snapshots', () => {
    it('matches snapshot with basic props', () => {
      const { container } = render(
        <TestWrapper>
          <ReadOnlyField {...defaultProps} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with all props', () => {
      const { container } = render(
        <TestWrapper>
          <ReadOnlyField
            {...defaultProps}
            helperText="Helper text"
            required={true}
          />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with long content', () => {
      const { container } = render(
        <TestWrapper>
          <ReadOnlyField
            {...defaultProps}
            label="Very Long Label That Might Wrap"
            value="Very long value that contains a lot of text and might wrap to multiple lines"
            helperText="This is also a very long helper text that provides detailed information"
          />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});