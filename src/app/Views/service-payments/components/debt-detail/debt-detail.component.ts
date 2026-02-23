import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CreSaguapacDebt } from '../../../../Services/service-payments/models/cre-saguapac-debt';
import { GlobalService } from '../../../../Services/shared/global.service';
import { CreSaguapacPayment } from '../../../../Services/service-payments/models/service-payment';
import { GetDebtsResult } from '../../../../Services/epsas/models/get-debts-result';
import { ServicesPasePaymentDto } from '../../../../Services/service-pase/models/services-pase-payment-dto';

@Component({
  selector: 'app-debt-detail',
  standalone: false,
  templateUrl: './debt-detail.component.html',
  styleUrls: ['./debt-detail.component.css']
})
export class DebtDetailComponent implements OnInit {

  isPayment = false;
  lastChecked: number;
  lastCheckedPase: number;
  amount = 0;
  creSaguapacPayments: CreSaguapacPayment[] = [];
  epsasPaymentDto: ServicesPasePaymentDto[] = [];
  @Input() creSaguapacDebt!: CreSaguapacDebt;
  @Input() delapazDebt!: GetDebtsResult | any;
  @Input() paseDebt!: GetDebtsResult;
  @Input() service!: string;
  @Input() disabled!: boolean;
  @Output() onChange: EventEmitter<any>;

  constructor(private messageService: GlobalService) {
    this.onChange = new EventEmitter();
    this.lastChecked = -1;
    this.lastCheckedPase = 0;
  }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.amount = 0;
    this.creSaguapacPayments = [];
    this.epsasPaymentDto = [];
    if (this.paseDebt === undefined || this.paseDebt === null) {
      this.paseDebt = undefined!;
    } else {
      this.paseDebt = this.paseDebt.quotas.length > 0 ? this.paseDebt : undefined!;
    }
  }

  handleCreSaguapacAmountChecked(debt: any) {
    if ((debt.selected && debt.id === this.lastChecked + 1) || (!debt.selected && debt.id === this.lastChecked)) {
      if (!debt.selected) {
        this.lastChecked--;
        this.creSaguapacPayments.pop();
      } else {
        this.lastChecked++;
        this.creSaguapacPayments.push({
          code: this.creSaguapacDebt.code,
          name: this.creSaguapacDebt.name,
          serviceTypeId: this.service,
          period: debt.period,
          amount: debt.amount,
          documentNumber: debt.documentNumber
        });
      }
      this.amount = Math.round((this.creSaguapacPayments.reduce((sum, item) => sum + item.amount, 0)) * 1e12) / 1e12;
      this.onChange.emit(this.creSaguapacPayments);
    } else {
      this.messageService.info('Selección incorrecta de deuda', 'Debe seleccionar las deudas pasadas.');
      setTimeout(() => { debt.selected = !debt.selected; }, 70);
    }
  }

  handleDelapazAmountChecked(debt: any) {
    this.amount = debt.selected ? debt.amount : 0;
    this.paseDebt.serviceCodeDescription = null!;
    this.handleAddDebts(debt);
    this.onChange.emit(this.epsasPaymentDto);
  }

  handleEpsasAmountChecked(debt: any) {
    this.handleAddDebts(debt);
    this.amount = Math.round((this.epsasPaymentDto.reduce((sum, item) => sum + item.amount, 0)) * 1e12) / 1e12;
    this.onChange.emit(this.epsasPaymentDto);
  }

  handleAddDebts(debt: any) {
    if ((debt.selected && debt.quotaNumber === this.lastCheckedPase + 1) || (!debt.selected && debt.quotaNumber === this.lastCheckedPase)) {
      if (!debt.selected) {
        this.lastCheckedPase--;
        this.epsasPaymentDto.pop();
      } else {
        this.lastCheckedPase++;
        this.epsasPaymentDto.push({
          totalConsumption: this.paseDebt.totalConsumption!,
          totalGeneral: this.paseDebt.totalGeneral!,
          queryCode: this.paseDebt.queryCode!,
          companyCode: this.paseDebt.companyCode!.trim(),
          serviceCode: this.paseDebt.serviceCode!.trim(),
          serviceCodeDescription: this.paseDebt.serviceCodeDescription!,
          amount: debt.amount,
          clientName: this.paseDebt.clientName!,
          companyName: this.paseDebt.companyName!,
          information: debt.message,
          trace: this.paseDebt.trace!,
          expirationDate: debt.expirationDate,
          quotaNumber: debt.quotaNumber,
          address: this.paseDebt.quotas.length > 0 ? this.paseDebt.quotas[0].message : ''
        });
      }
    }
    else {
      this.messageService.info('Selección incorrecta de deuda', 'Debe seleccionar las deudas pasadas.');
      setTimeout(() => { debt.selected = !debt.selected; }, 70);
    }

  }
}
