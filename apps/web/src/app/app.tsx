import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodoPage } from '../presentation/features/todo';
import { AboutPage } from '../presentation/features/about';
import { LoginPage } from '../presentation/features/login';
import { DashboardPage } from '../presentation/features/dashboard';
import { AppointmentsPage } from '../presentation/features/appointments';
import { PatientsPage, AddPatientPage, EditPatientPage } from '../presentation/features/patients';
import { PatientDetailsPage } from '../presentation/features/patients/pages/PatientDetailsPage';
import { LaboratoryPage, LaboratoryTestsPage, PrescriptionsPage, AddLabTestPage, AddLabTestResultPage, EditLabTestResultPage, ViewLabTestResultPage } from '../presentation/features/medical-records';
import { TransactionsPage } from '../presentation/features/transactions';
import { DoctorsPage, AccountsPage } from '../presentation/features/staff';
import { AuthGuard, RoleGuard } from '../presentation/features/auth';
import { useAuthStore } from '../infrastructure/state/AuthStore';
import '../styles.css';

function App() {
  const { checkAuthState } = useAuthStore();

  // Initialize authentication state on app startup
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Medical Clinic Protected Routes */}
        <Route path="/" element={
          <AuthGuard requireAuth={true}>
            <DashboardPage />
          </AuthGuard>
        } />
        <Route path="/dashboard" element={
          <AuthGuard requireAuth={true}>
            <DashboardPage />
          </AuthGuard>
        } />
        <Route path="/appointments" element={
          <AuthGuard requireAuth={true}>
            <AppointmentsPage />
          </AuthGuard>
        } />
        <Route path="/patients" element={
          <AuthGuard requireAuth={true}>
            <PatientsPage />
          </AuthGuard>
        } />
        <Route path="/patients/new" element={
          <AuthGuard requireAuth={true}>
            <AddPatientPage />
          </AuthGuard>
        } />
        <Route path="/patients/:id/edit" element={
          <AuthGuard requireAuth={true}>
            <EditPatientPage />
          </AuthGuard>
        } />
        <Route path="/patients/:id" element={
          <AuthGuard requireAuth={true}>
            <PatientDetailsPage />
          </AuthGuard>
        } />
        <Route path="/laboratory" element={
          <AuthGuard requireAuth={true}>
            <LaboratoryPage />
          </AuthGuard>
        } />
        <Route path="/laboratory/new" element={
          <AuthGuard requireAuth={true}>
            <AddLabTestPage />
          </AuthGuard>
        } />
        <Route path="/laboratory/tests/:patientId" element={
          <AuthGuard requireAuth={true}>
            <LaboratoryTestsPage />
          </AuthGuard>
        } />
        <Route path="/laboratory/tests/:patientId/add-result/:testId" element={
          <AuthGuard requireAuth={true}>
            <AddLabTestResultPage />
          </AuthGuard>
        } />
        <Route path="/laboratory/tests/:patientId/edit-result/:testId" element={
          <AuthGuard requireAuth={true}>
            <EditLabTestResultPage />
          </AuthGuard>
        } />
        <Route path="/laboratory/tests/:patientId/view-result/:testId" element={
          <AuthGuard requireAuth={true}>
            <ViewLabTestResultPage />
          </AuthGuard>
        } />
        <Route path="/prescriptions" element={
          <AuthGuard requireAuth={true}>
            <PrescriptionsPage />
          </AuthGuard>
        } />
        <Route path="/transactions" element={
          <AuthGuard requireAuth={true}>
            <RoleGuard requiredRoute="/transactions">
              <TransactionsPage />
            </RoleGuard>
          </AuthGuard>
        } />
        <Route path="/doctors" element={
          <AuthGuard requireAuth={true}>
            <DoctorsPage />
          </AuthGuard>
        } />
        <Route path="/accounts" element={
          <AuthGuard requireAuth={true}>
            <RoleGuard requiredRoute="/accounts">
              <AccountsPage />
            </RoleGuard>
          </AuthGuard>
        } />

        {/* Legacy Todo/About routes */}
        <Route path="/todo" element={
          <AuthGuard requireAuth={true}>
            <TodoPage />
          </AuthGuard>
        } />
        <Route path="/about" element={
          <AuthGuard requireAuth={true}>
            <AboutPage />
          </AuthGuard>
        } />
        
        {/* Public routes - redirect authenticated users away */}
        <Route path="/login" element={
          <AuthGuard requireAuth={false}>
            <LoginPage />
          </AuthGuard>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
