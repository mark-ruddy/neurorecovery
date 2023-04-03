import { Component, OnInit } from '@angular/core';
import { AuthenticatedRequest, BackendService, PatientForm, TherapistForm } from '../services/backend.service';

@Component({
  selector: 'app-instant',
  templateUrl: './instant.component.html',
  styleUrls: ['./instant.component.scss']
})
export class InstantComponent implements OnInit {
  userDataFetchInProgress = false;

  patientForm: PatientForm | null = null;

  totalExerciseSessionsCompleted: number = 0;
  totalTimeSpentExercisingSecs: number = 0;
  totalTimeSpentExercisingHumanReadable: string = '';

  userType = '';
  email = '';
  loggedIn = false;


  constructor(private backendService: BackendService) { }

  async ngOnInit() {
    let authenticatedRequest = {
      email: this.email,
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
    }
  }
}
