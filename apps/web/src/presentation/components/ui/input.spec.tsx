import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './input';
import { MantineProvider } from '@mantine/core';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>
    {children}
  </MantineProvider>
);

describe('Input Component', () => {
  it('should render input with data-testid', () => {
    render(
      <TestWrapper>
        <Input data-testid="test-input" placeholder="Enter text" />
      </TestWrapper>
    );

    const input = screen.getByTestId('test-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  it('should render input with different types', () => {
    render(
      <TestWrapper>
        <Input data-testid="email-input" type="email" placeholder="Enter email" />
      </TestWrapper>
    );

    const input = screen.getByTestId('email-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should handle disabled state', () => {
    render(
      <TestWrapper>
        <Input data-testid="disabled-input" disabled />
      </TestWrapper>
    );

    const input = screen.getByTestId('disabled-input');
    expect(input).toBeDisabled();
  });
});