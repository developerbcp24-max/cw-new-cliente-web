import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-group-content',
  standalone: false,
  templateUrl: './button-group-content.component.html',
  styleUrls: ['./button-group-content.component.css']
})
export class ButtonGroupContentComponent {
  @Input('contentTitle') title: string = '';
  @Input() active!: boolean;
  @Input() disabled!: boolean;
  @Input() template: any;
  @Input() dataContext: any;
  @Input() code: any;
  index!: number;
}
