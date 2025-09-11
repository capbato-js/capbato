import { AppointmentDto } from '@nx-starter/application-shared';
import { Appointment } from '../types';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const mapAppointmentDtoToAppointment = (dto: AppointmentDto): Appointment => ({
  id: dto.id,
  patientNumber: dto.patient?.patientNumber || 'Unknown',
  patientName: dto.patient?.fullName || 'Unknown Patient',
  reasonForVisit: dto.reasonForVisit,
  date: dto.appointmentDate,
  time: dto.appointmentTime,
  doctor: dto.doctor?.fullName || 'Unknown Doctor',
  status: dto.status === 'confirmed' ? 'confirmed' 
    : dto.status === 'cancelled' ? 'cancelled' 
    : dto.status === 'completed' ? 'completed' 
    : 'confirmed'
});

export const sortAppointments = (appointments: Appointment[], isShowingAll: boolean): Appointment[] => {
  return [...appointments].sort((a, b) => {
    const dateTimeA = new Date(`${a.date} ${a.time}`);
    const dateTimeB = new Date(`${b.date} ${b.time}`);
    
    if (isShowingAll) {
      return dateTimeB.getTime() - dateTimeA.getTime();
    } else {
      return dateTimeA.getTime() - dateTimeB.getTime();
    }
  });
};

export const getSelectedDateString = (date: Date): string => {
  return dayjs(date).tz('Asia/Manila').format('YYYY-MM-DD');
};