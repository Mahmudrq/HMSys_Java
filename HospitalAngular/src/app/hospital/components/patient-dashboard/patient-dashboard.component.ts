import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Patient } from '../../model/patient.model';
import { Appointment } from '../../model/appointment.model';
import { PatientService } from '../../service/patient.service';
import { AppointmentService } from '../../service/appointment.service';
import * as Highcharts from 'highcharts';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss'],
})
export class PatientDashboardComponent implements OnInit, AfterViewInit {
  // @ViewChild('ageChartContainer') private ageChartEl!: ElementRef;
  // @ViewChild('pieChartContainer') private pieChartEl!: ElementRef;

  @ViewChild('ageChartContainer', { static: false }) ageChartEl!: ElementRef;
  @ViewChild('pieChartContainer', { static: false }) pieChartEl!: ElementRef;


  isBrowser: boolean = false;

  patients: Patient[] = [];
  allAppointments: Appointment[] = [];
  selectedPatient: Patient | null = null;

  patientFormModel: Patient = this.getEmptyPatient();
  appointmentFormModel: Partial<Appointment> = {};
  isEditMode = false;

  patientModal: any;
  appointmentModal: any;

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  genders = ['Male', 'Female', 'Other'];
  doctors = [
  { id: 101, name: 'Dr. Siraj' },
  { id: 102, name: 'Dr. Anik' },
  { id: 103, name: 'Dr. Ibne Sina' },
  { id: 104, name: 'Dr. Liza' },
  { id: 105, name: 'Dr. Kamal Hossain' },
];


  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // this.isBrowser = isPlatformBrowser(platformId);
  }
  

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const bootstrap = (window as any).bootstrap;
      const patientModalEl = document.getElementById('patientModal');
      const appointmentModalEl = document.getElementById('appointmentModal');
      if (bootstrap && patientModalEl && appointmentModalEl) {
        this.patientModal = new bootstrap.Modal(patientModalEl);
        this.appointmentModal = new bootstrap.Modal(appointmentModalEl);
      }
    }
    if (this.isBrowser) {
      // Only call rendering functions on the browser
      this.renderAgeBarChart();
      this.renderAppointmentPieChart();
    }

    this.loadInitialData();
  }

  // ngAfterViewInit(): void {
  //   // Delay rendering charts slightly to ensure view children are available
  //   setTimeout(() => {
  //     this.renderAgeBarChart();
  //     this.renderAppointmentPieChart();
  //   }, 200);
  // }

  ngAfterViewInit(): void {
  if (this.isBrowser) {
    setTimeout(() => {
      this.renderAgeBarChart();
      this.renderAppointmentPieChart();
    }, 300);
  }
}


  loadInitialData(): void {
    this.patientService.getPatients().subscribe((data) => {
      this.patients = data;
      setTimeout(() => this.renderAgeBarChart(), 100); // Ensure chart container is ready
    });

    this.appointmentService.getAllAppointments().subscribe((data) => {
      this.allAppointments = data;
      setTimeout(() => this.renderAppointmentPieChart(), 100); // Ensure chart container is ready
    });
  }

  selectPatient(patient: Patient): void {
    this.selectedPatient = patient;
  }

  openAddPatientModal(): void {
    this.isEditMode = false;
    this.patientFormModel = this.getEmptyPatient();
    this.patientModal?.show();
  }

  openEditPatientModal(patient: Patient): void {
    this.isEditMode = true;
    this.patientFormModel = { ...patient };
    this.patientModal?.show();
  }

  openAppointmentModal(): void {
    if (!this.selectedPatient) {
      alert('Please select a patient first.');
      return;
    }
    this.appointmentFormModel = {
      patientId: this.selectedPatient.id,
      status: 'SCHEDULED',
    };
    this.appointmentModal?.show();
  }

  savePatient(): void {
    const operation = this.isEditMode
      ? this.patientService.updatePatient(this.patientFormModel.id!, this.patientFormModel)
      : this.patientService.createPatient(this.patientFormModel);

    operation.subscribe(() => {
      this.loadInitialData();
      this.patientModal?.hide();
      if (this.isEditMode && this.selectedPatient?.id === this.patientFormModel.id) {
        this.selectPatient(this.patientFormModel);
      }
    });
  }

  saveAppointment(): void {
    this.appointmentService
      .createAppointment(this.appointmentFormModel as Appointment)
      .subscribe(() => {
        this.loadInitialData();
        if (this.selectedPatient) this.selectPatient(this.selectedPatient);
        this.appointmentModal?.hide();
      });
  }

  deletePatient(patientId: number): void {
    if (confirm('Are you sure you want to delete this patient? This cannot be undone.')) {
      this.patientService.deletePatient(patientId).subscribe(() => {
        if (this.selectedPatient?.id === patientId) {
          this.selectedPatient = null;
        }
        this.loadInitialData();
      });
    }
  }

  private getEmptyPatient(): Patient {
    return {
      name: '',
      dob: '',
      bloodGroup: '',
      gender: '',
      phone: '',
      address: '',
      insuranceType: 'Private',
    };
  }

  renderAgeBarChart(): void {
    if (!this.ageChartEl) return;
    if (!this.isBrowser) return;

    const ageGroups = { '0-20': 0, '21-40': 0, '41-60': 0, '61+': 0 };
    this.patients.forEach((p) => {
      const age = new Date().getFullYear() - new Date(p.dob).getFullYear();
      if (age <= 20) ageGroups['0-20']++;
      else if (age <= 40) ageGroups['21-40']++;
      else if (age <= 60) ageGroups['41-60']++;
      else ageGroups['61+']++;
    });

    Highcharts.chart(this.ageChartEl.nativeElement, {
      chart: { type: 'bar' },
      title: { text: '' },
      xAxis: { categories: Object.keys(ageGroups), title: { text: null } },
      yAxis: { min: 0, title: { text: 'Number of Patients' } },
      legend: { enabled: false },
      credits: { enabled: false },
      series: [{ type: 'bar', name: 'Patients', data: Object.values(ageGroups) }],
    });
  }

  renderAppointmentPieChart(): void {
    if (!this.pieChartEl) return;
    if (!this.isBrowser) return

    const statusCounts = { SCHEDULED: 0, COMPLETED: 0, CANCELED: 0 };
    this.allAppointments.forEach((a) => {
      statusCounts[a.status]++;
    });

    Highcharts.chart(this.pieChartEl.nativeElement, {
      chart: { type: 'pie' },
      title: { text: '' },
      tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}',
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Status',
          data: [
            { name: 'Scheduled', y: statusCounts.SCHEDULED, color: '#0d6efd' },
            { name: 'Completed', y: statusCounts.COMPLETED, color: '#198754' },
            { name: 'Canceled', y: statusCounts.CANCELED, color: '#dc3545' },
          ],
        },
      ],
    });
  }
}
