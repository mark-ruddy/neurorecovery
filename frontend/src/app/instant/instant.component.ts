import { Component, OnInit } from '@angular/core';
import { AuthenticatedRequest, BackendService, PatientForm } from '../services/backend.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-instant',
  templateUrl: './instant.component.html',
  styleUrls: ['./instant.component.scss']
})
export class InstantComponent implements OnInit {
  userDataFetchInProgress = false;
  patientForm: PatientForm | null = null;
  injuryType = '';
  userType = '';
  loggedIn = false;

  constructor(private loginService: LoginService, private backendService: BackendService) { }

  async ngOnInit() {
    if (this.loginService.isLoggedIn()) {
      this.loggedIn = true;

      let authenticatedRequest = {
        email: localStorage.getItem('email'),
        session_id: localStorage.getItem('session_id'),
      } as AuthenticatedRequest;

      this.userDataFetchInProgress = true;

      this.userType = await this.backendService.getUserType(authenticatedRequest);

      /*
      if (this.userType != "Patient" && this.userType != "Therapist") {
        // User hasn't submitted a form yet
        return;
      }
      */

      if (this.userType == "Patient") {
        this.patientForm = await this.backendService.getPatientForm(authenticatedRequest);
        this.injuryType = this.patientForm.injury_type;
      }
    }
  }
}
