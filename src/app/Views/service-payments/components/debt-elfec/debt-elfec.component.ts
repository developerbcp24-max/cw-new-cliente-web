import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ElfecDebtResponse } from '../../../../Services/elfec/models/elfec-debt-response';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ElfecPaymentDto } from '../../../../Services/elfec/models/elfec-payment-dto';

@Component({
  selector: 'app-debt-elfec',
  standalone: false,
  templateUrl: './debt-elfec.component.html',
  styleUrls: ['./debt-elfec.component.css']
})
export class DebtElfecComponent implements OnInit {

  amount = 0;
  itemSelected!: boolean;
  @Input() detailElfec!: ElfecDebtResponse;
  @Input() disabled!: boolean;
  elfecQuotas: ElfecPaymentDto[] = [];
  isValidDebt = false;
  @Output() onChange: EventEmitter<any>;

  constructor(private messageService: GlobalService) {
    this.onChange = new EventEmitter();
  }

  ngOnInit() {
    this.amount = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.detailElfec != undefined) {
      this.handleElfecAmountChecked();
    }
  }

  handleValidateDebt(debt: any) {
    for (let i = 0; i < this.detailElfec.quotas.length; i++) {
      if (debt.expirationDate > this.detailElfec.quotas[i].expirationDate) {
        if (this.elfecQuotas.length === 0) {
          this.isValidDebt = true;
          return;
        }
        for (let j = 0; j < this.elfecQuotas.length; j++) {
          if (debt.expirationDate < this.elfecQuotas[j].expirationDate) {
            this.isValidDebt = true;
            return;
          }
        }
      }
    }
  }

  handleElfecAmountChecked() {
    this.elfecQuotas = [];
    for (let debt of this.detailElfec.quotas) {
        debt.selected = true;
        this.elfecQuotas.push(new ElfecPaymentDto({
          totalConsumption: this.detailElfec.totalConsumption,
          totalGeneral: this.detailElfec.totalGeneral,
          queryCode: this.detailElfec.queryCode,
          companyCode: this.detailElfec.companyCode.trim(),
          serviceCode: this.detailElfec.serviceCode,
          amount: debt.amount,
          clientName: this.detailElfec.clientName,
          companyName: this.detailElfec.companyName,
          trace: this.detailElfec.trace,
          expirationDate: debt.expirationDate,
          quotaNumber: debt.quotaNumber,
          address: debt.message
        }));
    }
    this.amount = Math.round((this.elfecQuotas.reduce((sum, item) => sum + item.amount, 0)) * 1e12) / 1e12;
    this.onChange.emit(this.elfecQuotas);
  }

}
