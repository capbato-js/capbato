import React from 'react';
import { LoginPageLayout } from '../components/LoginPageLayout';
import { ClinicLogo } from '../components/ClinicLogo';
import { LoginFormCardContainer } from '../components/LoginFormCardContainer';
import type { LOGIN_PAGE_CONFIG } from '../config/loginPageConfig';

interface LoginPagePresenterProps {
  config: typeof LOGIN_PAGE_CONFIG;
}

export const LoginPagePresenter: React.FC<LoginPagePresenterProps> = ({ config }) => {
  return (
    <LoginPageLayout>
      <ClinicLogo 
        clinicName={config.clinic.name}
        logoSrc={config.clinic.logoSrc}
      />
      <LoginFormCardContainer />
    </LoginPageLayout>
  );
};