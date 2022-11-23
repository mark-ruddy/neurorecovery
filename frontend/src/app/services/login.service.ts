import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private backendService: BackendService) { }

  async loginWithCredentials(email: string, password: string): Promise<boolean> {
    let [valid, sessionId] = await this.backendService.loginUser({
      email: email,
      password: password,
    });

    if (valid) {
      localStorage.setItem('email', email);
      localStorage.setItem('logged_in', "true");
      localStorage.setItem('session_id', sessionId);
      return true;
    } else {
      return false;
    }
  }

  async register(email: string, password: string): Promise<boolean> {
    let [valid, sessionId] = await this.backendService.registerUser({
      email: email,
      password: password,
    });

    if (valid) {
      localStorage.setItem('email', email);
      localStorage.setItem('logged_in', 'true');
      localStorage.setItem('session_id', sessionId);
      return true;
    } else {
      return false;
    }
  }

  logout() {
    localStorage.setItem('email', '');
    localStorage.setItem('logged_in', 'false')
    localStorage.setItem('session_id', '');
  }
}
