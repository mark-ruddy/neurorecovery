import { Injectable } from '@angular/core';

export interface UserRequest {
  email: string,
  password: string,
}

export interface AuthenticatedRequest {
  email: string,
  session_id: string,
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
  public postPatientFormEndpoint = 'post_patient_form';
  public postTherapistFormEndpoint = 'post_therapist_form';
  public getUserTypeEndpoint = 'get_user_type';
  public getPatientFormEndpoint = 'get_patient_form';
  public getTherapistFormEndpoint = 'get_therapist_form';

  constructor() { }

  async registerUser(userRequest: UserRequest): Promise<string> {
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
    return resp_json.session_id;
  }

  async loginUser(userRequest: UserRequest): Promise<string> {
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
    return resp_json.session_id;
  }

  async postPatientForm(patientForm: PatientForm) {
    let resp = await fetch(`${this.backendBaseUrl}/${this.postPatientFormEndpoint}`, {
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

  async postTherapistForm(therapistForm: TherapistForm) {
    let resp = await fetch(`${this.backendBaseUrl}/${this.postTherapistFormEndpoint}`, {
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

  async getUserType(authenticatedRequest: AuthenticatedRequest): Promise<string> {
    let resp = await fetch(`${this.backendBaseUrl}/${this.getUserTypeEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authenticatedRequest),
    })
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.text()
  }

  async getPatientForm(authenticatedRequest: AuthenticatedRequest): Promise<PatientForm> {
    let resp = await fetch(`${this.backendBaseUrl}/${this.getPatientFormEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authenticatedRequest),
    })
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json()
  }

  async getTherapistForm(authenticatedRequest: AuthenticatedRequest): Promise<TherapistForm> {
    let resp = await fetch(`${this.backendBaseUrl}/${this.getTherapistFormEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authenticatedRequest),
    })
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json()
  }
}
