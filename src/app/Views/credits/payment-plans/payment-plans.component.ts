import { Component, OnInit } from '@angular/core';
import { CreditsService } from '../../../Services/credits/credits.service';
import { UtilsService } from '../../../Services/shared/utils.service';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { VouchersCreditsDto } from '../../../Services/credits/models/vouchers-credits-dto';
import { GlobalService } from '../../../Services/shared/global.service';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Roles } from '../../../Services/shared/enums/roles';
/* import { AccountDto } from 'src/app/Services/accounts/models/account-dto';
import { CreditsService } from 'src/app/Services/credits/credits.service';
import { VouchersCreditsDto } from 'src/app/Services/credits/models/vouchers-credits-dto';
import { AccountUse } from 'src/app/Services/shared/enums/account-use';
import { Roles } from 'src/app/Services/shared/enums/roles';
import { GlobalService } from 'src/app/Services/shared/global.service';
import { UtilsService } from 'src/app/Services/shared/utils.service'; */

@Component({
  selector: 'app-payment-plans',
  standalone: false,
  templateUrl: './payment-plans.component.html',
  styleUrls: ['./payment-plans.component.css'],
  providers: [CreditsService, UtilsService]
})
export class PaymentPlansComponent implements OnInit {
  sourceAccountDto!: AccountDto;
  types: string[] = ['A'];
  currencyAccount!: string;
  flagCurrency!: string;
  message!: string;
  emptyData: boolean = false;
  report!: Blob;
  isVisibleModal= false;
  isDisabledForm = false;
  request: VouchersCreditsDto = new VouchersCreditsDto();
  constructor(private creditsService: CreditsService, private utilsService: UtilsService, private messageService: GlobalService) {
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

  handleAccounts($event: any) {
    this.currencyAccount = $event.currencyDescription;
    this.request.accountNumber = $event.number;
    this.request.currency = $event.currency;
    this.creditsService.GetPaymentPlan(this.request).subscribe({next: resp => {
      if (resp.size === 0) {
        this.emptyData = false;
        this.message = 'No se encontraron registros en la cuenta ' + this.request.accountNumber;
      } else {
        this.emptyData = true;
        this.report = resp;
      }
    }, error: _err => {
      this.message = 'No se encontraron registros en la cuenta ' + this.request.accountNumber;
    }});
  }

  donwloadReport() {
    this.utilsService.donwloadReport('ComprobantePlanPagos.pdf' , this.report);
  }

  previewVist() {
    this.isVisibleModal = true;
    const iframe = document.querySelector('iframe');
    iframe!.src = URL.createObjectURL(this.report);
  }
}
