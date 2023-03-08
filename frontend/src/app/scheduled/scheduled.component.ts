import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-scheduled',
  templateUrl: './scheduled.component.html',
  styleUrls: ['./scheduled.component.scss']
})
export class ScheduledComponent implements OnInit {

  loggedIn = false;
  email = '';

  constructor(private formBuilder: FormBuilder, private loginService: LoginService) { }

  ngOnInit(): void {
    if (!this.loginService.mustBeLoggedIn()) {
      return;
    }
    this.loggedIn = true;
    this.email = localStorage.getItem('email')!;
  }

  contactForm = this.formBuilder.group({
    contactEmail: this.formBuilder.control('', Validators.required),
    datetime: this.formBuilder.control('', Validators.required)
  })

  onSubmit() {
    // TODO: generate an ics file and setup mailgun SMTP to email it to both parties(user must be logged in so we know their email too)
    // probably need a "confirm page" or smth for this after the user clicks send
  }

}
