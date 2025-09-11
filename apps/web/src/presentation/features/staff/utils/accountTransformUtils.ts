import type { Account, UpdateAccountData } from '../view-models/useEnhancedAccountsViewModel';
import { UpdateUserDetailsCommand } from '@nx-starter/application-shared';

export const transformAccountsWithFullName = (accounts: Account[]) => {
  return accounts.map(account => ({
    ...account,
    name: `${account.firstName} ${account.lastName}`
  }));
};

export const transformUpdateCommand = (data: UpdateUserDetailsCommand): UpdateAccountData => {
  return {
    id: data.id,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    role: data.role || '',
    mobile: data.mobile,
    specialization: data.specialization,
    licenseNumber: data.licenseNumber,
    experienceYears: data.experienceYears,
    schedulePattern: data.schedulePattern,
  };
};