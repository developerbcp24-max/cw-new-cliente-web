import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NewPaseDto } from '../../../../Services/new-pase/models/new-pase-dto ';
import { Constants } from '../../../../Services/shared/enums/constants';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-send-bill-data',
  standalone: false,
  templateUrl: './send-bill-data.component.html',
  styleUrls: ['./send-bill-data.component.css']
})
export class SendBillDataComponent implements OnInit {

  constants: Constants;
  @Input() visible!: boolean;
  @Input() isEntel = false;
  @Input() disabled!: boolean;
  @Input() newPaseDto: NewPaseDto = new NewPaseDto();
  @ViewChild('sendBillForm') form!: NgForm;
  isStreetOrAvenue!: string;

  constructor(private globalService: GlobalService) {
    this.constants = new Constants();
  }

  ngOnInit() {
    this.newPaseDto.departament = this.constants.cities[0];
    this.isStreetOrAvenue = this.constants.streetTypes[0]
    this.newPaseDto.isStreet = this.constants.streetTypes[0] == 'Calle' ? true : false;
    this.cleanForm();
  }

  handleValidate() {
    if(!this.visible){
      return true;
    }
    this.newPaseDto.isStreet = this.isStreetOrAvenue == 'Calle' ? true : false;
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid;
  }

  cleanForm() {
    this.newPaseDto.isStreet = false;
    this.newPaseDto.streetOrAvenue = this.newPaseDto.isComission ? undefined! : this.newPaseDto.streetOrAvenue;
    this.newPaseDto.number = undefined!;
    this.newPaseDto.floorOrDepartament = undefined!;
    this.newPaseDto.batchOrCondominium = undefined!;
    this.newPaseDto.zoneOrNeighborhood = undefined!;
    this.newPaseDto.location = undefined!;
    this.newPaseDto.province = undefined!;
  }

}
