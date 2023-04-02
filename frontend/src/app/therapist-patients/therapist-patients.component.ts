import { Component, OnInit } from '@angular/core';
import { AuthenticatedRequest, BackendService } from '../services/backend.service';

@Component({
  selector: 'app-therapist-patients',
  templateUrl: './therapist-patients.component.html',
  styleUrls: ['./therapist-patients.component.scss']
})
export class TherapistPatientsComponent implements OnInit {
  userType = '';

  constructor(private backendService: BackendService) { }

  getTherapistPatients(authenticatedRequest: AuthenticatedRequest) {
    this.backendService.getTherapistPatients(authenticatedRequest);
  }

  async ngOnInit() {
    let authenticatedRequest = {
      email: localStorage.getItem('email'),
      session_id: localStorage.getItem('session_id'),
    } as AuthenticatedRequest;

    this.userType = await this.backendService.getUserType(authenticatedRequest);

    if (this.userType != "Patient" && this.userType != "Therapist") {
      // User hasn't submitted a form yet
      return;
    }
  }
}
