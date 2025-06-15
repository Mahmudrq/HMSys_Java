export interface Appointment {
  id?: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string; // ISO format string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
  notes: string;
}
