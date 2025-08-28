import { render } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should show loading indicator while checking authentication', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('page-loading-indicator')).toBeInTheDocument();
  });
});
