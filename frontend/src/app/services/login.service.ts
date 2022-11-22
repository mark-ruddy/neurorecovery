import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BackendService } from './backend.service';
import { UserRequest } from './backend.service';

/*
export interface LoginResponse {
  valid: boolean,
}
*/

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loggedIn = new BehaviorSubject(false);
  email = new BehaviorSubject('');

  constructor(private backendService: BackendService) { }

  async loginWithCredentials(email: string, password: string): Promise<boolean> {
    let valid = await this.backendService.loginUser({
      email: email,
      password: password,
    });

    if (valid) {
      this.email.next(email);
      this.loggedIn.next(true);
      return true;
    } else {
      return false;
    }
  }

  async register(email: string, password: string): Promise<boolean> {
    let valid = await this.backendService.registerUser({
      email: email,
      password: password,
    });

    if (valid) {
      this.email.next(email);
      this.loggedIn.next(true);
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.email.next('');
    this.loggedIn.next(false);
  }
}
