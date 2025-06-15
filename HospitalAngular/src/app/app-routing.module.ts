import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './hospital/components/navbar/navbar.component';
import { FooterComponent } from './hospital/components/footer/footer.component';
import { BodyComponent } from './hospital/components/body/body.component';
import { PatientDashboardComponent } from './hospital/components/patient-dashboard/patient-dashboard.component';

const routes: Routes = [
  {path: 'nav', component: NavbarComponent },
  {path: 'footer', component: FooterComponent },
  {path: '', component: BodyComponent },
  {path: 'dashboard', component: PatientDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
