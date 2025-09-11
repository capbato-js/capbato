import React from 'react';
import { LoginPagePresenter } from './LoginPagePresenter';
import { LOGIN_PAGE_CONFIG } from '../config/loginPageConfig';

export const LoginPageContainer: React.FC = () => {
  return (
    <LoginPagePresenter 
      config={LOGIN_PAGE_CONFIG}
    />
  );
};