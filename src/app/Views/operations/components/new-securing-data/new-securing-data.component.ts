import { Component, OnInit, Input, ViewChild, forwardRef, EventEmitter, Output } from '@angular/core';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserService } from '../../../../Services/users/user.service';
import { Constants } from '../../../../Services/shared/enums/constants';
import { NewBallotOfWarrantyService } from '../../../../Services/new-ballot-of-warranty/new-ballot-of-warranty.service';
import { BallotOfWarrantyDto } from '../../../../Services/new-ballot-of-warranty/models/ballot-of-warranty-dto';
import { ParametersResult } from '../../../../Services/new-ballot-of-warranty/models/parameters-result';

@Component({
  selector: 'app-new-securing-data',
  standalone: false,
  templateUrl: './new-securing-data.component.html',
  styleUrls: ['./new-securing-data.component.css'],
  providers: [NewBallotOfWarrantyService, ParametersService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NewSecuringDataComponent),
      multi: true
    }]
})
export class NewSecuringDataComponent implements OnInit {

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
  cityObj: any;

  constructor(private globalService: GlobalService, private userService: UserService) { }

  ngOnInit() {
    this.citys = this.constants.branchOfficesPase;
    this.cityObj = '';
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
    //no more
  }

  propagateChange = (_: any) => { //no more
  };

  handleChangeCity() {
    this.ballot.originCity = this.cityObj.name;
    this.ballot.originCityCode = this.cityObj.value;
  }

}
