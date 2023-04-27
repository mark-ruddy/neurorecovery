import { Component, OnInit } from '@angular/core';
import { AuthenticatedRequest, BackendService, ExerciseSession } from '../services/backend.service';
import { LoginService } from '../services/login.service';
import { PatientForm, TherapistForm } from '../services/backend.service';
import { FormBuilder, Validators } from '@angular/forms';
import { dateInPast, isInteger } from '../helpers/custom-validators';
import { errorMessages, successMessages } from '../helpers/custom-validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  errorMessages = errorMessages;
  userDataFetchInProgress = false;

  strokeDateEditing = false;
  injuryTypeEditing = false;
  injurySideEditing = false;
  patientAdditionalInfoEditing = false;

  injuryTypes: string[] = ['Upper Limb', 'Lower Limb', 'Both', 'Other'];
  injurySides: string[] = ['Right', 'Left', 'Both', 'Other'];

  numPatientsEditing = false;
  expectedWeeklyAppointmentsEditing = false;
  therapistAdditionalInfoEditing = false;

  patientForm: PatientForm = {
    full_name: 'sample',
    stroke_date: 'sample',
    injury_type: 'sample',
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

  therapistFormBuilder = this.formBuilder.group({
    fullName: this.formBuilder.control('', Validators.required),
    numberOfPatients: this.formBuilder.control<number | null>(null, [Validators.required, isInteger()]),
    expectedNumberOfWeeklyAppointments: this.formBuilder.control<number | null>(null, [Validators.required, isInteger()]),
    additionalInfo: this.formBuilder.control(''),
  })

  patientFormBuilder = this.formBuilder.group({
    fullName: this.formBuilder.control('', Validators.required),
    strokeDate: this.formBuilder.control('', [Validators.required, dateInPast()]),
    injuryType: this.formBuilder.control('', Validators.required),
    injurySide: this.formBuilder.control('', Validators.required),
    additionalInfo: this.formBuilder.control(''),
  })

  exerciseSessions: Array<ExerciseSession> = [];

  totalExerciseSessionsCompleted: number = 0;
  totalTimeSpentExercisingSecs: number = 0;
  totalTimeSpentExercisingHumanReadable: string = '';
  formattedTimeTakenPerExercise = '';

  userType = '';
  email = '';
  loggedIn = false;

  constructor(private loginService: LoginService, private backendService: BackendService, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router) { }

  secondsToHms(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);
    return `${h}hr ${m}m ${s}s`;
  }

  async ngOnInit() {
    if (!this.loginService.mustBeLoggedIn()) {
      return;
    }
    this.loggedIn = true;
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
      this.exerciseSessions.forEach(exerciseSession => this.totalTimeSpentExercisingSecs += parseInt(exerciseSession.total_time_taken_secs));
    }
    this.formattedTimeTakenPerExercise = this.formatTimeTakenPerExercise(this.exerciseSessions[0].serialised_time_spent_in_secs);
    this.totalTimeSpentExercisingHumanReadable = this.secondsToHms(this.totalTimeSpentExercisingSecs)
    this.userDataFetchInProgress = false;
  }

  formatTimeTakenPerExercise(serialisedTimeTakenPerExercise: string): string {
    /// serialisedTimeTakenPerExercise is formatted like 22,33,78 and I want it converted to "22s, 33s, 78s"
    let timeTakenPerExercise = serialisedTimeTakenPerExercise.split(',');
    let formattedTimeTakenPerExercise = '';
    timeTakenPerExercise.forEach(timeTaken => {
      formattedTimeTakenPerExercise += `${timeTaken}s, `;
    });
    return formattedTimeTakenPerExercise
  }

  successfultUpdateSnackbar() {
    this.snackBar.open(successMessages['successfulFormUpdate'], '', {
      duration: 3000,
      panelClass: ['mat-toolbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  onUpdatePatientForm() {
    if (!this.loginService.mustBeLoggedIn()) {
      return;
    }

    if (this.patientFormBuilder.valid) {
      let parsedForm = {
        full_name: this.patientFormBuilder.value.fullName,
        stroke_date: this.patientFormBuilder.value.strokeDate,
        injury_type: this.patientFormBuilder.value.injuryType,
        injury_side: this.patientFormBuilder.value.injurySide,
        additional_info: this.patientFormBuilder.value.additionalInfo,
        email: localStorage.getItem('email'),
        session_id: localStorage.getItem('session_id'),
      } as PatientForm;
      this.backendService.postPatientForm(parsedForm);
      this.successfultUpdateSnackbar();
      this.router.navigate(['user']);
    }
  }
}
