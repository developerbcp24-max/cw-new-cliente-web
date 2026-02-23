import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../../../../Services/api-info-enrequecida/models/ApiInfoEnrequecida';

@Component({
  selector: 'app-api-info-list',
  standalone: false,
  templateUrl: './api-info-list.component.html',
  styleUrls: ['./api-info-list.component.css']
})
export class ApiInfoListComponent implements OnInit {
  headers = {
    Col01: true,
    Col02: true,
    Col03: true,
    Col04: true,
    Col05: true,
    Col06: true,
    Col07: true,
    Col08: true,
    Col09: false,
    Col10: false,
  }!;

  @Input() responseData: Transaction[] = [];

  listResponseData: Transaction[] = [];

  pageSize = 5;
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  datereturn = '';


  formattedAccount!: string;
  isVisibleList = false;
  constructor() { // This is intentional
  }

  ngOnInit(): void {
    // This is intentional
  }

  handlePageChanged($event: number) {
    this.listResponseData = this.responseData.slice((($event - 1) * this.pageSize), this.pageSize * $event);
    this.listResponseData.length > 0 ? this.isVisibleList = true : this.isVisibleList = false;
  }
  handleViewRows($event: string) {
    this.pageSize = +$event;
    this.handlePageChanged(0);
  }
}
