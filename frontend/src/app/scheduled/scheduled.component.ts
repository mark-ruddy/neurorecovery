import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { successMessages } from '../helpers/custom-validators';
import { Router } from '@angular/router';

import * as ics from 'ics';
import { BackendService, EmailRequest } from '../services/backend.service';

@Component({
  selector: 'app-scheduled',
  templateUrl: './scheduled.component.html',
  styleUrls: ['./scheduled.component.scss']
})
export class ScheduledComponent implements OnInit {
  email = '';
  receiverEmail = '';

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private snackBar: MatSnackBar, private router: Router, private backendService: BackendService) { }

  ngOnInit(): void {
    this.email = localStorage.getItem('email')!;
  }

  contactForm = this.formBuilder.group({
    contactEmail: this.formBuilder.control('', Validators.required),
    datetime: this.formBuilder.control('', Validators.required),
    estimatedTime: this.formBuilder.control(30, Validators.required),
  })

  onSubmit() {
    if (!this.loginService.mustBeLoggedIn()) {
      return;
    }
    let date = new Date(this.contactForm.value.datetime!);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();

    let { error, value } = ics.createEvent({
      start: [year, month, day, hour, minute],
      duration: { minutes: this.contactForm.value.estimatedTime! },
      title: 'NeuroRecovery Meeting',
      description: 'NeuroRecovery Meeting',
      location: 'Online Call',
      // TODO: user must set the meeting link?
      // url: 'https://example.com/meeting',
    })
    if (error) {
      console.log(error);
    }
    // NOTE: Ics file will be downloaded on the requesting users browser, and also emailed to both parties
    let blob = new Blob([value!], { type: 'text/calendar;charset=utf-8' });
    saveAs(blob, 'neurorecovery_meeting.ics');


    this.receiverEmail = this.contactForm.value.contactEmail!;

    let emailRequest = {
      email: this.email,
      receiver_email: this.receiverEmail,
      ics_text: value!,
      session_id: localStorage.getItem('session_id')!,
    } as EmailRequest;

    this.backendService.postSendEmail(emailRequest)
    this.snackBar.open(successMessages['calendarFileCreated'], '', {
      duration: 3000,
      panelClass: ['mat-toolbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });

    this.router.navigateByUrl('/scheduled-result', { state: { email: this.email, receiverEmail: this.receiverEmail } });
  }
}
