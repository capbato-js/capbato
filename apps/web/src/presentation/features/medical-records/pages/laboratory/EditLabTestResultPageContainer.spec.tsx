import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { EditLabTestResultPageContainer } from './EditLabTestResultPageContainer';

// Mock the view model hook
vi.mock('../../view-models/useEditLabTestResultViewModel', () => ({
  useEditLabTestResultViewModel: vi.fn(() => ({
    // Mock view model data
    formData: {},
    isLoading: false,
    errors: {},
    handleSubmit: vi.fn(),
    handleInputChange: vi.fn(),
  }))
}));

// Mock the presenter component
vi.mock('./EditLabTestResultPagePresenter', () => ({
  EditLabTestResultPagePresenter: ({ config, viewModel }: { config: unknown; viewModel: unknown }) => (
    <div data-testid="edit-lab-test-result-presenter">
      <div data-testid="config">{JSON.stringify(config)}</div>
      <div data-testid="view-model">{JSON.stringify(viewModel)}</div>
    </div>
  )
}));

// Mock the config
vi.mock('../../config/editLabTestResultPageConfig', () => ({
  EDIT_LAB_TEST_RESULT_PAGE_CONFIG: { title: 'Edit Lab Test Result' }
}));

describe('EditLabTestResultPageContainer', () => {
  it('should render EditLabTestResultPagePresenter with config and view model', () => {
    render(<EditLabTestResultPageContainer />);
    
    expect(screen.getByTestId('edit-lab-test-result-presenter')).toBeInTheDocument();
    expect(screen.getByTestId('config')).toBeInTheDocument();
    expect(screen.getByTestId('view-model')).toBeInTheDocument();
  });

  it('should pass the correct config to presenter', () => {
    render(<EditLabTestResultPageContainer />);
    
    const configElement = screen.getByTestId('config');
    expect(configElement.textContent).toContain('Edit Lab Test Result');
  });
});