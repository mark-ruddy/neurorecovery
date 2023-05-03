import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExercisesService } from '../services/exercises.service';

@Component({
  selector: 'app-instant-ul',
  templateUrl: './instant-ul.component.html',
  styleUrls: ['./instant-ul.component.scss']
})
export class InstantUlComponent implements OnInit, OnDestroy {
  public timer = 60;
  public note = '';

  constructor(public exercisesService: ExercisesService) { }

  ngOnInit(): void {
    this.exercisesService.fill_external_values("Instant Upper Limb", this.timer, this.note);
    this.exercisesService.exerciseTimes = [
      { StartTime: 46, EndTime: 84 },
      { StartTime: 90, EndTime: 121 },
      { StartTime: 127, EndTime: 148 },
      { StartTime: 156, EndTime: 179 },
      { StartTime: 215, EndTime: 238 },
      { StartTime: 240, EndTime: 269 },
    ];
  }

  ngOnDestroy(): void {
    this.exercisesService.resetState();
  }

  onTimerChange(value: string) {
    this.timer = parseInt(value);
    this.exercisesService.fill_external_values("Instant Upper Limb", this.timer, this.note);
  }

  onNoteChange(value: string) {
    this.note = value;
    this.exercisesService.fill_external_values("Instant Hand", this.timer, this.note);
  }
}
