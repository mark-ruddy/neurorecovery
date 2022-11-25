import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { errorMessages, isInteger, dateInPast } from '../helpers/custom-validators';
import { BackendService, PatientForm, TherapistForm } from '../services/backend.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  infoInProgress = false;
  errorMessages = errorMessages;
  therapistFormInProgress = false;
  patientFormInProgress = false;

  userType = '';
  userTypes: string[] = ['Patient', 'Therapist'];
  injurySides: string[] = ['Right', 'Left', 'Both', 'Other'];

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private backendService: BackendService) { }

  userTypeForm = this.formBuilder.group({
    userType: this.formBuilder.control('', Validators.required),
  })

  therapistForm = this.formBuilder.group({
    fullName: this.formBuilder.control('', Validators.required),
    numberOfPatients: this.formBuilder.control<number | null>(null, [Validators.required, isInteger()]),
    expectedNumberOfWeeklyAppointments: this.formBuilder.control<number | null>(null, [Validators.required, isInteger()]),
    additionalInfo: this.formBuilder.control(''),
  })

  patientForm = this.formBuilder.group({
    fullName: this.formBuilder.control('', Validators.required),
    strokeDate: this.formBuilder.control('', [Validators.required, dateInPast()]),
    injurySide: this.formBuilder.control('', Validators.required),
    additionalInfo: this.formBuilder.control(''),
  })

  ngOnInit(): void {
  }

  onUserTypeChange(userType: string) {
    this.userType = userType;
  }

  onSubmitPatientForm(): void {
    if (!this.loginService.mustBeLoggedIn()) {
      return;
    }

    if (this.patientForm.valid) {
      let parsedForm = {
        full_name: this.patientForm.value.fullName,
        stroke_date: this.patientForm.value.strokeDate,
        injury_side: this.patientForm.value.injurySide,
        additional_info: this.patientForm.value.additionalInfo,
        email: localStorage.getItem('email'),
        session_id: localStorage.getItem('session_id'),
      } as PatientForm;
      this.backendService.patientForm(parsedForm);
    }
  }

  onSubmitTherapistForm(): void {
    if (!this.loginService.mustBeLoggedIn()) {
      return;
    }

    if (this.therapistForm.valid) {
      let parsedForm = {
        full_name: this.therapistForm.value.fullName,
        num_patients: this.therapistForm.value.numberOfPatients,
        expected_weekly_appointments: this.therapistForm.value.expectedNumberOfWeeklyAppointments,
        additional_info: this.therapistForm.value.additionalInfo,
        email: localStorage.getItem('email'),
        session_id: localStorage.getItem('session_id'),
      } as TherapistForm;
      this.backendService.therapistForm(parsedForm);
    }
  }
}
