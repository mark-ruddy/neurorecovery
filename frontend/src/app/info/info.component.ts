import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { errorMessages, isInteger } from '../helpers/custom-validators';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  errors = errorMessages;
  infoInProgress = false;
  therapistFormInProgress = false;
  patientFormInProgress = false;
  userTypes: string[] = ['Post-Stroke Patient', 'Therapist'];
  userType = '';
  injurySides: string[] = ['Right', 'Left', 'Both'];

  constructor(private formBuilder: FormBuilder) { }

  userTypeForm = this.formBuilder.group({
    userType: this.formBuilder.control('', Validators.required),
  })

  therapistForm = this.formBuilder.group({
    numberOfPatients: this.formBuilder.control<number | null>(null, [Validators.required, isInteger()]),
  })

  patientForm = this.formBuilder.group({
    injurySide: this.formBuilder.control('', Validators.required),
  })

  ngOnInit(): void {
  }

  onUserTypeChange(userType: string) {
    this.userType = userType;
    console.log('User Type changed to: ', this.userType);
  }

  onSubmitPatientForm(): void {
  }

  onSubmitTherapistForm(): void {
  }
}
