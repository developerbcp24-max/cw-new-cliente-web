import { Component, OnInit, Input } from '@angular/core';
import { LimitsService } from '../../../../Services/limits/limits.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { CompanyLimitsResult } from '../../../../Services/limits/models/company-limits-result';

@Component({
  selector: 'app-depecrated-company-limits',
  standalone: false,
  templateUrl: './depecrated-company-limits.component.html',
  styleUrls: ['./depecrated-company-limits.component.css'],
  providers: [LimitsService]
})
export class DepecratedCompanyLimitsComponent implements OnInit {

  limits: CompanyLimitsResult = new CompanyLimitsResult();
  @Input() isVisible: boolean;
  @Input() showAuthorizerLimit = false;

  constructor(private limitsService: LimitsService,
    private messageService: GlobalService) {
    this.isVisible = true;
  }

  ngOnInit() {
    this.limitsService.getCompanyLimits()
      .subscribe({next: response => this.limits = response,
        error: _err => this.messageService.info('Servicio de límites', _err.message)});
  }

}
