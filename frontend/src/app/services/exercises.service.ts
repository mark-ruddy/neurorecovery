import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { successMessages } from '../helpers/custom-validators';
import { BackendService } from './backend.service';
import { LoginService } from './login.service';

export interface TimeSet {
  StartTime: number,
  EndTime: number,
}


@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

  constructor(private snackBar: MatSnackBar, private router: Router, private backendService: BackendService, private loginService: LoginService) { }

  preload: string = 'auto';
  api = new VgApiService;
  started = false;
  startEpoch = 0;

  timePerExercise = 1;
  timerCurrent = 0;
  timerFinished = true;
  interval: any = null;

  exerciseIndex = 0;
  exerciseTimes = new Array<TimeSet>;
  onLastExercise = false;
  highestCompletedExerciseIndex = 0;

  // external values
  kind = "";
  // exercise session values
  datetime = "";
  totalTimeTakenSecs = 0;
  numExercisesCompleted = 0;

  ngOnInit(): void { }

  resetState() {
    this.resetTimer();
    this.preload = 'auto';
    this.api = new VgApiService;
    this.started = false;
    this.startEpoch = 0;
    this.timePerExercise = 3;
    this.timerCurrent = 0;
    this.timerFinished = true;
    this.interval = null;
    this.exerciseIndex = 0;
    this.exerciseTimes = new Array<TimeSet>;
    this.onLastExercise = false;
    this.highestCompletedExerciseIndex = 0;
  }

  start() {
    this.started = true;

    this.startEpoch = new Date().getTime();
    this.datetime = new Date().toLocaleString();
    this.numExercisesCompleted = this.exerciseTimes.length;

    this.resetTimer();
    this.startTimer();
    this.playCurrentExercise();
  }

  fill_external_values(kind: string) {
    this.kind = kind;
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
    this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(
      () => {
        if (this.api.getDefaultMedia().currentTime >= this.exerciseTimes[this.exerciseIndex].EndTime) {
          this.playCurrentExercise();
        }
      }
    );
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
      // Code execution reaches here when user finishes session
      this.exit()
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

  exit() {
    if (this.loginService.isLoggedIn()) {
      // if user is logged in then send back details of completed session
      this.totalTimeTakenSecs = (new Date().getTime() - this.startEpoch) / 1000;
      this.totalTimeTakenSecs = Math.round(this.totalTimeTakenSecs);

      this.backendService.postExerciseSession({
        kind: this.kind,
        datetime: this.datetime,
        total_time_taken_secs: this.totalTimeTakenSecs.toString(),
        num_exercises_completed: this.numExercisesCompleted.toString(),
        email: localStorage.getItem('email')!,
        session_id: localStorage.getItem('session_id')!,
      })
    }

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
