import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-depecrated-information-panel',
  standalone: false,
  templateUrl: './depecrated-information-panel.component.html',
  styleUrls: ['./depecrated-information-panel.component.css']
})
export class DepecratedInformationPanelComponent implements OnInit {

  @Input() message: string;
  @Input() visible = true;
  @Input() type: string = 'information';
  constructor() {
    this.message = 'No existen datos para la operación';
  }

  ngOnInit() {
    /*This is intentional*/
  }

}
