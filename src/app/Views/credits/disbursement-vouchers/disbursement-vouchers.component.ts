import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CreditsService } from '../../../Services/credits/credits.service';
import { UtilsService } from '../../../Services/shared/utils.service';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { VouchersCreditsDto } from '../../../Services/credits/models/vouchers-credits-dto';
import { GetPaymentListCreditResult } from '../../../Services/credits/models/get-payment-list-credit-result';
import { GlobalService } from '../../../Services/shared/global.service';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Roles } from '../../../Services/shared/enums/roles';
/* import { AccountDto } from 'src/app/Services/accounts/models/account-dto';
import { CreditsService } from 'src/app/Services/credits/credits.service';
import { GetPaymentListCreditResult } from 'src/app/Services/credits/models/get-payment-list-credit-result';
import { VouchersCreditsDto } from 'src/app/Services/credits/models/vouchers-credits-dto';
import { AccountUse } from 'src/app/Services/shared/enums/account-use';
import { Roles } from 'src/app/Services/shared/enums/roles';
import { GlobalService } from 'src/app/Services/shared/global.service';
import { UtilsService } from 'src/app/Services/shared/utils.service'; */

@Component({
  selector: 'app-disbursement-vouchers',
  standalone: false,
  templateUrl: './disbursement-vouchers.component.html',
  styleUrls: ['./disbursement-vouchers.component.css'],
  providers: [CreditsService, UtilsService]
})
export class DisbursementVouchersComponent implements OnInit {
  sourceAccountDto!: AccountDto;
  types: string[] = ['A'];
  currencyAccount!: string;
  flagCurrency!: string;
  message!: string;
  emptyData = false;
  isVisibleModal = false;
  report!: Blob;
  request: VouchersCreditsDto = new VouchersCreditsDto();
  response: GetPaymentListCreditResult[] = [];
  responsePerPage: GetPaymentListCreditResult[] = [];

  rowsPerPage: number[] = [10, 15, 20, 25];
  pageItems: number = 10;
  totalResponse!: number;

  constructor(private creditsService: CreditsService, private utilsService: UtilsService, private messageService: GlobalService,
    private cdRef: ChangeDetectorRef) {
    this.request.typeReport = false;
  }

  ngOnInit() {
    this.sourceAccountDto = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.consultant,
      applicationTypes: ['COL'],
      types: this.types
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleAccounts($event: any) {
    this.currencyAccount = $event.currencyDescription;
    this.request.accountNumber = $event.number;
    this.request.currency = $event.currency;
    this.creditsService.GetDisbursements(this.request).subscribe({next: resp => {
      this.response = resp;
      this.responsePerPage = this.response;
      this.totalResponse = resp.length;
      this.emptyData = false;
    }, error: _err => {
      this.emptyData = true;
      this.message = 'No se encontraron registros en la cuenta ' + this.request.accountNumber;
    }});
  }

  donwloadDetail($eventDate: string, $eventHour: string) {
    this.request.movementDate = $eventDate;
    this.request.movementHour = $eventHour;
    this.request.typeReport = false;
    this.creditsService.GetDisbursementsHeaderReport(this.request).subscribe({next: resp => {
      const extension = this.request.typeReport ? '.xls' : '.pdf';
      this.utilsService.donwloadReport('Desembolso' + extension, resp);
    }, error: _err => this.messageService.danger('No se pudo generar el reporte: ', _err.message)});
  }

  seeDetail($eventDate: string, $eventHour: string) {
    this.request.movementDate = $eventDate;
    this.request.movementHour = $eventHour;
    this.request.typeReport = false;
    this.creditsService.GetDisbursementsHeaderReport(this.request).subscribe({next: resp => {
      this.isVisibleModal = true;
      this.report = resp;
      const iframe = document.querySelector('iframe');
      iframe!.src = URL.createObjectURL(resp);
    }, error: _err => this.messageService.danger('No se pudo generar el reporte: ', _err.message)});
  }

  downloadReport() {
    this.utilsService.donwloadReport('Desembolso.pdf', this.report);
  }

  handleExportList() {
    this.creditsService.GetDisbursementsListReport(this.request).subscribe({next: resp => {
      const extension = this.request.typeReport ? '.xls' : '.pdf';
      this.utilsService.donwloadReport('ComprobanteDesembolsoDeCredito' + extension, resp);
    }, error: _err => this.messageService.danger('No se pudo generar el reporte: ', _err.message)});
  }

  handlePageChanged($event: any) {
    this.response = this.responsePerPage.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }

}
