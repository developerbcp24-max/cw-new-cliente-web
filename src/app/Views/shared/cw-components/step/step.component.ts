import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-step',
  standalone: false,
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent implements OnInit {

  @Input() title: string = '';
  @Input() active = false;
  @Input() currentSelected = false;
  constructor() { /*This is intentional*/}

  ngOnInit(): void {
    // This is intentional
  }

}
