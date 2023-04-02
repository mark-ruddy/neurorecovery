import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorMessages, successMessages } from '../helpers/custom-validators';
import { AuthenticatedRequest, BackendService } from '../services/backend.service';
import { SearchPatientsRequest, TherapistPatientRequest } from '../services/backend.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-therapist-patients',
  templateUrl: './therapist-patients.component.html',
  styleUrls: ['./therapist-patients.component.scss']
})
export class TherapistPatientsComponent implements OnInit {
  userType = '';
  patients: string[] = [];
  searchedPatients: string[] = [];
  searchJustRan = false;
  mostRecentSearchTerm = '';

  constructor(private formBuilder: FormBuilder, private backendService: BackendService, private loginService: LoginService, private snackBar: MatSnackBar) { }

  searchPatientsForm = this.formBuilder.group({
    email: this.formBuilder.control('', Validators.required),
  });

  async ngOnInit() {
    if (!this.loginService.mustBeLoggedIn()) {
      return;
    }

    let authenticatedRequest = {
      email: localStorage.getItem('email'),
      session_id: localStorage.getItem('session_id'),
    } as AuthenticatedRequest;

    this.userType = await this.backendService.getUserType(authenticatedRequest);

    if (this.userType != "Patient" && this.userType != "Therapist") {
      // User hasn't submitted a form yet
      return;
    }

    let therapistPatients = await this.backendService.getTherapistPatients(authenticatedRequest);
    this.patients = therapistPatients.patients;
  }

  async onSubmitSearchPatientsForm() {
    if (!this.loginService.mustBeLoggedIn()) {
      return;
    }

    this.searchJustRan = false;
    this.mostRecentSearchTerm = this.searchPatientsForm.value.email!;
    let searchPatientsRequest = {
      patient_email_substring: this.mostRecentSearchTerm,
      email: localStorage.getItem('email'),
      session_id: localStorage.getItem('session_id'),
    } as SearchPatientsRequest;

    this.searchedPatients = await this.backendService.searchPatients(searchPatientsRequest)
    this.searchJustRan = true;
  }

  onAddPatient(email: string) {
    if (!this.loginService.mustBeLoggedIn()) {
      return;
    }

    let therapistPatientRequest = {
      patient_email: email,
      email: localStorage.getItem('email'),
      session_id: localStorage.getItem('session_id'),
    } as TherapistPatientRequest;

    try {
      this.backendService.postTherapistPatient(therapistPatientRequest);
      this.snackBar.open(successMessages['addedPatient'], '', {
        duration: 3000,
        panelClass: ['mat-toolbar'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } catch (e) {
      this.snackBar.open(errorMessages['addedPatient'], '', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-warn'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }
  }

  onRemovePatient(email: string) {
    if (!this.loginService.mustBeLoggedIn()) {
      return;
    }

    let therapistPatientRequest = {
      patient_email: email,
      email: localStorage.getItem('email'),
      session_id: localStorage.getItem('session_id'),
    } as TherapistPatientRequest;

    try {
      this.backendService.removeTherapistPatient(therapistPatientRequest);
      this.snackBar.open(successMessages['removedPatient'], '', {
        duration: 3000,
        panelClass: ['mat-toolbar'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } catch (e) {
      this.snackBar.open(errorMessages['failedRemovingPatient'], '', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-warn'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }
  }
}
