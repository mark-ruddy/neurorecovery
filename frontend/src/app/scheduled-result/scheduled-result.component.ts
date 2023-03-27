import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ScheduledComponent } from '../scheduled/scheduled.component';

export interface ScheduledResult {
  email: string,
  receiverEmail: string,
}

@Component({
  selector: 'app-scheduled-result',
  templateUrl: './scheduled-result.component.html',
  styleUrls: ['./scheduled-result.component.scss']
})
export class ScheduledResultComponent implements OnInit {
  state: Observable<ScheduledComponent> = <any>{};
  email = '';
  receiverEmail = '';

  constructor(public activatedRouted: ActivatedRoute) { }

  ngOnInit(): void {
    this.state = this.activatedRouted.paramMap.pipe(map(() => window.history.state))
    this.state.subscribe((result: ScheduledResult) => {
      this.email = result.email;
      this.receiverEmail = result.receiverEmail;
    });
  }
}
