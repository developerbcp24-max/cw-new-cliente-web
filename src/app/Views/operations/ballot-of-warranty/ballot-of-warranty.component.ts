import { Component, OnInit } from '@angular/core';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { BallotOfWarrantyService } from '../../../Services/ballot-of-warranty/ballot-of-warranty.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { UtilsService } from '../../../Services/shared/utils.service';
import { BallotOfWarrantyDto } from '../../../Services/ballot-of-warranty/models/ballot-of-warranty-dto';
import { Constants } from '../../../Services/shared/enums/constants';
import { UserService } from '../../../Services/users/user.service';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { ParametersResult } from '../../../Services/ballot-of-warranty/models/parameters-result';
import { RatesResult } from '../../../Services/ballot-of-warranty/models/rates-result';
import { DateRangeModel } from '../../shared/cw-components/date-range/date-range.component';
import { ExchangeRatesService } from '../../../Services/exchange-rates/exchange-rates.service';

@Component({
  selector: 'app-ballot-of-warranty',
  standalone: false,
  templateUrl: './ballot-of-warranty.component.html',
  styleUrls: ['./ballot-of-warranty.component.css'],
  providers: [BallotOfWarrantyService, UtilsService, ExchangeRatesService]
})
export class BallotOfWarrantyComponent implements OnInit {

  currentStep: number;
  batch!: number;
  nameC = 'D';
  nameD = 'E';
  nameBC!: string;

  ballot: BallotOfWarrantyDto = new BallotOfWarrantyDto();
  ballotSetp1: BallotOfWarrantyDto = new BallotOfWarrantyDto();
  ballotSetp2: BallotOfWarrantyDto = new BallotOfWarrantyDto();
  ballotSetp3: BallotOfWarrantyDto = new BallotOfWarrantyDto();
  rates: RatesResult = new RatesResult();
  parametersResult: ParametersResult = new ParametersResult();

  isSave = true;
  approversRequest = new InputApprovers();
  isVisibleToken = true;
  disabled = false;
  personType = true;

  dateRange: DateRangeModel = new DateRangeModel();

  constructor(private ballotOfWarrantyService: BallotOfWarrantyService, private messageService: GlobalService,
    private userService: UserService, private utilsService: UtilsService, private exchangeRatesService: ExchangeRatesService) {
    this.approversRequest = {
      operationTypeId: OperationType.boletaGarantia
    };
    this.ballot.typeBallot = true;
    this.ballot.statusRenovation = true;
    this.currentStep = 1;
    this.ballot.isLegalPerson = true;
    this.ballot.isPercent = true;
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.ballot.startDate = new Date();
    this.ballot.expirationDate = new Date();
    this.ballot.typeBallotOfWarranty = 'BDG';
    this.ballot.personType = 'PN';
    this.initBallot();
    this.ballotOfWarrantyService.getParameters().subscribe({next: resp => {
    this.parametersResult = resp;
    }, error: _err => this.messageService.info('Servicio de boletas de garantía', 'Por favor vuelva a intentarlo mas tarde.')});

    this.exchangeRatesService.getLastOne()
    .subscribe( response => this.ballot.saleExchangeRate = response.purchase);
  }

  handleTypeBallot($event: any) {
    this.ballot.typeBallot = $event;
  }

  initBallot() {
    const currentUser = this.userService.getUserToken();
    this.ballot.nameThirdPerson = currentUser.company_name;
    this.ballot.documentCIThirdPerson = currentUser.user_document_number;
  }

  handleRequiredRoe(): boolean {
    if (this.ballot.currency === Constants.currencyUsd) {
      return +this.ballot.amount <= +this.rates.amountRequiredRoe;
    } else if (this.ballot.currency === Constants.currencyBol) {
      return +this.utilsService.changeAmountBolToUsd(this.ballot.amount) <= +this.rates.amountRequiredRoe;
    }
    return false;
  }

  handleSave() {
    this.ballotOfWarrantyService.Save(this.ballot).subscribe({next: _resp => {
      //non implementation
    }, error: _err => this.messageService.info('Servicio de Boletas de Garantia', 'por favor vuelva a intentarlo mas tarde.')
  });
  }
  // --------------------------------------------------------
  handleChangeStep1($event: number) {
    this.batch = $event;
    this.currentStep = 2;
  }

  handleChangeStep2($event: number) {
    this.batch = $event;
    this.currentStep = 3;
  }

  handleChangeStep3($event: number) {
    this.batch = $event;
    this.currentStep = 4;
  }
  handleChangeStep4($event: any) {
    this.batch = $event;
    this.currentStep = 5;
  }

  handlePreviusForm($event: any) {
    this.currentStep = $event;
  }

  handlePreviusStep() {
    switch (this.currentStep) {
      case 2:
        this.handlePreviusForm(1);
        break;
      case 3:
        this.handlePreviusForm(2);
        break;
      case 4:
        this.handlePreviusForm(3);
        break;
      case 5:
        this.handlePreviusForm(4);
        break;
      default:
        this.currentStep = this.currentStep - 1;
        break;
    }
  }

  handleChangeRoe($event: any) {
    this.nameC = $event ? 'D' : 'C';
    this.nameD = $event ? 'E' : 'D';
    this.nameBC = $event ? ' - C' : '';
  }

  handleBallotDto($event: any) {
    this.ballotSetp1 = $event;
    this.ballotSetp2 = $event;
    this.ballotSetp3 = $event;
  }
}
