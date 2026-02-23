import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr-search-bcp',
  standalone: false,
  templateUrl: './qr-search-bcp.component.html',
  styleUrls: ['./qr-search-bcp.component.css']
})
export class QrSearchBcpComponent implements OnInit {

  @Input() labelKey = 'label';
  @Input() idKey = 'id';
  @Input() options = [];

  originalOptions!: any;
  model!: any;

  constructor() {/*This is intentional*/ }


  ngOnInit(): void {
    this.originalOptions = [...this.options];
    if (this.model !== undefined) {
      this.model = this.options.find(
        currentOption => currentOption[this.idKey] === this.model
      );
    }
  }

  get label() {
    return this.model ? this.model[this.labelKey] : 'Select...';
  }
}
