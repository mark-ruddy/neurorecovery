import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupErrorMatcher, errorMessages, snackbarMessages } from '../helpers/custom-validators';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMatcher = new GroupErrorMatcher();
  errors = errorMessages;
  loggedIn = false;
  email = '';

  loginForm = this.formBuilder.group({
    email: this.formBuilder.control<string | null>(null, Validators.required),
    password: this.formBuilder.control<string | null>(null, Validators.required),
  });

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginService.loggedIn.subscribe(loggedIn => this.loggedIn = loggedIn);
    this.loginService.email.subscribe(email => this.email = email);
  }

  async onSubmit() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      let success = await this.loginService.loginWithCredentials(this.loginForm.value.email!, this.loginForm.value.password!);
      if (success) {
        this.snackBar.open(snackbarMessages['successfulLogin'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      } else {
        this.snackBar.open(snackbarMessages['failedLogin'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      }
    }
  }
}
