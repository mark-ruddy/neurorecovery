import { Injectable } from '@angular/core';

export interface UserRequest {
  email: string,
  password: string,
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  // NOTE: In production this URL should be the host server address
  public backendBaseUrl = 'http://localhost:8080';

  public loginUserEndpoint = 'login_user';
  public registerUserEndpoint = 'register_user';

  constructor() { }

  async registerUser(userRequest: UserRequest): Promise<boolean> {
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
    return resp_json.valid;
  }

  async loginUser(userRequest: UserRequest): Promise<boolean> {
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
    return resp_json.valid;
  }
}
