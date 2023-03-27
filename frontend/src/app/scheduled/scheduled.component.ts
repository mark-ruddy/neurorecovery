import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { successMessages } from '../helpers/custom-validators';
import { Router } from '@angular/router';

import { SES } from 'aws-sdk';
import * as MailComposer from 'nodemailer/lib/mail-composer';

import * as ics from 'ics';

@Component({
  selector: 'app-scheduled',
  templateUrl: './scheduled.component.html',
  styleUrls: ['./scheduled.component.scss']
})
export class ScheduledComponent implements OnInit {
  email = '';
  receiverEmail = '';

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private snackBar: MatSnackBar, private router: Router) { }

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

    this.snackBar.open(successMessages['finishedExercises'], '', {
      duration: 3000,
      panelClass: ['mat-toolbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
    this.receiverEmail = this.contactForm.value.contactEmail!;

    /*
    let ses = new SES();
    let charset = "UTF-8";
    let body = 'Hello,\n\nYou have been invited to attend a NeuroRecovery App meeting by ' + this.email + '. You can import the attached ICS file into a calendar app such as Microsoft Teams or Google Calendar)\n\nBest regards,\nNeuroRecovery App';
    let params: SendEmailRequest = {
      Source: "neurorecovery@protonmail.com",
      Destination: {
        ToAddresses: [
          this.email,
          this.receiverEmail,
        ]
      },
      Message: {
        Subject: {
          Data: "NeuroRecovery Meeting",
          Charset: charset,
        },
        Body: {
          Text: {
            Data: body,
            Charset: charset
          },
        }
      },
      Attachments: [
        {
          Filename: 'neurorecovery_meeting.ics',
          Content: Buffer.from(value!).toString('base64'),
          ContentType: 'text/calendar; charset=utf-8; method=REQUEST'
        }
      ]
    }
    */

    const ses = new SES();
    let body = 'Hello,\n\nYou have been invited to attend a NeuroRecovery App meeting by ' + this.email + '. You can import the attached ICS file into a calendar app such as Microsoft Teams or Google Calendar)\n\nBest regards,\nNeuroRecovery App';
    const mailOptions = {
      from: "neurorecovery@protonmail.com",
      to: [this.email, this.receiverEmail],
      subject: "NeuroRecovery Meeting",
      text: body,
      attachments: [
        {
          filename: 'neurorecovery_meeting.ics',
          content: value,
          contentType: 'text/calendar; charset=utf-8; method=REQUEST'
        }
      ]
    };
    const mail = new MailComposer(mailOptions);
    mail.compile().build((err: any, message: any) => {
      if (err) {
        console.log(err);
        return;
      }

      const params = {
        RawMessage: { Data: message },
        Destinations: [this.email, this.receiverEmail],
        Source: "neurorecovery@protonmail.com"
      };

      ses.sendRawEmail(params, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(data);
      });
    });

    this.router.navigateByUrl('/scheduled-result', { state: { email: this.email, receiverEmail: this.receiverEmail } });
  }
}
