import React from 'react';
import { MedicalClinicLayout } from '../../../../components/layout';
import { LabTestPageHeader } from '../../components/LabTestPageHeader';
import { LabTestContentRenderer, LabTestContentProps } from '../../components/LabTestContentRenderer';

interface ViewLabTestResultPagePresenterProps extends LabTestContentProps {}

export const ViewLabTestResultPagePresenter: React.FC<ViewLabTestResultPagePresenterProps> = ({
  onBack,
  ...contentProps
}) => {
  return (
    <MedicalClinicLayout>
      <LabTestPageHeader onBack={onBack} />
      <LabTestContentRenderer onBack={onBack} {...contentProps} />
    </MedicalClinicLayout>
  );
};