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

  patientForm: PatientForm = {
    full_name: 'sample',
    stroke_date: 'sample',
    injury_side: 'sample',
    additional_info: 'sample',
    email: 'sample',
    session_id: 'sample',
  };

  therapistForm: TherapistForm = {
    full_name: 'sample',
    num_patients: 0,
    expected_weekly_appointments: 0,
    additional_info: 'sample',
    email: 'sample',
    session_id: 'sample',
  };
  exerciseSessions: Array<ExerciseSession> = [];

  totalExerciseSessionsCompleted: number = 0;
  totalTimeSecsSpentExercising: number = 0;

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
    if (this.exerciseSessions.length > 0) {
      this.totalExerciseSessionsCompleted = this.exerciseSessions.length;
      this.exerciseSessions.forEach(exerciseSession => this.totalTimeSecsSpentExercising += parseInt(exerciseSession.total_time_taken_secs));
    }

    this.userDataFetchInProgress = false;
  }
}
