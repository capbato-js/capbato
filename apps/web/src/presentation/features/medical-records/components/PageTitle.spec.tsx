import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../test/test-utils';
import { PageTitle } from './PageTitle';

describe('PageTitle', () => {
  it('should render title text', () => {
    const title = 'Medical Records';
    render(<PageTitle title={title} />);
    
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('should render as heading with correct level', () => {
    const title = 'Test Title';
    render(<PageTitle title={title} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(title);
  });

  it('should have correct styling attributes', () => {
    const title = 'Styled Title';
    render(<PageTitle title={title} />);
    
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    // Verify the component has styling applied (Mantine styles are applied via CSS classes)
    expect(heading).toHaveAttribute('style');
  });

  it('should handle empty title', () => {
    render(<PageTitle title="" />);
    
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('');
  });

  it('should handle long titles', () => {
    const longTitle = 'This is a very long title that should still be displayed correctly';
    render(<PageTitle title={longTitle} />);
    
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('should handle special characters in title', () => {
    const specialTitle = 'Medical Records & Prescriptions - Patient Data #123';
    render(<PageTitle title={specialTitle} />);
    
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });

  it('should be accessible', () => {
    const title = 'Accessible Title';
    render(<PageTitle title={title} />);
    
    const heading = screen.getByRole('heading', { name: title });
    expect(heading).toBeInTheDocument();
  });
});