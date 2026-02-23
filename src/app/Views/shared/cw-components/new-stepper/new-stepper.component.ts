import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnChanges, OnInit, Output, QueryList } from '@angular/core';
import { NewStepComponent } from '../new-step/new-step.component';
import { StepRegisterComponent } from '../../../admin/components/step-register/step-register.component';

@Component({
  selector: 'app-new-stepper',
  standalone: false,
  templateUrl: './new-stepper.component.html',
  styleUrl: './new-stepper.component.css'
})
export class NewStepperComponent implements AfterContentInit, OnChanges {
  @Input() currentStep!: number;
  @Input() showPreviousStep: boolean = false;
  @Output() onPreviousStep = new EventEmitter();
  @ContentChildren(StepRegisterComponent) steps!:
    | QueryList<StepRegisterComponent>
    | any;

  offset!: number;
  col!: number;

  ngOnChanges(changes: any): void {
    if (
      changes.currentStep !== undefined &&
      !changes.currentStep.isFirstChange()
    ) {
      this.changeStep();
    }
  }

  ngAfterContentInit() {
    this.changeStep();
  }

  changeStep() {
    if (this.steps) {
      if (this.currentStep <= this.steps.length && this.currentStep > 0) {
        this.selectStep();
        this.setSizes(this.steps.length);
      }
    }
  }

  selectStep() {
    this.steps.toArray().forEach((x: StepRegisterComponent) => {
      x.active = false;
    });
    this.steps.toArray().forEach((x: StepRegisterComponent) => {
      x.currentSelected = false;
    });
    for (let index = 0; index < this.currentStep; index++) {
      this.steps.toArray()[index].active = true;
    }
    this.steps.toArray()[this.currentStep - 1].currentSelected = true;
  }

  setSizes(length: any) {
    if (length <= 2) {
      this.col = 3;
      this.offset = 3;
    } else if (length <= 3) {
      this.col = 4;
      this.offset = 0;
    } else if (length <= 4) {
      if (this.showPreviousStep) {
        this.col = 2;
        this.offset = 2;
      } else {
        this.col = 3;
        this.offset = 0;
      }
    } else if (length <= 5) {
      this.col = 2;
      this.offset = 1;
    } else if (length <= 6) {
      this.col = 2;
      this.offset = 0;
    } else if (length <= 8) {
      this.col = 1;
      this.offset = 2;
    } else if (length <= 10) {
      this.col = 1;
      this.offset = 1;
    } else if (length <= 12) {
      this.col = 1;
      this.offset = 0;
    }
  }

  handlePreviousStep() {
    this.onPreviousStep.emit();
  }
}
