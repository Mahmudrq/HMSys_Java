import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Patient } from '../../model/patient.model';
import { Appointment } from '../../model/appointment.model';
import { AppointmentService } from '../../service/appointment.service';

@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.scss',
})
export class AppointmentHistoryComponent implements OnChanges {
  @Input() patient: Patient | null = null;
  appointments: Appointment[] = [];
  isLoading = false;

  constructor(private appointmentService: AppointmentService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patient'] && this.patient) {
      this.loadAppointments(this.patient.id!);
    } else if (!this.patient) {
      this.appointments = [];
    }
  }

  loadAppointments(patientId: number) {
    this.isLoading = true;
    this.appointmentService.getAppointmentsForPatient(patientId).subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching appointments', err);
        this.isLoading = false;
      },
    });
  }
}
