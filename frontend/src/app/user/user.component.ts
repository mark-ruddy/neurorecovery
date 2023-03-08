import { Component, OnInit } from '@angular/core';
import { AuthenticatedRequest, BackendService, ExerciseSession } from '../services/backend.service';
import { LoginService } from '../services/login.service';
import { PatientForm, TherapistForm } from '../services/backend.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userDataFetchInProgress = false;

  patientForm: PatientForm | null = null;
  therapistForm: TherapistForm | null = null;
  exerciseSessions: Array<ExerciseSession> | null = null;

  totalExerciseSessionsCompleted: number | null = null;
  totalTimeSecsSpentExercising: number | null = null;

  userType = '';
  email = '';
  notLoggedIn = false;

  constructor(private loginService: LoginService, private backendService: BackendService) { }

  async ngOnInit() {
    if (!this.loginService.mustBeLoggedIn()) {
      this.notLoggedIn = true;
      return;
    }
    this.email = localStorage.getItem('email')!;

    let authenticatedRequest = {
      email: this.email,
      session_id: localStorage.getItem('session_id'),
    } as AuthenticatedRequest;

    this.userDataFetchInProgress = true;

    this.userType = await this.backendService.getUserType(authenticatedRequest);

    if (this.userType != "Patient" && this.userType != "Therapist") {
      // User hasn't submitted a form yet
      return;
    }

    if (this.userType == "Patient") {
      this.patientForm = await this.backendService.getPatientForm(authenticatedRequest);
    }

    if (this.userType == "Therapist") {
      this.therapistForm = await this.backendService.getTherapistForm(authenticatedRequest);
    }

    this.exerciseSessions = await this.backendService.getExerciseSessions(authenticatedRequest);

    this.userDataFetchInProgress = false;
  }
}
