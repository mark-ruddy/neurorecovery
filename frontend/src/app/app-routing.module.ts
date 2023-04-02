import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InfoComponent } from './info/info.component';
import { InstantHandComponent } from './instant-hand/instant-hand.component';
import { InstantLlComponent } from './instant-ll/instant-ll.component';
import { InstantUlComponent } from './instant-ul/instant-ul.component';
import { InstantComponent } from './instant/instant.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ScheduledComponent } from './scheduled/scheduled.component';
import { TherapistPatientsComponent } from './therapist-patients/therapist-patients.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: '', redirectTo: 'info', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserComponent },
  { path: 'info', component: InfoComponent },
  { path: 'instant', component: InstantComponent },
  { path: 'scheduled', component: ScheduledComponent },
  { path: 'scheduled-results', component: ScheduledComponent },
  { path: 'therapist-patients', component: TherapistPatientsComponent },

  { path: 'instant-ul', component: InstantUlComponent },
  { path: 'instant-ll', component: InstantLlComponent },
  { path: 'instant-hand', component: InstantHandComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
