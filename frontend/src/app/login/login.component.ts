import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GroupErrorMatcher, errorMessages, successMessages } from '../helpers/custom-validators';
import { LoginService } from '../services/login.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMatcher = new GroupErrorMatcher();
  errorMessages = errorMessages;
  loginInProgress = false;

  loginForm = this.formBuilder.group({
    email: this.formBuilder.control<string | null>(null, Validators.required),
    password: this.formBuilder.control<string | null>(null, Validators.required),
  });

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router, private snackBar: MatSnackBar, private appComponent: AppComponent) { }

  ngOnInit(): void { }

  async onSubmit() {
    this.loginInProgress = true;
    if (this.loginForm.valid) {
      let success = await this.loginService.loginWithCredentials(this.loginForm.value.email!, this.loginForm.value.password!);
      if (success) {
        this.snackBar.open(successMessages['successfulLogin'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.appComponent.refreshLoginStatus();
        this.appComponent.refreshUserType();
        this.router.navigate(['instant']);
      } else {
        this.snackBar.open(errorMessages['failedLogin'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      }
    }
  }
}
