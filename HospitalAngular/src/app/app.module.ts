import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PatientDashboardComponent } from './hospital/components/patient-dashboard/patient-dashboard.component';
import { PatientInfoComponent } from './hospital/components/patient-info/patient-info.component';
import { AppointmentHistoryComponent } from './hospital/components/appointment-history/appointment-history.component';
import { NavbarComponent } from './hospital/components/navbar/navbar.component';
import { FooterComponent } from './hospital/components/footer/footer.component';
import { BodyComponent } from './hospital/components/body/body.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientDashboardComponent,
    PatientInfoComponent,
    AppointmentHistoryComponent,
    NavbarComponent,
    FooterComponent,
    BodyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
