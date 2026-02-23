import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { AfpService } from '../../../../Services/AFP/afp.service';
import { RequestModelsAfpquery } from '../../../../Services/AFP/Models/request-models-afpquery';
import { ResponseModelsAfpquery } from '../../../../Services/AFP/Models/response-models-afpquery';

@Component({
  selector: 'app-afp-request-form',
  standalone: false,
  templateUrl: './afp-request-form.component.html',
  styleUrls: ['./afp-request-form.component.css'],
  providers: [AfpService]
})
export class AfpRequestFormComponent implements OnInit {
  documentTypes!: ParameterResult[];
  TypeCompanias!: ParameterResult[];
  showCompanyLimits = false;

  currentUser: any;
  data: RequestModelsAfpquery = new RequestModelsAfpquery();
  DetailAFPResponse: ResponseModelsAfpquery = new ResponseModelsAfpquery();
  isDisabledForm!: boolean;
  @Input()
  isVisibleError!: boolean;
  @Input()
  message!: string;
  messageAlert!: string;
  isVisibleAlert: boolean = false;

  @Output() emitEvent: EventEmitter<ResponseModelsAfpquery> = new EventEmitter<ResponseModelsAfpquery>();
  disabled: boolean = false;

  constructor(private parametersService: ParametersService,
    private globalService: GlobalService,
    private AfpService: AfpService
  ) {
    this.data.Param3 = '';
    this.data.IdCompany = '';
  }

  ngOnInit() {
    this.getParameters();
  }

  getParameters() {
    this.parametersService.getByGroup(new ParameterDto({ group: 'PASDOC' }))
      .subscribe({next: response => {
        this.documentTypes = response;

      }, error: _err => this.globalService.danger('Parámetros', _err.message)});

    this.parametersService.getByGroup(new ParameterDto({ group: 'AFPTIP' }))
      .subscribe({next: response => {
        this.TypeCompanias = response;
      }, error: _err => this.globalService.danger('Parámetros', _err.message)});
  }
  getDetail() {
    this.isVisibleAlert = false;
      this.AfpService.getDetailAFP(this.data)
        .subscribe({next: (response: ResponseModelsAfpquery) => {
          this.DetailAFPResponse = response;
          if (this.DetailAFPResponse.codeAnswer === '000') {
            this.disabled = true;
            this.emitEvent.emit(this.DetailAFPResponse);
          } else {
            this.messageAlert = 'Nota : '+this.DetailAFPResponse.detailAnswer;
            this.isVisibleAlert = this.DetailAFPResponse.detailAnswer.trim() === ''?false: true;
            this.isVisibleError = true;
            this.message = 'Error: No existe ningún registro para los datos de entrada.';
            this.emitEvent.emit(this.DetailAFPResponse);
          }
        }, error: _err => {
          this.message = 'Error: No existe ningún registro para los datos de entrada.';
        }});
  }

  handleValidate() {
    if(this.data.Param3 === undefined || this.data.Param2===undefined || this.data.IdCompany===undefined||this.data.IdClient===undefined||
       this.data.Param3 === '' ||this.data.Param2 === ''|| this.data.IdCompany === ''||this.data.IdClient === '')
    {
      this.isVisibleError = true;
      this.message = 'Debe seleccionar e ingresar datos.';
    }
    else{
      this.isVisibleError = false;
      this.getDetail();
    }
  }
}
