import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-step',
  standalone: false,
  templateUrl: './new-step.component.html',
  styleUrl: './new-step.component.css'
})
export class NewStepComponent implements OnInit {

  @Input() title: string = '';
  @Input() active = false;
  @Input() currentSelected = false;
  constructor() { /*This is intentional*/}

  ngOnInit(): void {
    // This is intentional
  }
}
