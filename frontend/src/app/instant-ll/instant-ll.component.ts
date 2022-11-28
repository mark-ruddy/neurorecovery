import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExercisesService } from '../services/exercises.service';

@Component({
  selector: 'app-instant-ll',
  templateUrl: './instant-ll.component.html',
  styleUrls: ['./instant-ll.component.scss']
})
export class InstantLlComponent implements OnInit, OnDestroy {

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
