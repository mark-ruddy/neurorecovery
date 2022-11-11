import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loggedIn = new BehaviorSubject(false);
  email = new BehaviorSubject('');
  // username = new

  constructor() { }

  loginWithCredentials(email: string, _password: string) {
    // TODO backend comms, for now simulate login by default
    this.email.next(email);
    this.loggedIn.next(true);
  }

  logout() {
    this.email.next('');
    this.loggedIn.next(false);
  }
}
