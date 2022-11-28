import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { successMessages } from '../helpers/custom-validators';

export interface TimeSet {
  StartTime: number,
  EndTime: number,
}


@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

  constructor(private snackBar: MatSnackBar, private router: Router) { }

  preload: string = 'auto';
  api = new VgApiService;
  started = false;

  timePerExercise = 3;
  timerCurrent = 0;
  timerFinished = true;
  interval: any = null;

  exerciseIndex = 0;
  exerciseTimes = new Array<TimeSet>;
  onLastExercise = false;
  highestCompletedExerciseIndex = 0;

  // Possibly better way to do this
  resetState() {
    this.resetTimer();
    this.preload = 'auto';
    this.api = new VgApiService;
    this.started = false;
    this.timePerExercise = 3;
    this.timerCurrent = 0;
    this.timerFinished = true;
    this.interval = null;
    this.exerciseIndex = 0;
    this.exerciseTimes = new Array<TimeSet>;
    this.onLastExercise = false;
    this.highestCompletedExerciseIndex = 0;
  }

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
    this.resetTimer();
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
      this.resetState();
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
