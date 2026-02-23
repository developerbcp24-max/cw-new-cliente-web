
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransaccionDetail } from '../../../../Services/qr/models/ReportQRResponse';

@Component({
  selector: 'app-qr-list-bcp',
  standalone: false,
  templateUrl: './qr-list-bcp.component.html',
  styleUrls: ['./qr-list-bcp.component.css']
})
export class QrListBcpComponent implements OnInit {

  headers = {
    Col01: true,
    Col02: true,
    Col03: true,
    Col04: true,
    Col05: true,
    Col06: true,
    Col07: true,
    Col08: true,
    Col09: true,
    Col10: true,
    Col11: true,
  }!;
  pageSize = 10;
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  formattedAccount!: string;
  @Input() isVisibleList = false;

  @Input() responseData: TransaccionDetail[] = [];
  @Output() search: EventEmitter<TransaccionDetail[]> = new EventEmitter();

  @Output() isVisibleRep: EventEmitter<boolean> = new EventEmitter()

  listResponseData: TransaccionDetail[] = [];
  constructor() { // This is intentional
  }

  ngOnInit(): void {
    // This is intentional
  }


  handlePageChanged($event: number) {
    this.listResponseData = this.responseData.slice((($event - 1) * this.pageSize), this.pageSize * $event);
    this.responseData.length > 0 ? this.isVisibleList = true : this.isVisibleList = false;
  }
  handleViewRows($event: string) {
    this.pageSize = +$event;
    this.handlePageChanged(0);
  }
}
