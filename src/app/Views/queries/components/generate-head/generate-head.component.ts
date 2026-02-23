import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { OperationMessageIniModel } from '../../../../Services/historical-accounts/models/OperationMessageIniModel';
import { AccountIni } from '../../../../Services/historical-accounts/models/AccountIni';
import { AccountPartialModel } from '../../../../Services/historical-accounts/models/AccountPartialModel';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { GlobalService } from '../../../../Services/shared/global.service';
import { DatePipe } from '@angular/common';
import { HistoricalAccountsService } from '../../../../Services/historical-accounts/historical-accounts.service';
import { MovAccountsDto } from '../../../../Services/historical-accounts/models/MovAccountsDto';
import { NumberRowAccount } from '../../../../Services/historical-accounts/models/NumberRowAccountModel';
import { NumberRowModel } from '../../../../Services/historical-accounts/models/NumberRowModel';
import { HistoricalBasic } from '../../../../Services/historical-accounts/models/historical-basic';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { AccountUse } from '../../../../Services/shared/enums/account-use';
import { OperationType } from '../../../../Services/shared/enums/operation-type';
import { Roles } from '../../../../Services/shared/enums/roles';
import { MonthsDto } from '../../../../Services/historical-accounts/models/months-dto';
import { MonthsResult } from '../../../../Services/historical-accounts/models/months-result';

@Component({
  selector: 'app-generate-head',
  standalone: false,
  templateUrl: './generate-head.component.html',
  styleUrls: ['./generate-head.component.css'],
  providers: [HistoricalAccountsService]
})
export class GenerateHeadComponent implements OnInit, OnChanges {
  public MonthDoce: MonthsResult[] = [];
  public MonthSelected: MonthsResult = new MonthsResult();
  public message: OperationMessageIniModel[] = [];
  public message2!: string;
  private messageModel: OperationMessageIniModel = new OperationMessageIniModel();

  public accountIni: AccountIni = new AccountIni();
  public AccountSelected: AccountPartialModel= new AccountPartialModel();
  public ModelMonth: MonthsDto =  new MonthsDto();


  sourceAccountRequest: AccountDto = new AccountDto();
  types: string[] = ['P'];
  typeOperation = 12;
  isvalidTemp!: boolean;
  miModel: MovAccountsDto= new MovAccountsDto();
  public dataIniAccountNumber: NumberRowAccount = new NumberRowAccount();
  public resultRow: NumberRowModel = new NumberRowModel();
  historicalbasic!: HistoricalBasic;
  @Input() valueGlobal: boolean;
  @Output() isVisiblePanelBody= new EventEmitter<boolean>();
  @Output() movementAccountDto= new EventEmitter<MovAccountsDto>();
  @Output() accountSourceDetail= new EventEmitter<AccountPartialModel>();

  ok!: boolean;
  public val1 = true;
  public val2 = false;
  private selectedLink!: string;
  public DateIniHead: Date = new Date();
  public DateEndHead: Date = new Date();


  public myDatePickerOptionsIni: IMyDpOptions = {
    editableDateField: false,
    openSelectorOnInputClick: true,
    dateFormat: 'yyyy-mm-dd',
    inline: false,
    showTodayBtn: true,
    showWeekNumbers: true,
    disableUntil : { year: new Date().getFullYear() - 1  , month: new Date().getMonth() + 1, day: new Date().getDate() - 1 } ,
    disableSince : { year: new Date().getFullYear() , month: new Date().getMonth() + 1 , day: new Date().getDate() + 1  }
  };
  public myDatePickerOptionsEnd: IMyDpOptions = {
    editableDateField: false,
    openSelectorOnInputClick: true,
    dateFormat: 'yyyy-mm-dd',
    inline: false,
    showTodayBtn: true,
    showWeekNumbers: true,
    disableUntil : { year: new Date().getFullYear() - 1  , month: new Date().getMonth() + 1, day: new Date().getDate() - 1 },
    disableSince : { year: new Date().getFullYear() , month: new Date().getMonth() + 1 , day: new Date().getDate() + 1  }
  };



  public DDateIniHeadateEndHead!: Date;
  public DateIniHeadStr!: string;
  public DateEndHeadStr!: string;

  constructor(private _HistoricalAccountsService: HistoricalAccountsService,
    private messageService: GlobalService) {
      this.valueGlobal = false;

    }
ngOnChanges() {

}
  ngOnInit() {
    this.sourceAccountRequest = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.consultant,
      operationTypeId: [OperationType.consultarCuentas],
      types: this.types
    });
    this.valueGlobal = false;

    this.ModelMonth.numberMonths = 12;
    this._HistoricalAccountsService.getMonth(this.ModelMonth).
    subscribe({next: response => {
        this.MonthDoce = response;
        this.MonthSelected = this.MonthDoce[0];
      }, error: _err => this.messageService.warning('', _err.message)});
      this.accountIni.OperationTypeId = [this.typeOperation];
      this.isvalidTemp = false;
  }

  setradio(e: string): void {
    this.selectedLink = e;
    switch (e) {
      case 'optFec':
        this.val1 = true;
        this.val2 = false;
        this.isVisiblePanelBody.emit(false);
        this.DateIniHeadStr = '';
        this.DateEndHeadStr = '';
        break;
      case 'optMes':
        this.val1 = false;
        this.val2 = true;
        this.isVisiblePanelBody.emit(false);
        this.handleChangedDrpMonth(this.MonthSelected);
        break;
    }
  }

  transform(value: string): string {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'yyyy-mm-dd')!;
    return value;
  }
  isSelected(name: string): boolean {
    if (!this.selectedLink) {
      return false;
    }
    return this.selectedLink === name;
  }
  handleChangedDrpMonth(model: MonthsResult) {
    this.DateIniHeadStr = model.firstDay;
    this.DateEndHeadStr = model.lastDay;
  }

  handleChangedDrpAccount() {

  }

  getDate2Str(fecha: Date): any {
      if (fecha != null) {
      let returnDate = '';
      let diaSt = '';
      let mesSt = '';
      let today = new Date();
      // split
      today = fecha;
      const dd = today.getDate();
      const mm = today.getMonth() + 1;
      const yyyy = today.getFullYear().toString();
      if (dd < 10) {
          diaSt = `0${dd}`;
      } else {
          diaSt = `${dd}`;
      }
      if (mm < 10) {
          mesSt = `0${mm}`;
      } else {
          mesSt = `${mm}`;
      }
        returnDate = yyyy + '-' + mesSt + '-' + diaSt;
        return returnDate;
      }
  }

handleChangeDPIni(event: any): void {
  this.DateIniHead = event;
  this.DateIniHeadStr = this.getDate2Str(this.DateIniHead);
}
handleChangeDPEnd (event: IMyDateModel | any): void {
  this.DateEndHead = event;
  this.DateEndHeadStr = this.getDate2Str(this.DateEndHead);
}
handleReportH() {
  if (this.val1) {
    this.isVisiblePanelBody.emit(false);
     if (this.DateIniHeadStr) {
          this.miModel.DateIni = this.DateIniHeadStr;
        if (this.DateEndHeadStr) {
              this.miModel.DateEnd = this.DateEndHeadStr;
            if (this.AccountSelected.number) {
              if (this.miModel.DateIni <= this.miModel.DateEnd ) {
                    this.miModel.NumberCta = this.AccountSelected.number;
                    this.miModel.FormattedAccount = this.AccountSelected.formattedNumber;
                    this.callNumberReg(this.miModel);
              } else {
                this.messageService.info('', 'La fecha inicial no puede ser mayor a la fecha final.');
              }
            } else {
              this.messageService.info('', 'Debe escoger una cuenta.');
            }
        } else {
          this.messageService.info('', 'Debe escoger una fecha final.');
        }
     } else {
      this.messageService.info('', 'Debe escoger una fecha de inicio.');
     }
  } else if (this.val2) {
        this.isVisiblePanelBody.emit(false);
        if (this.AccountSelected.number) {
            if (this.MonthSelected.firstDay && this.MonthSelected.lastDay) {
              this.miModel.DateIni = replaceAll(this.DateIniHeadStr, '/', '-');
              this.miModel.DateEnd = replaceAll(this.DateEndHeadStr, '/', '-');
              this.miModel.NumberCta = this.AccountSelected.number;
              this.miModel.FormattedAccount = this.AccountSelected.formattedNumber;
              this.callNumberReg(this.miModel);
            } else {
                this.messageService.info('', 'Debe escoger un mes.');
            }
        } else {
            this.messageService.info('', 'Debe escoger una cuenta.');
        }
  }
}
callNumberReg(miModel: MovAccountsDto) {
      this.historicalbasic = new HistoricalBasic();
      this.historicalbasic.numberAccount = miModel.NumberCta;
      this.historicalbasic.dateInitial = miModel.DateIni;
      this.historicalbasic.dateEnd = miModel.DateEnd;
      let numberReg = 0;
      this._HistoricalAccountsService.getNumberRowAccounts(this.historicalbasic)
            .subscribe({next: (response: NumberRowModel) => {
              this.resultRow = response;
              numberReg = this.resultRow.numberRow;
              if (numberReg > 0) {
                  this.isVisiblePanelBody.emit(true);
                  miModel.NumberRow = this.resultRow.numberRow;
                  this.movementAccountDto.emit(miModel);
              }
            }, error: _err => this.messageService.warning('', 'No existen movimientos.')});
            if ( numberReg === 0) {
              this.isVisiblePanelBody.emit(false);
            }
  }

  handleSourceAccountChanged($event: any) {
    this.AccountSelected = $event;
    this.accountSourceDetail.emit(this.AccountSelected);
  }
}

function replaceAll(str: any, find: any, replace: any) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
function escapeRegExp(str: any) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
