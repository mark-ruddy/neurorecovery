import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorMessages, successMessages } from './helpers/custom-validators';
import { AuthenticatedRequest, BackendService } from './services/backend.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'NeuroRecovery';
  loggedIn = false;
  sessionId = 'NONE';
  email = '';
  userType = '';

  constructor(public loginService: LoginService, private snackBar: MatSnackBar, private backendService: BackendService) { }

  refreshLoginStatus() {
    if (localStorage.getItem('logged_in') == 'true') {
      this.email = localStorage.getItem('email')!;
      this.sessionId = localStorage.getItem('session_id')!;
      this.loggedIn = true;
    } else {
      this.email = '';
      this.sessionId = '';
      this.loggedIn = false;
    }
  }

  async refreshUserType() {
    let authenticatedRequest = {
      email: localStorage.getItem('email'),
      session_id: localStorage.getItem('session_id'),
    } as AuthenticatedRequest;
    this.userType = await this.backendService.getUserType(authenticatedRequest);
  }

  launchLocalMatlab() {
    fetch('http://localhost:9090/launch_matlab', {
      method: 'GET'
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          this.snackBar.open(errorMessages['matlabFailedLaunch'], '', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-warn'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          throw new Error('Non-200 code from launch_matlab/');
        }
        this.snackBar.open(successMessages['matlabSuccessfulLaunch'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        console.log('Successfully launched MATLAB!');
      })
      .catch(error => {
        this.snackBar.open(errorMessages['matlabFailedLaunch'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        console.error('Matlab error:', error);
      });
  }

  launchRdpMatlab() {
    fetch('http://localhost:9090/launch_matlab_rdp', {
      method: 'GET'
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          this.snackBar.open(errorMessages['matlabFailedLaunch'], '', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-warn'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          throw new Error('Non-200 code from launch_matlab/');
        }
        this.snackBar.open(successMessages['matlabSuccessfulLaunch'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        console.log('Successfully launched MATLAB!');
      })
      .catch(error => {
        this.snackBar.open(errorMessages['matlabFailedLaunch'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        console.error('Matlab error:', error);
      });
  }

  launchQuickAssistMatlab() {
    fetch('http://localhost:9090/launch_matlab_quickassist', {
      method: 'GET'
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          this.snackBar.open(errorMessages['matlabFailedLaunch'], '', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-warn'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          throw new Error('Non-200 code from launch_matlab/');
        }
        this.snackBar.open(successMessages['matlabSuccessfulLaunch'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        console.log('Successfully launched MATLAB!');
      })
      .catch(error => {
        this.snackBar.open(errorMessages['matlabFailedLaunch'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        console.error('Matlab error:', error);
      });
  }

  launchSpyderEcgPlot() {
    fetch('http://localhost:9090/launch_spyder_ecg_plot', {
      method: 'GET'
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          this.snackBar.open(errorMessages['spyderFailedLaunch'], '', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-warn'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          throw new Error('Non-200 code from launch_sypder_ecg_plot/');
        }
        this.snackBar.open(successMessages['spyderSuccessfulLaunch'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        console.log('Successfully launched spyder!');
      })
      .catch(error => {
        this.snackBar.open(errorMessages['spyderFailedLaunch'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        console.error('Spyder launch error:', error);
      });
  }

  logout() {
    this.loginService.logout();
    this.refreshLoginStatus();
  }

  async ngOnInit() {
    this.refreshLoginStatus();

    if (this.loggedIn) {
      this.refreshUserType();
    }
  }
}
