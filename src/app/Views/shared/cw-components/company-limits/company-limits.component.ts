import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LimitsService } from '../../../../Services/limits/limits.service';
import { CompanyLimitsResult } from '../../../../Services/limits/models/company-limits-result';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UserService } from '../../../../Services/users/user.service';
/* import { LimitsService } from 'src/app/Services/limits/limits.service';
import { CompanyLimitsResult } from 'src/app/Services/limits/models/company-limits-result';
import { GlobalService } from 'src/app/Services/shared/global.service';
import { UserService } from 'src/app/Services/users/user.service'; */

@Component({
  selector: 'app-company-limits',
  standalone: false,
  templateUrl: './company-limits.component.html',
  styleUrls: ['./company-limits.component.css'],
  providers: [LimitsService]
})
export class CompanyLimitsComponent implements OnInit, OnChanges {
  limits: CompanyLimitsResult = new CompanyLimitsResult();
  @Input() isVisible: boolean;
  @Input() isVisibleLimit: boolean;
  @Input() showAuthorizerLimit = false;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter();
  user: any;
  existAutorizer: boolean;
  userRoles: string;

  constructor(private limitsService: LimitsService, private userService: UserService,
    private messageService: GlobalService) {
    this.isVisible = false;
    this.isVisibleLimit = false;
    this.user = this.userService.getUserToken();
    this.userRoles = this.user.role.toString();
    this.existAutorizer = this.userRoles.includes('AUTORIZADOR') ? true : false;
  }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (this.existAutorizer && this.isVisible) {
      this.limitsService.getCompanyLimits()
        .subscribe({next: response => this.limits = response,
          error: err => this.messageService.info('Servicio de límites', err.message)});
    }
    if (this.existAutorizer && this.isVisibleLimit) {
      this.limitsService.getCompanyLimits()
        .subscribe({next: response => this.limits = response,
          error: err => this.messageService.info('Servicio de límites', err.message)});
    }
  }

  handleOnClose() {
    this.onClose.emit(false);
  }

}
