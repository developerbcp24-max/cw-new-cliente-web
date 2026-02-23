import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnChanges, OnInit, Output, QueryList } from '@angular/core';
import { NewStepComponent } from '../new-step/new-step.component';
import { StepComponent } from '../step/step.component';

@Component({
  selector: 'app-stepper',
  standalone: false,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent implements OnInit, AfterContentInit, OnChanges {

  offset!: number;
  col!: number;
  @Input() currentStep!: number;
  @Input() showPreviusStep = false;
  @Output() onPreviusStep = new EventEmitter();
  allSteps: any[] = [];

  // Agregar { descendants: true } puede ayudar en Angular 19
  @ContentChildren(NewStepComponent, { descendants: true }) steps!: QueryList<NewStepComponent>;
  //@ContentChildren(StepComponent) steps1!: QueryList<StepComponent> |any;
  @ContentChildren(StepComponent, { descendants: true })steps1!: QueryList<StepComponent>;

  constructor() {/*This is intentional*/ }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: any): void {
    if (changes['currentStep'] !== undefined && !changes['currentStep'].isFirstChange()) {
      this.changeStep();
    }
  }

  ngAfterContentInit() {
    // Usar setTimeout para asegurar que el contenido esté completamente inicializado
    setTimeout(() => {
      this.changeStep();
    });
  }

  /* changeStep() {
    if (this.steps && this.steps.length > 0) {
      if (this.currentStep <= this.steps.length && this.currentStep > 0) {
        this.selectStep(this.steps.toArray()[this.currentStep - 1]);
        this.setSizes(this.steps.length);
      }
    }
  } */
 changeStep() {
  this.allSteps = [...this.steps.toArray(), ...this.steps1.toArray()];

  if (this.allSteps.length === 0) return;

  if (this.currentStep > 0 && this.currentStep <= this.allSteps.length) {
    this.selectStep(this.allSteps[this.currentStep - 1], this.allSteps);
    this.setSizes(this.allSteps.length);
  }
}


  /* selectStep(step: NewStepComponent) {
    this.steps.toArray().forEach((x: NewStepComponent) => { x.active = false; });
    this.steps1.toArray().forEach((x: StepComponent) => { x.active = false; });
    this.steps.toArray().forEach((x: NewStepComponent) => { x.currentSelected = false; });
    this.steps1.toArray().forEach((x: StepComponent) => { x.currentSelected = false; });
    for (let index = 0; index < this.currentStep; index++) {
      this.steps.toArray()[index].active = true;
    }
    this.steps.toArray()[this.currentStep - 1].currentSelected = true;
  } */
 selectStep(step: any, allSteps: any[]) {

  // limpiar estados
  allSteps.forEach(s => {
    s.active = false;
    s.currentSelected = false;
  });

  // activar todos los anteriores
  for (let i = 0; i < this.currentStep; i++) {
    allSteps[i].active = true;
  }

  // marcar seleccionado actual
  allSteps[this.currentStep - 1].currentSelected = true;
}


  setSizes(length: number) {
    if (length <= 2) {
      this.col = 3;
      this.offset = 3;
    } else if (length <= 4) {
      this.col = 2;
      this.offset = 1;
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

  handlePreviusStep() {
    this.onPreviusStep.emit();
  }
}
