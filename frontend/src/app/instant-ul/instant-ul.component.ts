import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExercisesService } from '../services/exercises.service';

@Component({
  selector: 'app-instant-ul',
  templateUrl: './instant-ul.component.html',
  styleUrls: ['./instant-ul.component.scss']
})
export class InstantUlComponent implements OnInit, OnDestroy {
  constructor(public exerciseService: ExercisesService) { }

  ngOnInit(): void {
    this.exerciseService.exerciseTimes = [
      { StartTime: 4, EndTime: 8 },
      { StartTime: 10, EndTime: 16 },
      { StartTime: 44, EndTime: 55 },
    ];
  }

  ngOnDestroy(): void {
    this.exerciseService.resetState();
  }
}
