import { AbstractControl, ValidatorFn, FormArray, ValidationErrors, FormControl } from "@angular/forms";
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

export const errorMessages: { [key: string]: string } = {
  invalidLogin: "Incorrect email or password",
  mustBeValidEmail: "Must be a valid email",
  confirmPasswordNotMatching: "Passwords do not match",
  minimumPasswordLength: "Password must meet minimum length of 8",
  mustBeInteger: 'Must be a whole number',
}

export const snackbarMessages: { [key: string]: string } = {
  mustBeLoggedIn: "Must be logged in for that action",
  successfulLogin: "Successful login",
  failedLogin: "Login failed - Please try again",
  successfulRegistration: "Successful registration",
  failedRegistration: "Registration failed - Please try again",
}
