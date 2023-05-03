import { AbstractControl, ValidatorFn, ValidationErrors, FormControl } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class GroupErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);
    return invalidCtrl || invalidParent;
  }
}

export function confirmPasswordValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    let password = group.get('password')!.value;
    let confirmPassword = group.get('confirmPassword')!.value;
    if (password !== confirmPassword) {
      return { notMatching: true }
    }
    return null
  }
}

export function minimumPasswordRequirementsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let passwordControl = control as FormControl;
    let password = '';
    if (passwordControl.value != null) {
      password = passwordControl.value;
    }
    if (password.length < 8) {
      return { passwordNotMinimumLength: true }
    }
    return null
  }
}

export function isInteger(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let controlField = control as FormControl;
    if (!Number.isInteger(Number(controlField.value))) {
      return { mustBeInteger: true };
    }
    return null;
  }
}

export function dateInPast(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let dateField = control as FormControl;
    let asDate = new Date(dateField.value);
    let now = new Date();
    if (asDate > now) {
      return { dateInFuture: true };
    }
    return null;
  }
}

export function dateInFuture(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let dateField = control as FormControl;
    let asDate = new Date(dateField.value);
    let now = new Date();
    if (asDate < now) {
      return { dateInPast: true };
    }
    return null;
  }
}

export const errorMessages: { [key: string]: string } = {
  invalidLogin: "Incorrect email or password",
  invalidRegistration: "Registration failed - Please try again",
  mustBeValidEmail: "Must be a valid email",
  mustBeLoggedIn: "You must be logged in for this action",
  confirmPasswordNotMatching: "Passwords do not match",
  minimumPasswordLength: "Password must meet minimum length of 8",
  mustBeInteger: "Must be a whole number",
  dateCannotBeInFuture: "Date cannot be in the future",
  dateCannotBeInPast: "Date cannot be in the past",
  matlabFailedLaunch: "Matlab failed to launch",
  failedAddingPatient: "Failed to add patient",
  failedRemovingPatient: "Failed to remove patient",
  failedCalendarFileSend: "Failed to send calendar file",
  patientAlreadyAdded: "Patient already added",
  invalidTimerProvided: "Invalid timer provided",
}

export const successMessages: { [key: string]: string } = {
  successfulLogin: "Successful login",
  successfulRegistration: "Successful registration",
  successfulFormSubmission: "Successful form submission",
  successfulFormUpdate: "Successfully updated form",
  finishedExercises: "Successfully finished exercise session",
  matlabSuccessfulLaunch: "Matlab has been launched",
  calendarFileSent: "Calendar file sent",
  removedPatient: "Successfully removed patient",
  addedPatient: "Successfully added patient",
}
