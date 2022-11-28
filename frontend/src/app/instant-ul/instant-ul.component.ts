import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { successMessages } from '../helpers/custom-validators';

export interface TimeSet {
  StartTime: number,
  EndTime: number,
}

@Component({
  selector: 'app-instant-ul',
  templateUrl: './instant-ul.component.html',
  styleUrls: ['./instant-ul.component.scss']
})
export class InstantUlComponent implements OnInit {
  preload: string = 'auto';
  api = new VgApiService;
  started = false;

  timePerExercise = 3;
  timerCurrent = 0;
  timerFinished = true;
  interval: any = null;

  exerciseIndex = 0;
  exerciseTimes: Array<TimeSet> = [
    { StartTime: 4, EndTime: 8 },
    { StartTime: 10, EndTime: 16 },
    { StartTime: 18, EndTime: 25 },
  ];
  onLastExercise = false;
  highestCompletedExerciseIndex = 0;

  constructor(private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }

  startTimer() {
    if (!this.timerFinished) {
      return;
    }
    this.timerFinished = false;
    this.timerCurrent = this.timePerExercise;
    this.interval = setInterval(() => {
      if (this.timerCurrent > 0) {
        this.timerCurrent--;
      } else {
        this.timerFinished = true;
        this.timerCurrent = 0;
        if (this.exerciseIndex > this.highestCompletedExerciseIndex) {
          this.highestCompletedExerciseIndex = this.exerciseIndex;
        }
        return;
      }
    }, 1000)
  }

  resetTimer() {
    clearInterval(this.interval);
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;

    // Add subscribed bindings for the player here
    this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(
      () => {
        if (this.api.getDefaultMedia().currentTime >= this.exerciseTimes[this.exerciseIndex].EndTime) {
          // instead of pausing here rewind to the start of the exercise to simulate a looped video
          this.playCurrentExercise();
        }
      }
    );
  }

  start() {
    this.started = true;
    this.startTimer();
    this.playCurrentExercise();
  }

  playCurrentExercise() {
    this.api.getDefaultMedia().currentTime = this.exerciseTimes[this.exerciseIndex].StartTime;
    this.api.getDefaultMedia().play();
  }

  next() {
    console.log(this.exerciseIndex);
    console.log(this.highestCompletedExerciseIndex);
    if (this.exerciseIndex < (this.exerciseTimes.length - 1)) {
      this.exerciseIndex += 1;
      if (this.exerciseIndex > this.highestCompletedExerciseIndex) {
        this.resetTimer();
        this.startTimer();
      }
      this.playCurrentExercise();
      if (this.exerciseIndex == (this.exerciseTimes.length - 1)) {
        this.onLastExercise = true;
      }
    } else {
      this.snackBar.open(successMessages['finishedExercises'], '', {
        duration: 3000,
        panelClass: ['mat-toolbar'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      // TODO: now need to probably route to success page and send the stats back to backend server
      this.router.navigate(['instant']);
    }
  }

  back() {
    if (this.exerciseIndex > 0) {
      this.timerFinished = true;
      this.exerciseIndex -= 1;
      this.playCurrentExercise();
    }
    this.onLastExercise = false;
  }

  playPause() {
    this.api.getDefaultMedia().pause();
    if (this.api.getDefaultMedia().canPlay) {
      this.api.getDefaultMedia().play();
    }
  }
}
