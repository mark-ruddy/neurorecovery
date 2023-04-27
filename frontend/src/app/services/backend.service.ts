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
  injury_type: string,
  injury_side: string,
  additional_info: string,
  email: string,
  session_id: string,
}

export interface TherapistForm {
  full_name: string,
  num_patients: number,
  expected_weekly_appointments: number,
  additional_info: string
  email: string,
  session_id: string,
}

export interface ExerciseSession {
  kind: string,
  datetime: string,
  total_time_taken_secs: string,
  num_exercises_completed: string,
  serialised_time_spent_in_secs: string,
  email: string,
  session_id: string,
}

export interface EmailRequest {
  email: string,
  receiver_email: string,
  ics_text: string,
  session_id: string,
}

export interface TherapistPatientRequest {
  patient_email: string,
  email: string,
  session_id: string,
}

export interface SearchPatientsRequest {
  patient_email_substring: string,
  email: string,
  session_id: string,
}

export interface TherapistPatients {
  patients: string[],
  patient_forms: PatientForm[],
  email: string,
  session_id: string,
}

export interface Patient {
  email: string,
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
  public postExerciseSessionEndpoint = 'post_exercise_session';
  public getPatientFormEndpoint = 'get_patient_form';
  public getTherapistFormEndpoint = 'get_therapist_form';
  public getTherapistPatientsEndpoint = 'get_therapist_patients';
  public postTherapistPatientEndpoint = 'post_therapist_patient';
  public removeTherapistPatientEndpoint = 'remove_therapist_patient';
  public getExerciseSessionsEndpoint = 'get_exercise_sessions';
  public getUserTypeEndpoint = 'get_user_type';
  public sendEmailEndpoint = 'send_email';
  public searchPatientsEndpoint = 'search_patients';

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

  async postExerciseSession(exerciseSession: ExerciseSession) {
    let resp = await fetch(`${this.backendBaseUrl}/${this.postExerciseSessionEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exerciseSession),
    })
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
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

  async getTherapistPatients(authenticatedRequest: AuthenticatedRequest): Promise<TherapistPatients> {
    let resp = await fetch(`${this.backendBaseUrl}/${this.getTherapistPatientsEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authenticatedRequest),
    })
    if (!resp.ok) {
      if (resp.status == 400) {
        return { patients: [], patient_forms: [], email: authenticatedRequest.email, session_id: authenticatedRequest.session_id };
      } else {
        throw new Error(resp.statusText);
      }
    }
    return resp.json()
  }

  async postTherapistPatient(therapistPatient: TherapistPatientRequest) {
    let resp = await fetch(`${this.backendBaseUrl}/${this.postTherapistPatientEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(therapistPatient),
    })
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
  }

  async removeTherapistPatient(therapistPatient: TherapistPatientRequest) {
    let resp = await fetch(`${this.backendBaseUrl}/${this.removeTherapistPatientEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(therapistPatient),
    })
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
  }

  async getExerciseSessions(authenticatedRequest: AuthenticatedRequest): Promise<Array<ExerciseSession>> {
    let resp = await fetch(`${this.backendBaseUrl}/${this.getExerciseSessionsEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authenticatedRequest),
    })
    if (!resp.ok) {
      // NOTE: for exercises its expected to get 400 BAD_REQUEST for empty array
      if (resp.status == 400) {
        return [];
      } else {
        throw new Error(resp.statusText);
      }
    }
    return resp.json()
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

  async postSendEmail(emailRequest: EmailRequest) {
    let resp = await fetch(`${this.backendBaseUrl}/${this.sendEmailEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailRequest),
    });
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.text();
  }

  async searchPatients(searchPatientsRequest: SearchPatientsRequest): Promise<Array<Patient>> {
    let resp = await fetch(`${this.backendBaseUrl}/${this.searchPatientsEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchPatientsRequest),
    });
    if (!resp.ok) {
      if (resp.status == 400) {
        return [];
      } else {
        throw new Error(resp.statusText);
      }
    }
    return resp.json();
  }
}
