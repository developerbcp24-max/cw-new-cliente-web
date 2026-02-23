import { Component, OnInit, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { SearchCreditCardsComponent } from '../components/search-credit-cards/search-credit-cards.component';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Roles } from '../../../Services/shared/enums/roles';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { UserService } from '../../../Services/users/user.service';


@Component({
  selector: 'app-credit-cards',
  standalone: false,
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.css']
})
export class CreditCardsComponent implements OnInit {

  constructor(private userService: UserService) { }
  request!: AccountDto;
  types: string[] = ['A'];
  applicationTypes: string[] = ['TRJ'];
  ngOnInit() {
    this.userService.getValidateCurrentUser();
      this.request = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.consultant,
      operationTypeId: [OperationType.consultarCuentas],
      applicationTypes: this.applicationTypes,
      types: this.types
    });
  }
}
