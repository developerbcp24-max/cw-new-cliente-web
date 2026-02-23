import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-information-panel',
  standalone: false,
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.css']
})
export class InformationPanelComponent implements OnInit {

  @Input() message: string | undefined | boolean;
  @Input() visible: boolean = true;
  @Input() type: string = 'information';
  constructor() {
    this.message = 'No existen datos para la operación';
  }
  ngOnInit(): void {
    // This is intentional
  }

}
