import { Injectable } from '@angular/core';

export interface UserRequest {
  email: string,
  password: string,
}

export interface PatientForm {
  full_name: string,
  stroke_date: string,
  injury_side: string,
  additional_info: string,
  session_id: string,
}

export interface TherapistForm {
  full_name: string,
  num_patients: number,
  expected_weekly_appointments: number,
  additional_info: string
  session_id: string,
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  // NOTE: In production this URL should be the host server address
  public backendBaseUrl = 'http://localhost:8080';

  public loginUserEndpoint = 'login_user';
  public registerUserEndpoint = 'register_user';
  public patientFormEndpoint = 'patient_form';
  public therapistFormEndpoint = 'therapist_form';

  constructor() { }

  async registerUser(userRequest: UserRequest): Promise<[boolean, string]> {
    let resp = await fetch(`${this.backendBaseUrl}/${this.registerUserEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userRequest),
    })
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    let resp_json = await resp.json();
    return [resp_json.valid, resp_json.session_id];
  }

  async loginUser(userRequest: UserRequest): Promise<[boolean, string]> {
    let resp = await fetch(`${this.backendBaseUrl}/${this.loginUserEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userRequest),
    })
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    let resp_json = await resp.json();
    return [resp_json.valid, resp_json.session_id];
  }

  async patientForm(patientForm: PatientForm) {
    let resp = await fetch(`${this.backendBaseUrl}/${this.patientFormEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientForm),
    })
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
  }

  async therapistForm(therapistForm: TherapistForm) {
    let resp = await fetch(`${this.backendBaseUrl}/${this.therapistFormEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(therapistForm),
    })
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
  }
}
