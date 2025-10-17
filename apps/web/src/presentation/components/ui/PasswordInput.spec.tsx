import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('should render password input with hidden password by default', () => {
    renderWithProviders(
      <PasswordInput
        label="Password"
        placeholder="Enter password"
        data-testid="password-input"
      />
    );

    const input = screen.getByTestId('password-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
  });

  it('should toggle password visibility when eye icon is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PasswordInput
        label="Password"
        placeholder="Enter password"
        data-testid="password-input"
      />
    );

    const input = screen.getByTestId('password-input');
    const toggleButton = screen.getByLabelText('Show password');

    // Initially password should be hidden
    expect(input).toHaveAttribute('type', 'password');

    // Click to show password
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();

    // Click to hide password again
    await user.click(screen.getByLabelText('Hide password'));
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
  });

  it('should start with visible password when defaultVisible is true', () => {
    renderWithProviders(
      <PasswordInput
        label="Password"
        placeholder="Enter password"
        defaultVisible={true}
        data-testid="password-input"
      />
    );

    const input = screen.getByTestId('password-input');
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });

  it('should display error message when error is provided', () => {
    const errorMessage = 'Password is required';
    renderWithProviders(
      <PasswordInput
        label="Password"
        placeholder="Enter password"
        error={errorMessage}
        data-testid="password-input"
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should handle FieldError object', () => {
    const fieldError = { message: 'Password must be at least 8 characters', type: 'required' };
    renderWithProviders(
      <PasswordInput
        label="Password"
        placeholder="Enter password"
        error={fieldError}
        data-testid="password-input"
      />
    );

    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('should use empty placeholder when there is an error', () => {
    renderWithProviders(
      <PasswordInput
        label="Password"
        placeholder="Enter password"
        error="Password is required"
        data-testid="password-input"
      />
    );

    const input = screen.getByTestId('password-input');
    expect(input).toHaveAttribute('placeholder', '');
  });

  it('should call onChange handler when input value changes', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    renderWithProviders(
      <PasswordInput
        label="Password"
        placeholder="Enter password"
        onChange={mockOnChange}
        data-testid="password-input"
      />
    );

    const input = screen.getByTestId('password-input');
    await user.type(input, 'test123');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    renderWithProviders(
      <PasswordInput
        label="Password"
        placeholder="Enter password"
        disabled={true}
        data-testid="password-input"
      />
    );

    const input = screen.getByTestId('password-input');
    expect(input).toBeDisabled();
  });

  it('should show correct icons for hide/show states', () => {
    renderWithProviders(
      <PasswordInput
        label="Password"
        placeholder="Enter password"
        data-testid="password-input"
      />
    );

    // Initially should show "eye" icon (to show password)
    expect(screen.getByTestId('password-input').parentElement?.querySelector('.fas.fa-eye')).toBeInTheDocument();
    expect(screen.getByTestId('password-input').parentElement?.querySelector('.fas.fa-eye-slash')).not.toBeInTheDocument();
  });
});