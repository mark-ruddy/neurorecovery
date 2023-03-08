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
    this.exerciseService.fill_external_values("Instant Lower Limb");
    this.exerciseService.exerciseTimes = [
      { StartTime: 46, EndTime: 80 },
      { StartTime: 88, EndTime: 111 },
      { StartTime: 116, EndTime: 157 },
      { StartTime: 159, EndTime: 178 },
      { StartTime: 187, EndTime: 231 },
      { StartTime: 240, EndTime: 284 },
      { StartTime: 330, EndTime: 357 },
    ];
  }

  ngOnDestroy(): void {
    this.exerciseService.resetState();
  }
}
