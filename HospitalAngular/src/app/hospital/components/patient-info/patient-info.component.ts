import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Patient } from '../../model/patient.model';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrl: './patient-info.component.scss',
})
export class PatientInfoComponent {
  @Input() patient: Patient | null = null;
  @Output() editPatient = new EventEmitter<Patient>();

  onEdit() {
    if (this.patient) {
      this.editPatient.emit(this.patient);
    }
  }
}
