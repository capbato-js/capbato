import React from 'react';
import { AddLabTestFormContainer } from './AddLabTestFormContainer';

interface AddLabTestFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export const AddLabTestForm: React.FC<AddLabTestFormProps> = (props) => {
  return <AddLabTestFormContainer {...props} />;
};
