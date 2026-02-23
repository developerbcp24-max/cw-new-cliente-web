import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ComponentFactoryResolver, SimpleChanges } from '@angular/core';
import { GlobalService } from '../../../../Services/shared/global.service';
import { NgForm } from '@angular/forms';
import { GetDebtsResult } from '../../../../Services/epsas/models/get-debts-result';
import { ServicesResult } from '../../../../Services/service-pase/models/services-result';
import { ServicePaseService } from '../../../../Services/service-pase/service-pase.service';
import { SaveFavorite } from '../../../../Services/shared/models/save-favorite';
import { FavoriteServicesPaseResult } from '../../../../Services/service-pase/models/favorite-services-pase-result';
import { FavoriteServicesPaymentDto } from '../../../../Services/service-pase/models/favorite-services-payment-dto';
import { IdDto } from '../../../../Services/shared/models/id-dto';
import { ServiceTypes } from '../../../../Services/shared/enums/service-types';
import { GetDebtsDto } from '../../../../Services/service-pase/models/get-debts-dto';
import { GetDebtsClientEntelDto } from '../../../../Services/telephone-services/models/get-debts-client-entel-dto';
import { TelephoneServicesService } from '../../../../Services/telephone-services/telephone-services.service';
import { FavoriteEntelResult } from '../../../../Services/telephone-services/models/favorite-entel-result';
import { FavoriteServicesByIdResult } from '../../../../Services/telephone-services/models/favorite-services-by-id-result';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { TigoPaymentsService } from '../../../../Services/tigo-payments/tigo-payments.service';
import { GetTigoDebtsDto } from '../../../../Services/tigo-payments/models/get-tigo-debts-dto';
import { FavoriteTigoResult } from '../../../../Services/tigo-payments/models/favorite-tigo-result';
import { FavoriteTigoByIdResult } from '../../../../Services/tigo-payments/models/favorite-tigo-by-id-result';

@Component({
  selector: 'app-payment-type',
  standalone: false,
  templateUrl: './payment-type.component.html',
  styleUrls: ['./payment-type.component.css'],
  providers: [ServicePaseService, TelephoneServicesService, TigoPaymentsService]
})
export class PaymentTypeComponent implements OnInit {

  selectedPayment: ServicesResult = new ServicesResult();
  getDebtsDto: GetDebtsDto = new GetDebtsDto();
  detail: any;
  listParameters = [];
  @Input() disabled!: boolean;
  @Input() typeService = 0;
  @Input() listCriteria!: any[];
  @Input() isDelapaz = false;
  @Input() isEntel = false;
  @Input() isTigo = false;
  @Input() isWater = false;
  @Output() onChangeDebts: EventEmitter<any>;
  @Output() onFavoriteChanged: EventEmitter<SaveFavorite> = new EventEmitter();
  @Output() onChange: EventEmitter<any>;
  @Output() onChangePaymentType: EventEmitter<boolean>;
  @ViewChild('epsasForm') epsasForm!: NgForm;
  @ViewChild('saveFavoriteForm') saveFavoriteForm!: NgForm;
  //--ENTEL------------------
  geDebtsEntelDto: GetDebtsClientEntelDto = new GetDebtsClientEntelDto();
  //----------------------------
  // TIGO
  amountsPrePago: any = [];
  selectedAmount = 0;
  getTigoDebtsDto: GetTigoDebtsDto = new GetTigoDebtsDto();
  //--------------------
  parameterCode!: string;
  showSaveFavoriteForm = false;
  existFavorites = false;
  favorite: SaveFavorite = new SaveFavorite();
  listFavorite: any;
  getDebtRequest: GetDebtsDto = new GetDebtsDto();
  getTigoDebtRequest: FavoriteTigoByIdResult = new FavoriteTigoByIdResult();
  favoriteItem: any;
  selectedFavorite = false;
  favoriteId!: number;
  existDebts = true;

  constructor(private paseService: ServicePaseService, private globalService: GlobalService,
    private telephoneServicesService: TelephoneServicesService, private paramService: ParametersService,
    private tigoPaymentsService: TigoPaymentsService) {
    this.onChange = new EventEmitter();
    this.onChangeDebts = new EventEmitter();
    this.onChangePaymentType = new EventEmitter();
    this.selectedPayment = undefined!;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.disabled) {
      if (this.isEntel) {
        this.handleGetFavoriteEntel();
      } else if (this.isTigo) {
        this.handleGetFavoriteTigo();
        this.amountsPrePago = [];
      }
    }
  }

  handlePaymentType() {
    this.listParameters = [];
    this.detail = new GetDebtsResult();
    this.selectedFavorite = false;
    this.favoriteItem = undefined;
    this.parameterCode = undefined!;
    this.amountsPrePago = [];
    this.existDebts = true;
    if (this.isEntel || this.isTigo) {
      this.onChangePaymentType.emit(true);
    }
  }

  handleChangeInput() {
    this.detail = new GetDebtsResult();
    this.selectedFavorite = false;
    this.favoriteItem = undefined;
    this.existDebts = true;
  }

  handleShowFavorite() {
    this.globalService.validateAllFormFields(this.epsasForm.form);
    if (this.epsasForm.valid) {
      this.showSaveFavoriteForm = true;
    }
  }

  handelResetForm() {
    this.favoriteItem = undefined;
    this.selectedFavorite = false;
    this.selectedPayment = undefined!;
    this.detail = undefined;
    this.existDebts = true;
    this.parameterCode = undefined!;
  }

  handleGetFavorite($event: any) {
    if ($event !== undefined) {
      this.handelResetForm();
      this.paseService.getFavorite(new FavoriteServicesPaymentDto({ companyCode: $event.toString() }))
        .subscribe({next: (response: FavoriteServicesPaseResult[]) => {
          this.listFavorite = response;
          this.existFavorites = this.listFavorite.length > 0 ? true : false;
        }, error:error => { this.globalService.info('Favoritos: ', 'No se pudo obtener Favoritos'); }});
    }
  }

  handleGetFavoriteEntel() {
    this.handelResetForm();
    this.telephoneServicesService.getFavorites()
      .subscribe({next: (response: FavoriteEntelResult[]) => {
        this.listFavorite = response;
        this.existFavorites = this.listFavorite.length > 0 ? true : false;
      }, error: _err => { this.globalService.info('Favoritos: ', 'No se pudo obtener Favoritos'); }});
  }

  handleGetFavoriteTigo() {
    this.handelResetForm();
    this.tigoPaymentsService.getFavorites()
      .subscribe({next: (response: FavoriteTigoResult[]) => {
        this.listFavorite = response;
        this.existFavorites = this.listFavorite.length > 0 ? true : false;
      }, error: _err => { this.globalService.info('Favoritos: ', 'No se pudo obtener Favoritos'); }});
  }

  handleGetFavoriteByTigo($event: IdDto) {
    this.detail = undefined;
    this.favoriteId = $event.id;
    this.tigoPaymentsService.getFavorite(new IdDto({ id: $event.id }))
      .subscribe({next: (response: any) => {
        this.selectedFavorite = true;
        this.getTigoDebtRequest = response;
        this.selectedPayment = this.listCriteria.filter(x => x.serviceCode === this.getTigoDebtRequest.searchCode)[0];
        this.parameterCode = this.getTigoDebtRequest.parameters;
      }, error: _err => { this.globalService.danger('Favoritos: ', _err); }});
  }

  handleFavoriteByIdEntel($event: IdDto) {
    this.detail = undefined;
    this.favoriteId = $event.id;
    this.telephoneServicesService.getFavorite(new IdDto({ id: $event.id }))
      .subscribe({next: (response: any) => {
        this.selectedFavorite = true;
        this.getDebtRequest = response;
        this.selectedPayment = this.listCriteria.filter(x => x.serviceCode === this.getDebtRequest.serviceCode)[0];
        this.parameterCode = this.getDebtRequest.parameters;
      }, error: _err => { this.globalService.danger('Favoritos: ', _err); }});
  }

  handleSaveFavorite() {
    this.globalService.validateAllFormFields(this.saveFavoriteForm.form);
    if (this.saveFavoriteForm.valid) {
      this.favorite.isFavorite = true;
      this.showSaveFavoriteForm = false;
      this.onFavoriteChanged.emit(this.favorite);
    }
  }

  handleCancelFavorite() {
    this.showSaveFavoriteForm = false;
    this.favorite.name = undefined!;
    this.favorite.isFavorite = false;
    this.onFavoriteChanged.emit(this.favorite);
  }

  handleFavoriteById($event: IdDto) {
    if (this.isEntel) {
      this.handleFavoriteByIdEntel($event);
    }  else if (this.isTigo) {
      this.handleGetFavoriteByTigo($event);
    }
    else {
      this.detail = undefined;
      this.favoriteId = $event.id;
      this.paseService.getFavoriteById(new IdDto({ id: $event.id }))
        .subscribe({next: (response: any) => {
          this.selectedFavorite = true;
          this.getDebtRequest = response;
          this.selectedPayment = this.listCriteria.filter(x => x.serviceCode === this.getDebtRequest.serviceCode)[0];
          this.parameterCode = this.getDebtRequest.parameters;
        }, error: _err => { this.globalService.danger('Favoritos: ', _err); }});
    }

  }

  handleRemove() {
    if (this.isEntel) {
      this.telephoneServicesService.removeFavorite(new FavoriteServicesByIdResult({ id: this.favoriteId }))
        .subscribe({next: (response: any) => {
          this.handleGetFavoriteEntel();
          this.selectedFavorite = false;
          this.selectedPayment = undefined!;
          this.favoriteItem = undefined;
          this.globalService.info('Favoritos: ', 'El pago se eliminó correctamente.');
        }, error: _err => {
        }});
    } else if (this.isTigo) {
      this.tigoPaymentsService.removeFavorite(new IdDto({ id: this.favoriteId }))
        .subscribe({next: (response: any) => {
          this.handleGetFavoriteTigo();
          this.selectedFavorite = false;
          this.selectedPayment = undefined!;
          this.favoriteItem = undefined;
          this.globalService.info('Favoritos: ', 'El pago se eliminó correctamente.');
        }, error: _err => {
        }});
    } else {
      this.paseService.deleteFavoriteById(new IdDto({ id: this.favoriteId }))
        .subscribe({next: (response: any) => {
          this.handleGetFavorite(this.typeService);
          this.selectedFavorite = false;
          this.selectedPayment = undefined!;
          this.favoriteItem = undefined;
          this.globalService.info('Favoritos: ', 'El pago se eliminó correctamente.');
        }, error: _err => {
        }});
    }

  }

  handleDelapaz() {
    if (this.isDelapaz) {
      this.selectedPayment = this.listCriteria[0];
    }
  }

  handleChangeAmount() {
    this.onChange.emit(this.selectedAmount);
  }

  handleGetAmountsPrePago() {
    this.paramService.getByGroupAndCode(new ParameterDto({ group: 'MONTIG', code: 'MONTIG' }))
      .subscribe({next: (response: ParameterResult) => {
        let amountTigo = response.description.split(',');
        for (let item of amountTigo) {
          this.amountsPrePago.push(Number(item));
        }
        this.selectedAmount = this.amountsPrePago[0];
        this.onChange.emit(this.selectedAmount);
      }});
  }

  handleGetDebts() {
    this.globalService.validateAllFormFields(this.epsasForm.form);
    if (this.isEntel) {
      this.geDebtsEntelDto = new GetDebtsClientEntelDto();
      if (this.epsasForm.valid) {
        this.geDebtsEntelDto.searchCode = this.selectedPayment.serviceCode;
        this.geDebtsEntelDto.parameters = this.parameterCode;
        this.geDebtsEntelDto.paymentTypeDescription = this.parameterCode;
        this.telephoneServicesService.getClientEntel(this.geDebtsEntelDto)
          .subscribe({next: (response: any) => {
            this.detail = response;
            this.existDebts = this.detail !== undefined ? true : false;
            this.onChange.emit(this.detail);
            this.onChangeDebts.emit(this.geDebtsEntelDto);
          }, error: _err => {
            this.onChange.emit(this.detail);
            this.onChangeDebts.emit(this.geDebtsEntelDto);
            this.existDebts = false;
          }});
      }
    } else if (this.isTigo) {
      if (this.epsasForm.valid)  {
        this.getTigoDebtsDto.searchCode = this.selectedPayment.serviceCode;
            this.getTigoDebtsDto.accountNumber = this.parameterCode;
        if (this.selectedPayment.serviceCode == '1') {
          this.handleGetAmountsPrePago();
          this.onChangeDebts.emit(this.getTigoDebtsDto);
        } else {
          if (this.epsasForm.valid) {
            this.tigoPaymentsService.getDebtsTigo(this.getTigoDebtsDto)
              .subscribe({next: (response: any) => {
                this.detail = response;
                this.existDebts = this.detail !== undefined ? true : false;
                this.onChange.emit(this.detail);
                this.onChangeDebts.emit(this.getTigoDebtsDto);
              }, error: _err => {
                this.onChange.emit(this.detail);
                this.onChangeDebts.emit(this.getTigoDebtsDto);
                this.existDebts = false;
              }});
          }
        }
      }
    } else {
      this.getDebtsDto = new GetDebtsDto();
      this.handleDelapaz();
      if (this.epsasForm.valid) {
        this.getDebtsDto.parameters = this.parameterCode;
        this.getDebtsDto.companyCode = this.selectedPayment.companyCode.trim();
        this.getDebtsDto.serviceCode = this.selectedPayment.serviceCode;
        this.getDebtsDto.serviceCodeDescription = this.selectedPayment.nameCompany;
        this.getDebtsDto.isAutoComplete = this.getDebtsDto.companyCode !== ServiceTypes.Semapa.toString() ? true : false;
        this.paseService.getDebts(this.getDebtsDto)
          .subscribe({next: (response: any) => {
            this.detail = response;
            this.detail.companyName = this.selectedPayment.nameCompany;
            this.existDebts = this.detail !== undefined ? true : false;
            this.onChange.emit(this.detail);
            this.onChangeDebts.emit(this.getDebtsDto);
          }, error: _err => {
            this.existDebts = false;
          }});
        this.onChange.emit(this.detail);
        this.onChangeDebts.emit(this.getDebtsDto);
      }
    }
  }
}
