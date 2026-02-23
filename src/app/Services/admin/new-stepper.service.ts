import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewStepperService {
  private stepperSource = new BehaviorSubject(0);
  currentStepper = this.stepperSource.asObservable();

  constructor() { }

  changeStepper(index: number) {
    this.stepperSource.next(index);
  }
}
