import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GroupErrorMatcher, confirmPasswordValidator, errorMessages, minimumPasswordRequirementsValidator } from '../helpers/custom-validators';
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
  email = '';

  registerForm = this.formBuilder.group({
    email: this.formBuilder.control<string | null>(null, Validators.required),
    password: this.formBuilder.control<string | null>(null, [Validators.required, minimumPasswordRequirementsValidator()]),
    confirmPassword: this.formBuilder.control<string | null>(null, Validators.required),
  }, {
    validators: [confirmPasswordValidator()]
  });

  constructor(private formBuilder: FormBuilder, private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.loggedIn.subscribe(loggedIn => this.loggedIn = loggedIn);
    this.loginService.email.subscribe(email => this.email = email);
  }

  onSubmit() {
    console.log(this.registerForm);
  }
}
