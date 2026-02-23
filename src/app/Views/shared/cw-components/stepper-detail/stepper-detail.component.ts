import { Component, OnInit, Input, SimpleChanges, AfterContentInit, OnChanges, ContentChildren, QueryList } from '@angular/core';
import { StepComponent } from '../step/step.component';

@Component({
  selector: 'app-stepper-detail',
  standalone: false,
  templateUrl: './stepper-detail.component.html',
  styleUrls: ['./stepper-detail.component.css']
})
export class StepperDetailComponent implements OnInit, AfterContentInit, OnChanges {

  offset!: number;
  col!: number;
  @Input() currentStep!: number;
  @ContentChildren(StepComponent) steps!: QueryList<StepComponent>;

  constructor() {/*This is intentional*/ }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes.currentStep !== undefined && !changes.currentStep.isFirstChange()) {
      this.changeStep();
    }
  }

  ngAfterContentInit() {
    this.changeStep();
  }

  changeStep() {
    if (this.steps) {
      if (this.currentStep <= this.steps.length && this.currentStep > 0) {
        this.selectStep(this.steps.toArray()[this.currentStep - 1]);
        this.setSizes(this.steps.length);
      }
    }
  }
  selectStep(step: StepComponent) {
    this.steps.toArray().forEach(x => { x.active = false; });
    this.steps.toArray().forEach(x => { x.currentSelected = false; });
    for (let index = 0; index < this.currentStep; index++) {
      this.steps.toArray()[index].active = true;
    }
    this.steps.toArray()[this.currentStep - 1].currentSelected = true;
  }

  setSizes(length: any) {
    if (length === 1) {
      this.col = 12;
    } else if (length === 2) {
      this.col = 10;
    } else if (length === 3) {
      this.col = 8;
    } else if (length === 4) {
      this.col = 6;
    } else if (length === 5) {
      this.col = 4;
    } else if (length === 6) {
      this.col = 2;
    } else if (length > 6) {
      this.col = 2;
    }
  }

}
