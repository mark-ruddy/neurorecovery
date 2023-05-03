import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { VgApiService, VgStates } from '@videogular/ngx-videogular/core';
import { errorMessages, successMessages } from '../helpers/custom-validators';
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

  timePerExercise = 3;
  timerCurrent = 0;
  timerFinished = true;
  interval: any = null;

  sectionStartTime = 0;
  sectionEndTime = 0;
  timeSpentInSections: number[] = [];

  exerciseIndex = 0;
  exerciseTimes = new Array<TimeSet>;
  onLastExercise = false;
  highestCompletedExerciseIndex = 0;
  timerOnNextExercise = 0;

  // external values
  kind = "";
  // exercise session values
  datetime = "";
  totalTimeTakenSecs = 0;
  numExercisesCompleted = 0;
  note = '';

  ngOnInit(): void { }

  resetState() {
    this.resetTimer(true);
    this.preload = 'auto';
    this.api = new VgApiService;
    this.started = false;
    this.startEpoch = 0;
    this.timePerExercise = 3;
    this.timerCurrent = 0;
    this.timerFinished = true;
    this.interval = null;
    this.sectionStartTime = 0;
    this.sectionEndTime = 0;
    this.timeSpentInSections = [];
    this.exerciseIndex = 0;
    this.exerciseTimes = new Array<TimeSet>;
    this.onLastExercise = false;
    this.highestCompletedExerciseIndex = 0;
    this.timerOnNextExercise = 0;
  }

  start() {
    // first check that the timer provided is valid
    if (!Number.isInteger(this.timePerExercise) || this.timePerExercise <= 0) {
      this.snackBar.open(errorMessages['invalidTimerProvided'], '', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-warn'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      return;
    }

    this.started = true;

    this.startEpoch = new Date().getTime();
    this.datetime = new Date().toLocaleString();
    this.numExercisesCompleted = this.exerciseTimes.length;
    for (let i = 0; i < this.exerciseTimes.length; i++) {
      this.timeSpentInSections.push(0);
    }

    this.resetTimer(true);
    this.startTimer(false, null);
    this.playCurrentExercise(true);
  }

  fill_external_values(kind: string, timer: number | null, note: string) {
    this.kind = kind;
    if (timer != null) {
      this.timePerExercise = timer;
    }
    this.note = note;
  }

  startTimer(alwaysSet: boolean, customTimer: number | null) {
    console.log("Start timer called with: ", this.timerFinished, " ", customTimer);
    if (!this.timerFinished && !alwaysSet) {
      return;
    }
    if (!alwaysSet && customTimer == null) {
      this.timerFinished = false;
      this.timerCurrent = this.timePerExercise;
    }
    if (!alwaysSet && customTimer != null) {
      this.timerFinished = false;
      this.timerCurrent = customTimer;
    }
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

  resetTimer(andTime: boolean) {
    if (andTime) {
      this.timerCurrent = 0;
    }
    clearInterval(this.interval);
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;
    this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(
      () => {
        if (this.api.getDefaultMedia().currentTime >= this.exerciseTimes[this.exerciseIndex].EndTime) {
          this.playCurrentExercise(false);
        }
      }
    );
  }

  playCurrentExercise(setStartTime: boolean) {
    if (setStartTime) {
      this.sectionStartTime = new Date().getTime();
    }
    console.log("section start time: ", this.sectionStartTime)
    this.api.getDefaultMedia().currentTime = this.exerciseTimes[this.exerciseIndex].StartTime;
    this.api.getDefaultMedia().play();
  }

  next() {
    this.sectionEndTime = new Date().getTime();
    console.log("section end time: ", this.sectionEndTime)

    this.timeSpentInSections[this.exerciseIndex] += (this.sectionEndTime - this.sectionStartTime) / 1000;
    console.log("Next adding to index: ", this.exerciseIndex, " ", (this.sectionEndTime - this.sectionStartTime) / 1000)

    if (this.exerciseIndex < (this.exerciseTimes.length - 1)) {
      this.exerciseIndex += 1;
      if (this.exerciseIndex > this.highestCompletedExerciseIndex) {
        this.resetTimer(true);
        if (this.timerOnNextExercise != 0) {
          this.startTimer(false, this.timerOnNextExercise);
          this.timerOnNextExercise = 0;
        } else {
          this.startTimer(false, null);
        }
      }

      this.playCurrentExercise(true);
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
      this.sectionEndTime = new Date().getTime();

      this.timeSpentInSections[this.exerciseIndex] += (this.sectionEndTime - this.sectionStartTime) / 1000;
      console.log("Back adding to index: ", this.exerciseIndex, " ", (this.sectionEndTime - this.sectionStartTime) / 1000)

      if (this.exerciseIndex - 1 == this.highestCompletedExerciseIndex) {
        this.timerOnNextExercise = this.timerCurrent;
      }
      this.timerFinished = true;
      this.resetTimer(true);

      this.exerciseIndex -= 1;
      this.playCurrentExercise(true);
    }
    this.onLastExercise = false;
  }

  playPause() {
    if (this.api.state === VgStates.VG_PLAYING) {
      this.api.pause();
      this.resetTimer(false);
    } else {
      this.api.play();
      this.startTimer(true, null);
    }
  }

  exit() {
    console.log("Seconds serialised: ", this.serialiseTimeSpentInSections())
    if (this.loginService.isLoggedIn()) {
      // if user is logged in then send back details of completed session
      this.totalTimeTakenSecs = (new Date().getTime() - this.startEpoch) / 1000;
      this.totalTimeTakenSecs = Math.round(this.totalTimeTakenSecs);

      this.backendService.postExerciseSession({
        kind: this.kind,
        datetime: this.datetime,
        total_time_taken_secs: this.totalTimeTakenSecs.toString(),
        num_exercises_completed: this.numExercisesCompleted.toString(),
        serialised_time_spent_in_secs: this.serialiseTimeSpentInSections(),
        note: this.note,
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

  serialiseTimeSpentInSections(): string {
    console.log("timeSpentInSections: ", this.timeSpentInSections);
    let serialised = "";
    if (this.timeSpentInSections) {
      for (let i = 0; i < this.timeSpentInSections.length; i++) {
        if (this.timeSpentInSections[i] !== undefined) {
          let roundedTimeSpentInSection = Math.round(this.timeSpentInSections[i] * 100) / 100;
          serialised += roundedTimeSpentInSection.toString();
          if (i < (this.timeSpentInSections.length - 1)) {
            serialised += ",";
          }
        }
      }
    }
    console.log("serialised: ", serialised);
    return serialised;
  }
}
