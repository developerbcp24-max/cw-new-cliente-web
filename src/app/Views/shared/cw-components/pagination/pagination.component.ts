import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() totalItems = 0;
  @Input() maxSize = 10;
  @Input() returnFirstChange = true;
  @Input() isCenter = true;
  @Input() rowsPerPage: number[] = [];
  @Output() onChange = new EventEmitter();
  @Output() onChangeRowsPerPage = new EventEmitter();
  rowsPerPageSelected!: number;
  currentPage = 0;

  totalPages: any;
  increase = 1;
  maxNumberPages = 0;
  constructor() {
    /*This is intentional*/
  }

  ngOnInit() {
    this.rowsPerPageSelected = this.maxSize;
  }

  ngOnChanges() {
    this.maxNumberPages = Math.ceil(this.totalItems / this.maxSize);
    this.totalPages = new Array(this.maxNumberPages > 5 ? 5 : this.maxNumberPages);
    this.currentPage = this.totalPages.length > 0 ? 1 : 0;
    this.increase = 1;
    if (this.returnFirstChange) {
      this.onChange.emit(this.currentPage);
    }
  }

  handleChangePage($number: number) {
    this.update($number);
  }

  handleNext() {
    this.update(this.currentPage + 1);
  }

  handlePrev() {
    this.update(this.currentPage - 1);
  }

  update(numberPage: number) {
    if (numberPage > 0 && numberPage <= this.maxNumberPages) {
      if (numberPage > 3 && numberPage < this.maxNumberPages - 1) {
        this.increase = (numberPage - 2);
      } else if (numberPage <= 3) {
        this.increase = 1;
      } else if (numberPage === this.maxNumberPages - 1) {
        this.increase = (numberPage - 3);
      }
      this.currentPage = numberPage;
      this.onChange.emit(this.currentPage);
    }
  }

  reset() {
    this.ngOnChanges();
  }

  handleChangeRowsPerPage() {
    this.onChangeRowsPerPage.emit(this.rowsPerPageSelected);
  }

}
