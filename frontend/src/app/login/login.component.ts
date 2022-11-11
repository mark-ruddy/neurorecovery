import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GroupErrorMatcher, confirmPasswordValidator, errorMessages } from '../helpers/custom-validators';
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

  constructor(private formBuilder: FormBuilder, private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.loggedIn.subscribe(loggedIn => this.loggedIn = loggedIn);
    this.loginService.email.subscribe(email => this.email = email);
  }

  onSubmit() {
    console.log(this.loginForm);
  }
}
