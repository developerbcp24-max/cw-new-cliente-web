import { Component, OnInit, Input, ViewChild, forwardRef, EventEmitter, Output } from '@angular/core';
import { BallotOfWarrantyService } from '../../../../Services/ballot-of-warranty/ballot-of-warranty.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { BallotOfWarrantyDto } from '../../../../Services/ballot-of-warranty/models/ballot-of-warranty-dto';
import { NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserService } from '../../../../Services/users/user.service';
import { ParametersResult } from '../../../../Services/ballot-of-warranty/models/parameters-result';
import { Constants } from '../../../../Services/shared/enums/constants';

@Component({
  selector: 'app-securing-data',
  standalone: false,
  templateUrl: './securing-data.component.html',
  styleUrls: ['./securing-data.component.css'],
  providers: [BallotOfWarrantyService, ParametersService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SecuringDataComponent),
      multi: true
    }]
})
export class SecuringDataComponent implements OnInit {

  @Input() civilStatus!: ParametersResult;
  @Output() onChange = new EventEmitter<number>();
  @Output() ballotDto = new EventEmitter<BallotOfWarrantyDto>();
  @Input() ballot!: BallotOfWarrantyDto;
  @Input() disabled = false;
  @ViewChild('applicationForm') form1!: NgForm;
  @ViewChild('documentNumberForm') form2!: NgForm;
  @ViewChild('aditionalForm') form3!: NgForm;
  @ViewChild('originCityForm') form0!: NgForm;
  requestParameter: ParameterDto = new ParameterDto();
  titularUser: any;
  statusList = [];
  citys: any;
  constants: Constants = new Constants();

  constructor(private globalService: GlobalService, private userService: UserService) {
  }

  ngOnInit() {
    this.citys = this.constants.branchOfficesPase;
    this.ballot.originCity = '';
    this.titularUser = this.userService.getUserToken();
    this.ballot.typeBallotDescription = 'BOLETA DE GARANTÍA';
    this.ballot.personTypeDescription = 'PERSONA NATURAL';
  }

  handleChangeStatus($event: any) {
    this.ballot.civilState = $event;
    let result = this.civilStatus.listCivilState.filter(x => x.code === $event).shift();
    this.ballot.civilStateDescription = result!.description;
  }

  handleTypeBallot($event: any) {
    this.ballot.typeBallotOfWarranty = $event;
    this.ballot.typeBallotDescription = $event === 'BDG' ? 'BOLETA DE GARANTÍA' : 'GARANTÍA A PRIMER REQUERIMIENTO';
  }

  handlePersonType($event: any) {
    this.ballot.personType = $event;
    this.ballot.personTypeDescription = $event === 'PN' ? 'PERSONA NATURAL' : 'PERSONA JURÍDICA';
  }

  validateForms() {
    this.globalService.validateAllFormFields(this.form1.form);
    this.globalService.validateAllFormFields(this.form2.form);
    this.globalService.validateAllFormFields(this.form3.form);
    this.globalService.validateAllFormFields(this.form0.form);
    if (this.form0.valid && this.form1.valid && this.form2.valid && this.form3.valid) {
      this.ballotDto.emit(this.ballot);
      this.onChange.emit(2);
    }
  }

  handlePersonTypeChanged() {
    this.ballot.civilState = null!;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.ballot = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(_fn: any): void {
    //not more
  }

  propagateChange = (_: any) => {
    //not more
  };

}
