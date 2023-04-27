import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExercisesService } from '../services/exercises.service';

@Component({
  selector: 'app-instant-hand',
  templateUrl: './instant-hand.component.html',
  styleUrls: ['./instant-hand.component.scss']
})
export class InstantHandComponent implements OnInit, OnDestroy {
  public timer = 60;

  constructor(public exercisesService: ExercisesService) { }

  ngOnInit(): void {
    this.exercisesService.fill_external_values("Instant Hand", this.timer);
    this.exercisesService.exerciseTimes = [
      { StartTime: 11, EndTime: 46 },
      { StartTime: 47, EndTime: 96 },
      { StartTime: 97, EndTime: 148 },
      { StartTime: 149, EndTime: 233 },
      { StartTime: 234, EndTime: 305 },
      { StartTime: 306, EndTime: 384 },
      { StartTime: 386, EndTime: 464 },
      { StartTime: 465, EndTime: 587 },
    ];
  }

  ngOnDestroy(): void {
    this.exercisesService.resetState();
  }

  onTimerChange(value: string) {
    this.timer = parseInt(value);
    this.exercisesService.fill_external_values("Instant Hand", this.timer)
  }
}
