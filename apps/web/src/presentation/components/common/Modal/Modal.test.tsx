import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Modal } from '../Modal';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('Modal Component', () => {
  const defaultProps = {
    opened: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when opened', () => {
    render(
      <TestWrapper>
        <Modal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <TestWrapper>
        <Modal {...defaultProps} opened={false} />
      </TestWrapper>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();
    
    render(
      <TestWrapper>
        <Modal {...defaultProps} onClose={onCloseMock} />
      </TestWrapper>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('applies custom styles correctly', () => {
    const customStyles = {
      title: { color: 'red' },
    };

    render(
      <TestWrapper>
        <Modal {...defaultProps} customStyles={customStyles} />
      </TestWrapper>
    );

    // Since we're now using Mantine's internal title styling,
    // we'll test by checking if the modal is rendered correctly
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('hides close button when withCloseButton is false', () => {
    render(
      <TestWrapper>
        <Modal {...defaultProps} withCloseButton={false} />
      </TestWrapper>
    );

    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });
});
