import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { dateInFuture, errorMessages, successMessages } from '../helpers/custom-validators';
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
  errorMessages = errorMessages;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private snackBar: MatSnackBar, private router: Router, private backendService: BackendService) { }

  ngOnInit(): void {
    this.email = localStorage.getItem('email')!;
  }

  contactForm = this.formBuilder.group({
    contactEmail: this.formBuilder.control('', Validators.required),
    datetime: this.formBuilder.control('', [Validators.required, dateInFuture()]),
    estimatedTime: this.formBuilder.control(30, Validators.required),
  })

  async onSubmit() {
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
    })
    if (error) {
      console.log(error);
    }
    let blob = new Blob([value!], { type: 'text/calendar;charset=utf-8' });
    saveAs(blob, 'neurorecovery_meeting.ics');


    this.receiverEmail = this.contactForm.value.contactEmail!;

    let emailRequest = {
      email: this.email,
      receiver_email: this.receiverEmail,
      ics_text: value!,
      session_id: localStorage.getItem('session_id')!,
    } as EmailRequest;

    try {
      await this.backendService.postSendEmail(emailRequest);
    } catch (e) {
      this.snackBar.open(errorMessages['failedCalendarFileSend'], '', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-warn'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      return;
    }

    this.snackBar.open(successMessages['calendarFileSent'], '', {
      duration: 3000,
      panelClass: ['mat-toolbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });

    await this.router.navigateByUrl('/scheduled-results', { state: { email: this.email, receiverEmail: this.receiverEmail } });
  }
}
