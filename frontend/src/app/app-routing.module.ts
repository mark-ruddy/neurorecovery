import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InfoComponent } from './info/info.component';
import { InstantComponent } from './instant/instant.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ScheduledComponent } from './scheduled/scheduled.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: '', redirectTo: 'info', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserComponent },
  { path: 'info', component: InfoComponent },
  { path: 'instant', component: InstantComponent },
  { path: 'scheduled', component: ScheduledComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
