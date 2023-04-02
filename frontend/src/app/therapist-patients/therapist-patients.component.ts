import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticatedRequest, BackendService } from '../services/backend.service';
import { SearchPatientsRequest } from '../services/backend.service';
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

  constructor(private formBuilder: FormBuilder, private backendService: BackendService, private loginService: LoginService) { }

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

    let searchPatientsRequest = {
      patient_email_substring: this.searchPatientsForm.value.email,
      email: localStorage.getItem('email'),
      session_id: localStorage.getItem('session_id'),
    } as SearchPatientsRequest;

    this.searchedPatients = await this.backendService.searchPatients(searchPatientsRequest)
  }

  onRemotePatient() {
    if (!this.loginService.mustBeLoggedIn()) {
      return;
    }

    let authenticatedRequest = {
      email: localStorage.getItem('email'),
      session_id: localStorage.getItem('session_id'),
    } as AuthenticatedRequest;

    this.backendService.getTherapistPatients(authenticatedRequest);
  }
}
