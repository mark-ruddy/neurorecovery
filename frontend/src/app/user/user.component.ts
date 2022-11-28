import { Component, OnInit } from '@angular/core';
import { AuthenticatedRequest, BackendService } from '../services/backend.service';
import { LoginService } from '../services/login.service';
import { PatientForm, TherapistForm } from '../services/backend.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userDataFetchInProgress = false;
  patientForm = {
    full_name: 'sample',
    stroke_date: 'sample',
    injury_side: 'sample',
    additional_info: 'sample',
    session_id: 'sample',
  } as PatientForm;

  therapistForm = {
    full_name: 'sample',
    num_patients: 0,
    expected_weekly_appointments: 0,
    additional_info: 'sample',
    session_id: 'sample',
  } as TherapistForm;

  userType = '';
  email = localStorage.getItem('email');
  noUserType = false;
  notLoggedIn = false;

  constructor(private loginService: LoginService, private backendService: BackendService) { }

  async ngOnInit() {
    if (!this.loginService.mustBeLoggedIn()) {
      this.notLoggedIn = true;
      return;
    }

    let authenticatedRequest = {
      email: localStorage.getItem('email'),
      session_id: localStorage.getItem('session_id'),
    } as AuthenticatedRequest;

    this.userDataFetchInProgress = true;

    this.userType = await this.backendService.getUserType(authenticatedRequest);

    if (this.userType != "Patient" && this.userType != "Therapist") {
      // User hasn't submitted a form yet, display this to them
      this.noUserType = true;
      return;
    }

    if (this.userType == "Patient") {
      this.patientForm = await this.backendService.getPatientForm(authenticatedRequest);
    }

    if (this.userType == "Therapist") {
      this.therapistForm = await this.backendService.getTherapistForm(authenticatedRequest);
    }

    this.userDataFetchInProgress = false;
  }
}
