import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreditsService } from '../../../../Services/credits/credits.service';
import { ConsultQuotaResult } from '../../../../Services/credits/models/consult-quota-result';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { AccountResult } from '../../../../Services/balances-and-movements/models/account-result';
import { ProcessBatchDto } from '../../../../Services/shared/models/process-batch';
import { GlobalService } from '../../../../Services/shared/global.service';
import { AccountUse } from '../../../../Services/shared/enums/account-use';
import { OperationType } from '../../../../Services/shared/enums/operation-type';
import { Roles } from '../../../../Services/shared/enums/roles';
import { ConsultQuotaDto } from '../../../../Services/credits/models/consult-quota-dto';
/* import { AccountDto } from 'src/app/Services/accounts/models/account-dto';
import { AccountResult } from 'src/app/Services/balances-and-movements/models/account-result';
import { CreditsService } from 'src/app/Services/credits/credits.service';
import { ConsultQuotaDto } from 'src/app/Services/credits/models/consult-quota-dto';
import { ConsultQuotaResult } from 'src/app/Services/credits/models/consult-quota-result';
import { AccountUse } from 'src/app/Services/shared/enums/account-use';
import { OperationType } from 'src/app/Services/shared/enums/operation-type';
import { Roles } from 'src/app/Services/shared/enums/roles';
import { GlobalService } from 'src/app/Services/shared/global.service';
import { ProcessBatchDto } from 'src/app/Services/shared/models/process-batch'; */

@Component({
  selector: 'app-quota-payment-detail',
  standalone: false,
  templateUrl: './quota-payment-detail.component.html',
  styleUrls: ['./quota-payment-detail.component.css'],
  providers: [CreditsService]
})
export class QuotaPaymentDetailComponent implements OnInit {

  quota: ConsultQuotaResult = new ConsultQuotaResult();
  quotaSelected: ConsultQuotaResult = new ConsultQuotaResult();
  creditAccountRequest: AccountDto = new AccountDto();
  accountSelected: AccountResult = new AccountResult();
  processBatchDto: ProcessBatchDto = new ProcessBatchDto();
  typesCredit: string[] = ['A'];
  isPayment = false;
  validate = false;
  validateSubmit = false;
  isDisabledForm = false;
  @Input() disabled = false;
  @Output() onSelected = new EventEmitter<ConsultQuotaResult>();

  constructor(private creditsService: CreditsService, private globalService: GlobalService) { }

  ngOnInit() {
    this.creditAccountRequest = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      operationTypeId: [OperationType.consultarCuentas],
      roleId: Roles.consultant,
      types: this.typesCredit
    });
  }

  handleCheckPayment() {
    if (this.isPayment) {
      this.quotaSelected = this.quota;
      this.quotaSelected.accountId = this.accountSelected.id;
    } else {
      this.quotaSelected = new ConsultQuotaResult();
    }
    this.onSelected.emit(this.quotaSelected);
  }

  handleAccountChanged($event: AccountResult) {
    this.accountSelected = $event;
  }

  handleSearchQuota() {
    this.validate = true;
    this.isPayment = false;
    this.quotaSelected = new ConsultQuotaResult();

    if (this.accountSelected.number) {
      const dto: ConsultQuotaDto = new ConsultQuotaDto();
      dto.account = this.accountSelected.number;
      this.creditsService.getQuotaPayment(dto)
        .subscribe({next: (res: ConsultQuotaResult) => {
          this.quota = res;
        }, error: _err => {
          this.globalService.danger('Error en el servicio', _err.message);
        }});
    }
  }

  handleValidate() {
    this.validate = true;
    this.validateSubmit = true;
    if (this.accountSelected.number && this.quotaSelected.amount) {
      return true;
    }
    return false;
  }
}

