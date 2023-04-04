import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorMessages } from '../helpers/custom-validators';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private backendService: BackendService, private snackBar: MatSnackBar) { }

  async loginWithCredentials(email: string, password: string): Promise<boolean> {
    try {
      let sessionId = await this.backendService.loginUser({
        email: email,
        password: password,
      });
      localStorage.setItem('email', email);
      localStorage.setItem('logged_in', "true");
      localStorage.setItem('session_id', sessionId);
      return true;
    } catch (e) {
      return false
    }
  }

  async register(email: string, password: string): Promise<boolean> {
    try {
      let sessionId = await this.backendService.registerUser({
        email: email,
        password: password,
      });
      localStorage.setItem('email', email);
      localStorage.setItem('logged_in', 'true');
      localStorage.setItem('session_id', sessionId);
    } catch (e) {
      return false;
    }
    return true;
  }

  mustBeLoggedIn(): boolean {
    if (localStorage.getItem('logged_in') == 'true') {
      return true;
    }
    this.snackBar.open(errorMessages['mustBeLoggedIn'], '', {
      duration: 3000,
      panelClass: ['mat-toolbar', 'mat-warn'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
    return false;
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('logged_in') == 'true') {
      return true;
    }
    return false;
  }


  logout() {
    localStorage.setItem('email', '');
    localStorage.setItem('logged_in', 'false')
    localStorage.setItem('session_id', '');
  }
}
