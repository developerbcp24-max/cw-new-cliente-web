import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CheckResult } from '../../../../Services/checks/models/check-result';
import { ChecksService } from '../../../../Services/checks/checks.service';
import { CheckDto } from '../../../../Services/checks/models/check-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UtilsService } from '../../../../Services/shared/utils.service';

@Component({
  selector: 'app-list-check-sent',
  standalone: false,
  templateUrl: './list-check-sent.component.html',
  styleUrls: ['./list-check-sent.component.css'],
  providers: [ChecksService, UtilsService]
})
export class ListCheckSentComponent implements OnInit {

  pageSize = 25;
  rowsPerPage: number[] = [10, 15, 20, 25];
  checkList: CheckResult[] = [];

  @Input() checks: CheckResult[] = [];
  @Output() onSubmit = new EventEmitter<CheckDto>();

  constructor(private checksService: ChecksService, private globalService: GlobalService, private utilsService: UtilsService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    /*This is intentional*/
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleShowDetails(_idCheck: any) {
    const dataReport: CheckDto = new CheckDto();
    dataReport.idCheck = _idCheck;

    this.checksService.getImage(dataReport)
      .subscribe({next: (resp: CheckResult) => {
        this.onSubmit.emit(resp);
      }, error: _err => this.globalService.danger('Fallo del Servicio checks.getImage: ', _err.message)});
  }

  handlePageChanged($event: number) {
    this.checkList = this.checks.slice((($event - 1) * this.pageSize), this.pageSize * $event);
  }

  handleViewRows($event: string) {
    this.pageSize = +$event;
    this.handlePageChanged(0);
  }

  handleDownload(_idCheck: any) {
    const dataReport: CheckDto = new CheckDto();
    dataReport.idCheck = _idCheck;
    this.checksService.getReportCheck(dataReport)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport('ComprobanteCheque.pdf', resp);
      }, error: _err => this.globalService.warning('Fallo del Servicio: ', _err.message)});

  }

}
