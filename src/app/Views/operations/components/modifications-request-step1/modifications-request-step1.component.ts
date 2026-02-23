import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { ModificationData } from '../../../../Services/operations/models/request-modification/modification-data';
import { ModificationRequestService } from '../../../../Services/operations/modification-request.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { User } from '../../../../Services/operations/models/request-modification/user';
import { NgForm } from '@angular/forms';
import { OriginalData } from '../../../../Services/operations/models/request-modification/original-data';

@Component({
  selector: 'app-modifications-request-step1',
  standalone: false,
  templateUrl: './modifications-request-step1.component.html',
  styleUrls: ['./modifications-request-step1.component.css']
})
export class ModificationsRequestStep1Component implements OnInit {

  users: User[] = [];
  @Input() modificationData!: ModificationData;
  @Input() originalDataFull!: OriginalData;
  isChangeAction!: boolean;
  @ViewChild('newDataForm') form1!: NgForm;
  @Output() modificationDataDto = new EventEmitter<ModificationData>();
  @Output() onChange = new EventEmitter<number>();
  @Output() onChangeDataFull = new EventEmitter<number>();
  isValidForm!: boolean;

  constructor(private service: ModificationRequestService, private globalService: GlobalService) { }

  ngOnInit() {
    this.handleGetData();
    this.isChangeAction = false;
  }

  handleGetData() {
    this.users = this.originalDataFull.users;
      this.modificationData.companyInformations = this.originalDataFull.companyInformations;
  }

  handleChangeOperation() {
    this.isChangeAction = true;
    this.modificationData.isModification = this.modificationData.operation ? true : false;
  }

  handleValidateForms() {
    this.isValidForm = true;
    if (this.isChangeAction && this.modificationData.operation) {
      this.globalService.validateAllFormFields(this.form1.form);
      this.isValidForm = this.form1.valid!;
      let newAuthorizer = this.modificationData.newAuthorizerNumber === undefined ? 0 : this.modificationData.newAuthorizerNumber;
      let newController = this.modificationData.newControllerNumber === undefined ? 0 : this.modificationData.newControllerNumber;
      let newLimit = this.modificationData.newLimit === undefined ? 0 : this.modificationData.newLimit;
      this.modificationData.companyInformations.newAuthorizerNumber = Number(newAuthorizer);
      this.modificationData.companyInformations.newControllerNumber = Number(newController);
      this.modificationData.companyInformations.newLimit = Number(newLimit);
    }
    if (this.isChangeAction /*&& this.isValidForm*/) {
      this.modificationData.operation = this.modificationData.operation ? 0 : 1;
      this.modificationDataDto.emit(this.modificationData);
      this.onChange.emit(2);
    }
  }

}
