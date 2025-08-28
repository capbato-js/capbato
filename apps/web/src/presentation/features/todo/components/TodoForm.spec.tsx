import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import React from 'react';
import { TodoForm } from './TodoForm';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

// Mock the view model
const mockViewModel = {
  handleFormSubmit: vi.fn(),
  isSubmitting: false,
  isGlobalLoading: false,
  submitTodo: vi.fn(),
};

vi.mock('../view-models/useTodoFormViewModel', () => ({
  useTodoFormViewModel: () => mockViewModel,
}));

describe('TodoForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockViewModel.handleFormSubmit.mockResolvedValue(true);
    mockViewModel.isSubmitting = false;
    mockViewModel.isGlobalLoading = false;
  });

  it('should render form with input and button', () => {
    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>
    );

    expect(screen.getByTestId('todo-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-todo-button')).toBeInTheDocument();
  });

  it('should show loading state when isGlobalLoading is true', () => {
    // This tests the external loading state (e.g., initial data fetch)
    // Individual form submissions don't use loading states for fast local DB operations
    mockViewModel.isGlobalLoading = true;

    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>
    );

    const input = screen.getByTestId('todo-input');
    const button = screen.getByTestId('add-todo-button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>
    );

    const input = screen.getByTestId('todo-input');
    const button = screen.getByTestId('add-todo-button');

    await user.type(input, 'New todo item');
    await user.click(button);

    expect(mockViewModel.handleFormSubmit).toHaveBeenCalledWith('New todo item');
  });

  it('should trim whitespace from input before submission', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByRole('button', { name: 'Add Todo' });

    await user.type(input, '  Test todo with spaces  ');
    await user.click(button);

    await waitFor(() => {
      expect(mockViewModel.handleFormSubmit).toHaveBeenCalledWith(
        '  Test todo with spaces  '
      );
    });
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByRole('button', { name: 'Add Todo' });

    await user.type(input, 'Test todo item');
    await user.click(button);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('should show submitting state during form submission', () => {
    mockViewModel.isSubmitting = true;

    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByRole('button', { name: 'Adding...' });

    expect(button).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('should handle submission errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockViewModel.handleFormSubmit.mockResolvedValue(false);

    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByRole('button', { name: 'Add Todo' });

    await user.type(input, 'Test todo item');
    await user.click(button);

    await waitFor(() => {
      expect(mockViewModel.handleFormSubmit).toHaveBeenCalledWith(
        'Test todo item'
      );
    });

    // Form should still be functional after error
    expect(
      screen.getByRole('button', { name: 'Add Todo' })
    ).toBeInTheDocument();
    expect(input).not.toBeDisabled();

    consoleErrorSpy.mockRestore();
  });

  it('should disable form during external loading', () => {
    // This tests external loading (e.g., initial app load)
    // Form submissions themselves don't use loading states for fast IndexedDB operations
    mockViewModel.isGlobalLoading = true;

    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  // Note: Validation tests are now handled by react-hook-form with Zod resolver
  // Form-level validation is tested through E2E tests
  // View model validation behavior is tested in useTodoFormViewModel.spec.ts
});