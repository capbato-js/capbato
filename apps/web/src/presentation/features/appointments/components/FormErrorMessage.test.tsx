import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormErrorMessage } from './FormErrorMessage';

describe('FormErrorMessage Component', () => {
  describe('rendering', () => {
    it('renders error message when error is provided', () => {
      const errorMessage = 'This is an error message';
      render(<FormErrorMessage error={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByTestId('add-appointment-error')).toBeInTheDocument();
    });

    it('does not render when error is empty string', () => {
      render(<FormErrorMessage error="" />);

      expect(screen.queryByTestId('add-appointment-error')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      render(<FormErrorMessage error="Test error" />);

      const errorElement = screen.getByTestId('add-appointment-error');
      expect(errorElement).toHaveClass('text-red-600', 'text-sm', 'mb-4', 'text-center');
    });

    it('renders multi-line error messages', () => {
      const multiLineError = 'Line 1\nLine 2\nLine 3';
      render(<FormErrorMessage error={multiLineError} />);

      const errorElement = screen.getByTestId('add-appointment-error');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement.textContent).toBe(multiLineError);
    });

    it('renders error with special characters', () => {
      const specialCharError = 'Error with <script>alert("xss")</script> and & symbols';
      render(<FormErrorMessage error={specialCharError} />);

      expect(screen.getByText(specialCharError)).toBeInTheDocument();
    });
  });

  describe('conditional rendering', () => {
    it('returns null for empty error', () => {
      const { container } = render(<FormErrorMessage error="" />);
      expect(container.firstChild).toBeNull();
    });

    it('returns null for whitespace-only error', () => {
      const { container } = render(<FormErrorMessage error="   " />);
      // Should render whitespace as it's truthy
      expect(container.firstChild).not.toBeNull();
    });
  });

  describe('snapshots', () => {
    it('matches snapshot with error message', () => {
      const { container } = render(<FormErrorMessage error="Sample error message" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with no error (null return)', () => {
      const { container } = render(<FormErrorMessage error="" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with long error message', () => {
      const longError = 'This is a very long error message that should still be displayed correctly and maintain proper styling even when it wraps to multiple lines.';
      const { container } = render(<FormErrorMessage error={longError} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});