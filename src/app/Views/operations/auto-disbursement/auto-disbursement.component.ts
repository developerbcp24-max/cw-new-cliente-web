import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../../Services/accounts/accounts.service';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { Roles } from '../../../Services/shared/enums/roles';
import { UtilsService } from '../../../Services/shared/utils.service';
import { CurrencyAndAmount } from '../../../Services/transfers/models/currency-and-amount';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';

@Component({
  selector: 'app-auto-disbursement',
  standalone: false,
  templateUrl: './auto-disbursement.component.html',
  styleUrls: ['./auto-disbursement.component.css'],
  providers: [AccountsService, UtilsService]
})
export class AutoDisbursementComponent implements OnInit {
  amount!: number;
  currency!: string;
  approversRequest: InputApprovers = new InputApprovers();
  accountRequest: AccountDto = new AccountDto();
  request: AccountDto = new AccountDto();


  constructor(/*non implementation*/) {

    this.accountRequest = {
      accountUse: 'D',
      roleId: 4,
      operationTypeId: [OperationType.formularioSolicitud],
      types: ['P']
    };
  }

  ngOnInit() {

    this.approversRequest = {
      operationTypeId: OperationType.boletaGarantia,
    };
    this.request = {
      accountUse: 'D',
      operationTypeId: [18],
      roleId: Roles.authorizer,
      types: ['P']
    };
  }

  handleCurrencyAndAmountChanged($event: CurrencyAndAmount) {
    this.currency = $event.currency;
    this.amount = $event.amount;
  }
  reload() {
    window.location.reload();
  }
}
