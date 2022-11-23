import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GroupErrorMatcher, confirmPasswordValidator, errorMessages, minimumPasswordRequirementsValidator, snackbarMessages } from '../helpers/custom-validators';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  errorMatcher = new GroupErrorMatcher();
  errors = errorMessages;
  loggedIn = false;
  loginInProgress = false;
  email = '';

  registerForm = this.formBuilder.group({
    email: this.formBuilder.control<string | null>(null, Validators.required),
    password: this.formBuilder.control<string | null>(null, [Validators.required, minimumPasswordRequirementsValidator()]),
    confirmPassword: this.formBuilder.control<string | null>(null, Validators.required),
  }, {
    validators: [confirmPasswordValidator()]
  });

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginService.loggedIn.subscribe(loggedIn => this.loggedIn = loggedIn);
    this.loginService.email.subscribe(email => this.email = email);
  }

  async onSubmit() {
    console.log(this.registerForm.value);
    this.loginInProgress = true;
    if (this.registerForm.valid) {
      let success = await this.loginService.register(this.registerForm.value.email!, this.registerForm.value.password!);
      if (success) {
        this.snackBar.open(snackbarMessages['successfulRegistration'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.router.navigate(['instant']);
      } else {
        this.snackBar.open(snackbarMessages['failedRegistration'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      }
    }
  }
}
