import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { ModificationData } from '../../../../Services/operations/models/request-modification/modification-data';
import { User, Roles } from '../../../../Services/operations/models/request-modification/user';
import { UserRole, Account, Role } from '../../../../Services/operations/models/request-modification/user-role';
import { OperationTypeResult } from '../../../../Services/operations/models/request-modification/operation-type-result';
import { ModificationRequestService } from '../../../../Services/operations/modification-request.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ChangesInformation } from '../../../../Services/operations/models/request-modification/changes-information';
import { Actions } from '../../../../Services/operations/models/request-modification/actions';
import { InputApprovers } from '../../../../Services/approvers-and-controllers/models/input-approvers';
import { OperationType } from '../../../../Services/shared/enums/operation-type';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { Constants } from '../../../../Services/shared/enums/constants';
import { NgForm } from '@angular/forms';
import { ApproversAndControllers } from '../../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { OriginalData } from '../../../../Services/operations/models/request-modification/original-data';
import { UtilsService } from '../../../../Services/shared/utils.service';

@Component({
  selector: 'app-modifications-request-step2',
  standalone: false,
  templateUrl: './modifications-request-step2.component.html',
  styleUrls: ['./modifications-request-step2.component.css'],
  providers: [ModificationRequestService, UtilsService]
})
export class ModificationsRequestStep2Component implements OnInit {

  @Input() modificationData!: ModificationData;
  @Input() usersPerPage!: User[];
  @Input() users: any;
  listUsers: User[] = [];
  selectedUser: User = new User();
  isVisibleUserDetail = false;
  isVisibleRol = false;
  userId!: number;
  usersDetail!: User;
  isNewUser = false;
  isModify = true;
  processBatchId!: number;

  rolesByOperation: UserRole = new UserRole();
  rolesByOperationPerPage: UserRole = new UserRole();
  listAccounts: UserRole = new UserRole();

  listAccountsQuery: UserRole = new UserRole();
  rolesByOperationQuery: UserRole = new UserRole();
  rolesByOperationPerPageQuery: UserRole = new UserRole();

  operationTypes!: OperationTypeResult[];
  operationTypesOriginal!: OperationTypeResult[];
  selectedOperation: OperationTypeResult = new OperationTypeResult();
  originalUserRolesPerCompany!: UserRole[];

  changesInformation: ChangesInformation[] = [];
  changesInformationPerPage: ChangesInformation[] = [];
  changesInformationPreSave: ChangesInformation[] = [];
  authorizersDto: InputApprovers;
  documentTypes!: ParameterResult[];
  idcExtensions!: ParameterResult[];
  countries!: ParameterResult[];
  roleResult: Role = new Role();
  isPasaport = true;
  codeExtension = '';
  isVisbleDelete = false;
  newAccount!: string;
  newAccountOriginal: string[] = [];
  addUserHasBeenRequested = false;
  changeRolesHasBeenRequested = false;

  queryData: ChangesInformation[] = [];
  resultRolesPerCompany!: UserRole[];

  rowsPerPage: number[] = [10, 15, 20, 25];
  pageItems = 10;
  totalItems = 0;

  rowsPerPageRoles: number[] = [10, 15, 20, 25];
  pageItemsRoles = 10;
  totalItemsRoles = 0;

  rowsPerPageUsers: number[] = [10, 15, 20, 25];
  pageItemsUsers = 10;
  totalItemsUsers = 0;

  isVisibleToken = false;
  isModification = false;
  newUserId = -1;
  isOperationSuccessful = false;
  isNewAccount = false;
  accountId!: number;
  operationTypeId = 12;
  index: any;
  paramResult: ParameterResult = new ParameterResult();
  pageItemsForUsers = 5;
  userRolesPerCompany: UserRole[] = [];
  userRolesPerCompanyQuery: UserRole[] = [];
  idcTypeDes!: string;

  @Input()
  originalDataFull!: OriginalData;
  @Output() onChangeSetp2 = new EventEmitter<ModificationData>();
  @Output() onListRoles = new EventEmitter<ChangesInformation[]>();
  @Output() onChangeNamesApprovers = new EventEmitter<any[]>();
  @ViewChild('pagination')
  pagination!: NgForm;
  @ViewChild('accountForm')
  accountForm!: NgForm;
  @ViewChild('userForm')
  userForm!: NgForm;
  @ViewChild('emailForm')
  emailForm!: NgForm;

  constructor(private service: ModificationRequestService, private globalService: GlobalService,
    private parametersService: ParametersService, private cdRef: ChangeDetectorRef, private utilsService: UtilsService) {
    this.authorizersDto = {
      operationTypeId: OperationType.formularioSolicitud
    };
  }

  ngOnInit() {
    this.totalItemsUsers = this.usersPerPage.length;
    this.originalUserRolesPerCompany = this.originalDataFull.userRoles;
    this.userRolesPerCompany = this.originalDataFull.userRoles;
    this.getOperationTypes();
  }


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handlePageChangedUsers($event: number) {
    this.listUsers = this.usersPerPage.slice((($event - 1) * this.pageItemsUsers), this.pageItemsUsers * $event);
  }

  handleViewRowsUsers($event: string) {
    this.pageItemsUsers = +$event;
    this.handlePageChangedUsers(0);
  }

  handleShowUserDetail(userId: number) {
    this.idcTypeDes = this.selectedUser.idcType;
    this.isVisibleUserDetail = true;
    this.isNewUser = false;
    this.selectedUser = Object.assign({}, this.users.find((x: any) => x.id === userId));
    this.documentTypes = this.utilsService.getDocumentTypes();
    this.idcTypeDes = this.documentTypes.find(x => x.code === this.selectedUser.idcType)!.description;
  }

  handleGetAllRoles() {
    this.userRolesPerCompany = this.originalDataFull.userRoles;
    this.userRolesPerCompany.forEach(x => x.account.forEach(y => y.role.forEach(z => z.isEditable = z.isSelected)));
    this.userRolesPerCompanyQuery = this.userRolesPerCompany;
  }

  handleShowRoles(detail: User) {
    this.setOperationTypes();
    this.usersDetail = detail;
    this.userId = detail.id;
    this.handleResetModels();
    this.handleGetRoleByUser();
    this.isVisibleRol = true;
  }

  handleResetModels() {
    this.userRolesPerCompany = [];
    this.userRolesPerCompanyQuery = [];
    this.rolesByOperation = new UserRole();
    this.rolesByOperationQuery = new UserRole();
    this.rolesByOperationPerPage = new UserRole();
    this.rolesByOperationPerPageQuery = new UserRole();
  }

  handleGetRoleByUser() {
    this.service.getOriginalData().subscribe({next: response => {
      this.userRolesPerCompany = response.userRoles;
      if (this.userId !== -1) {
        this.userRolesPerCompany.forEach(x => x.account.forEach(y => y.role.forEach(z => z.isEditable = z.isSelected)));
        if (this.newAccountOriginal.length > 0) {
          for (let item of this.newAccountOriginal) {
            this.userRolesPerCompany.forEach(x => x.account.push(new Account({
              formattedNumber: item,
              role: [{ id: 2, isSelected: false, status: Actions.unchanged }, { id: 4, isSelected: false, status: Actions.unchanged }, { id: 3, isSelected: false, status: Actions.unchanged }, { id: 1, isSelected: false, status: Actions.unchanged }]
            })));
          }
        }
      } else {
        this.userRolesPerCompany = [];
        this.userRolesPerCompany = this.originalUserRolesPerCompany;
      }
      this.userRolesPerCompanyQuery = this.userRolesPerCompany;
      this.handleSetRolesByOperation();
    }});
  }

  handleSetRolesByOperation() {
    this.pagination.reset();
    this.rolesByOperation = Object.assign({}, this.userRolesPerCompany.find(x => x.operationTypeId === this.selectedOperation.id && x.userId === this.userId));
    this.rolesByOperationQuery = Object.assign({}, this.userRolesPerCompanyQuery.find(x => x.operationTypeId === this.operationTypeId && x.userId === this.userId));
    this.rolesByOperationPerPage.operationTypeId = this.rolesByOperation.operationTypeId;
    this.rolesByOperationPerPage.userId = this.rolesByOperation.userId;
    this.rolesByOperationPerPage.account = this.rolesByOperation.account;
    this.totalItems = this.rolesByOperation.account.length;
    this.listAccounts.account = this.rolesByOperation.account;

    this.rolesByOperationPerPageQuery.operationTypeId = this.operationTypeId;
    this.rolesByOperationPerPageQuery.userId = this.rolesByOperationQuery.userId;
    this.rolesByOperationPerPageQuery.account = this.rolesByOperationQuery.account;

    this.listAccountsQuery.account = this.rolesByOperationQuery.account;
    this.handlePageChanged(1);

  }

  handlePageChanged($event: number) {
    this.rolesByOperationPerPage.account = this.listAccounts.account.slice((($event - 1) * this.pageItems), this.pageItems * $event);
    this.rolesByOperationPerPageQuery.account = this.listAccountsQuery.account.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }

  getOperationTypes() {
    this.service.getOperationTypes().subscribe({next: response => {
      this.operationTypes = response;
      this.operationTypesOriginal = response;
      this.operationTypes = this.operationTypes.filter(x => x.id !== 12);
      this.selectedOperation = this.operationTypes[0];
    }, error: _err => this.globalService.info('Tipo de Operación: ', _err.message)});
  }

  setOperationTypes() {
    this.selectedOperation = this.operationTypes[0];
  }

  handleCheckedQuery($event: any, id: number) {
    this.roleResult = $event;
    this.accountId = id;
    this.index = this.userRolesPerCompanyQuery.findIndex(x => x.operationTypeId === this.operationTypeId && x.userId === this.userId);
    this.userRolesPerCompanyQuery[this.index] = this.rolesByOperationQuery;
    setTimeout(() => this.updateChangesInformationQuery(), 100);
    setTimeout(() => this.updateUserActionQuery(this.index), 100);
  }

  handleChecked($event: any, id: number) {
    this.roleResult = $event;
    this.accountId = id;
    this.index = this.userRolesPerCompany.findIndex(x => x.operationTypeId === this.selectedOperation.id && x.userId === this.userId);
    this.userRolesPerCompany[this.index] = this.rolesByOperation;
    setTimeout(() => this.updateChangesInformation(), 100);
    setTimeout(() => this.updateUserAction(this.index), 100);
  }
  /********************************* */
  updateChangesInformationQuery() {
    this.changesInformation = [];
    for (let i = 0; i < this.userRolesPerCompanyQuery.length; i++) {
      for (let j = 0; j < this.userRolesPerCompanyQuery[i].account.length; j++) {
        for (let k = 0; k < this.userRolesPerCompanyQuery[i].account[j].role.length; k++) {

          if (this.userId === -1) {
            if (this.roleResult.id === 2) {
              if (this.userRolesPerCompanyQuery[i].operationTypeId === this.operationTypeId &&
                this.userRolesPerCompanyQuery[i].userId === this.userId &&
                this.userRolesPerCompanyQuery[i].account[j].id === this.accountId &&
                this.userRolesPerCompanyQuery[i].account[j].role[k].id === this.roleResult.id) {
                this.userRolesPerCompanyQuery[i].account[j].role[k].status = this.roleResult.isSelected ? Actions.changed : Actions.unchanged;
              }
            } else {
              if (this.userRolesPerCompanyQuery[i].operationTypeId === this.selectedOperation.id &&
                this.userRolesPerCompanyQuery[i].userId === this.userId &&
                this.userRolesPerCompanyQuery[i].account[j].id === this.accountId &&
                this.userRolesPerCompanyQuery[i].account[j].role[k].id === this.roleResult.id) {
                this.userRolesPerCompanyQuery[i].account[j].role[k].status = this.roleResult.isSelected ? Actions.changed : Actions.unchanged;
              }
            }
          } else {
            this.userRolesPerCompanyQuery[i].account[j].role[k].status =
              this.originalUserRolesPerCompany[i].account[j].role[k].isSelected !== this.userRolesPerCompanyQuery[i].account[j].role[k].isSelected ? Actions.changed : Actions.unchanged;
          }
        }
        if (this.userRolesPerCompanyQuery[i].account[j].role.find(x => x.status === Actions.changed)) {
          if (this.users.find((x: any) => x.id === this.userRolesPerCompanyQuery[i].userId)) {
            this.changesInformation.push(new ChangesInformation({
              user: this.users.find((x: any) => x.id === this.userRolesPerCompanyQuery[i].userId).fullName,
              userId: this.users.find((x: any) => x.id === this.userRolesPerCompanyQuery[i].userId).id,
              operationType: this.operationTypesOriginal.find(x => x.id === this.userRolesPerCompanyQuery[i].operationTypeId)!.name,
              operationTypeId: this.operationTypesOriginal.find(x => x.id === this.userRolesPerCompanyQuery[i].operationTypeId)!.id,
              account: this.userRolesPerCompanyQuery[i].account[j].formattedNumber,
              accountId: this.userRolesPerCompany[i].account[j].id != undefined ?
              this.userRolesPerCompany[i].account[j].id.toString():this.userRolesPerCompany[i].account[j].id,
              roles: this.userRolesPerCompanyQuery[i].account[j].role
            }));
          }
        }
      }
    }
  }

  updateUserActionQuery(index: number) {
    for (let i = 0; i < this.userRolesPerCompanyQuery[index].account.length; i++) {
      if (this.userRolesPerCompanyQuery[index].account[i].role.find(z => z.status === Actions.changed) !== undefined) {
        this.users[this.users.findIndex((x: any) => x.id === this.userId)].action = Actions.changed;
        break;
      } else {
        this.users[this.users.findIndex((x: any) => x.id === this.userId)].action = Actions.unchanged;
      }
    }
  }
  /******************************* */
  updateChangesInformation() {
    this.changesInformation = [];
    for (let i = 0; i < this.userRolesPerCompany.length; i++) {
      for (let j = 0; j < this.userRolesPerCompany[i].account.length; j++) {
        for (let k = 0; k < this.userRolesPerCompany[i].account[j].role.length; k++) {

          if (this.userId === -1) {
            if (this.userRolesPerCompany[i].operationTypeId === this.selectedOperation.id &&
              this.userRolesPerCompany[i].userId === this.userId &&
              this.userRolesPerCompany[i].account[j].id === this.accountId &&
              this.userRolesPerCompany[i].account[j].role[k].id === this.roleResult.id) {
              this.userRolesPerCompany[i].account[j].role[k].status = this.roleResult.isSelected ? Actions.changed : Actions.unchanged;
            }
          } else {
            this.userRolesPerCompany[i].account[j].role[k].status =
              this.originalUserRolesPerCompany[i].account[j].role[k].isSelected !== this.userRolesPerCompany[i].account[j].role[k].isSelected ? Actions.changed : Actions.unchanged;
          }
        }
        if (this.userRolesPerCompany[i].account[j].role.find(x => x.status === Actions.changed)) {
          this.changesInformation.push(new ChangesInformation({
            user: this.users.find((x: any) => x.id === this.userRolesPerCompany[i].userId).fullName,
            userId: this.users.find((x: any) => x.id === this.userRolesPerCompany[i].userId).id,
            operationType: this.operationTypesOriginal.find(x => x.id === this.userRolesPerCompany[i].operationTypeId)!.name,
            operationTypeId: this.operationTypesOriginal.find(x => x.id === this.userRolesPerCompany[i].operationTypeId)!.id,
            account: this.userRolesPerCompany[i].account[j].formattedNumber,
            accountId: this.userRolesPerCompany[i].account[j].id != undefined ?
            this.userRolesPerCompany[i].account[j].id.toString() : this.userRolesPerCompany[i].account[j].id,
            roles: this.userRolesPerCompany[i].account[j].role
          }));
        }
      }
    }
  }

  updateUserAction(index: number) {
    for (let i = 0; i < this.userRolesPerCompany[index].account.length; i++) {
      if (this.userRolesPerCompany[index].account[i].role.find(z => z.status === Actions.changed) !== undefined) {
        this.users[this.users.findIndex((x: any) => x.id === this.userId)].action = Actions.changed;
        break;
      } else {
        this.users[this.users.findIndex((x: any) => x.id === this.userId)].action = Actions.unchanged;
      }
    }
  }

  handlePresSaveRolesByUser() {
    this.changesInformationPreSave = this.changesInformationPreSave.concat(this.changesInformation);
    this.totalItemsRoles = this.changesInformationPreSave.length;
    this.isVisibleRol = false;
    this.handlePageChangedRoles(1);
  }

  handleCancelRol() {
    this.changesInformation = this.changesInformationPreSave = [];
    this.isVisibleRol = false;
  }

  handleDeleteRol(i: any) {
    this.changesInformationPreSave.splice(i, 1);
    this.handlePageChangedRoles(1);
  }
  /******************************* */
  handlePageChangedRoles($event: number) {
    this.changesInformationPerPage = this.changesInformationPreSave.slice((($event - 1) * this.pageItemsRoles), this.pageItemsRoles * $event);
  }

  handleViewRowsRoles($event: string) {
    this.pageItemsRoles = +$event;
    this.handlePageChangedRoles(0);
  }

  handleNewUser() {
    this.selectedUser = new User();
    this.isNewUser = true;
    this.isModify = false;
    this.isVisibleUserDetail = true;
    this.getDocumentTypes();
    this.getExtensions();
    this.handleGetAllRoles();
  }

  handleNewAccount() {
    this.isNewAccount = true;
  }

  getDocumentTypes() {
    this.documentTypes = this.utilsService.getDocumentTypes();
    this.selectedUser.idcType = this.documentTypes.find(x => x.code === Constants.DOCUMENT_CI)!.code;
  }

  handleTypeExtension() {
    this.isPasaport = false;
    if (this.selectedUser.idcType === Constants.DOCUMENT_CI) {
      this.getExtensions();
      this.isPasaport = true;
    } else if (this.selectedUser.idcType === Constants.DOCUMENT_PASSPORT) {
      this.getIdcExtensions('CODPAS');
      this.isPasaport = true;
    } else {
      this.selectedUser.idcExtension = undefined!;
    }
  }

  getExtensions() {
    this.idcExtensions = this.utilsService.getDocumentExtension();
    this.selectedUser.idcExtension = this.idcExtensions[0].code;
  }

  getIdcExtensions(group: string) {
    this.parametersService.getByGroup(new ParameterDto({ group: group })).subscribe({next: response => {
      this.idcExtensions = response;
      this.selectedUser.idcExtension = response[0].code;
    }, error: _err => this.globalService.danger('Parámetros', _err.message)});
  }

  handleShowDeleteUser(userId: number) {
    this.userId = userId;
    this.isVisbleDelete = true;
  }

  handleDeleteUser() {
    this.users[this.users.findIndex((x: any) => x.id === this.userId)].action = Actions.deleted;
    this.users[this.users.findIndex((x: any) => x.id === this.userId)].status = 2;
    this.listUsers.splice(this.listUsers.findIndex(x => x.id === this.userId), 1);
    this.modificationData.deleteUser = true;
    this.isVisbleDelete = false;
  }

  handleValidate(approversAndControllersValidation: boolean) {
    if (approversAndControllersValidation) {
      this.modificationData.currency = '-';
      this.modificationData.sourceAccount = '-';
      this.modificationData.users = this.users.filter((x: any) => (x.action !== Actions.unchanged && this.changesInformationPreSave.find(y => y.userId === x.id)) || x.action === Actions.deleted || x.action === Actions.changed);
      for (let i = 0; i < this.modificationData.users.length; i++) {
        this.modificationData.users[i].roles = [];
        let userChanges = this.changesInformationPreSave.filter(x => x.userId === this.modificationData.users[i].id);
        for (let j = 0; j < userChanges.length; j++) {
          let roles = userChanges[j].roles.filter(x => x.status === Actions.changed);
          for (let k = 0; k < roles.length; k++) {
            this.modificationData.users[i].roles.push(new Roles({ operationTypeId: userChanges[j].operationTypeId, formattedAccount: userChanges[j].account, roleId: roles[k].id }));
          }
        }
      }
      this.modificationData.users = this.usersPerPage;
      this.onListRoles.emit(this.changesInformationPreSave);
      this.onChangeSetp2.emit(this.modificationData);
    }
  }

  handleSaveAccountInformation() {
    this.globalService.validateAllFormFields(this.accountForm.form);
    if (!this.accountForm.form.valid) {
      return;
    }
    this.newAccountOriginal.push(this.newAccount);
    this.originalUserRolesPerCompany.forEach(x => x.account.push(new Account({
      formattedNumber: this.newAccount,
      role: [{ id: 2, isSelected: false, status: Actions.unchanged }, { id: 4, isSelected: false, status: Actions.unchanged }, { id: 3, isSelected: false, status: Actions.unchanged }, { id: 1, isSelected: false, status: Actions.unchanged }]
    })));
    this.newAccount = '';
    this.isNewAccount = false;
  }

  handleSaveUserInformation() {
    if (!this.modificationData.isModification) {
      if (!this.isNewUser) {
        this.isVisibleUserDetail = false;
        return;
      } else {
        this.globalService.validateAllFormFields(this.userForm.form);
        if (!this.userForm.form.valid) {
          return;
        }
        this.selectedUser.action = Actions.added;
        this.selectedUser.status = 1;
        this.selectedUser.id = this.newUserId--;
        this.users.push(Object.assign({}, this.selectedUser));
        this.userRolesPerCompany = this.userRolesPerCompany.concat(this.getOperationsForNewUser());
        this.originalUserRolesPerCompany = this.originalUserRolesPerCompany.concat(this.getOperationsForNewUser());
        this.cleanNewUserForm();
      }
    } else {
      this.globalService.validateAllFormFields(this.emailForm.form);
      if (!this.emailForm.form.valid) {
        if (this.selectedUser.newEmail == null && Number(this.selectedUser.newLimit) === 0) {
          return;
        }
      }
      if (this.selectedUser.newEmail || this.selectedUser.newLimit) {
        this.selectedUser.action = Actions.changed;
        this.users[this.users.findIndex((x: any) => x.id === this.selectedUser.id)] = this.selectedUser;
      }
    }
    this.modificationData.newEmailLimit = this.listUsers.find(x => x.newEmail != null || Number(x.newLimit) > 0) ? true : false;
    this.totalItemsUsers = this.usersPerPage.length;
    this.handlePageChangedUsers(1);
    this.isVisibleUserDetail = false;
  }

  cleanNewUserForm() {
    this.selectedUser = new User();
    this.selectedUser.idcType = this.documentTypes[0].code;
  }

  getOperationsForNewUser(): UserRole[] {
    const operations: UserRole[] = [];
    for (let operation of this.operationTypesOriginal) {
      operations.push(new UserRole({ operationTypeId: operation.id, userId: this.selectedUser.id, account: this.getAccountsForNewUser() }));
    }
    return operations;
  }

  getAccountsForNewUser(): Account[] {
    const accounts: Account[] = [];
    for (let account of this.userRolesPerCompany[0].account) {
      accounts.push(new Account({
        id: account.id,
        formattedNumber: account.formattedNumber,
        accountUse: account.accountUse,
        role: [{ id: 2, isSelected: false, status: Actions.unchanged }, { id: 4, isSelected: false, status: Actions.unchanged }, { id: 3, isSelected: false, status: Actions.unchanged }, { id: 1, isSelected: false, status: Actions.unchanged }]
      }));
    }
    return accounts;
  }

  handleIsThereDeletedUsers(): boolean {
    return this.users.find((x: any) => x.action === Actions.deleted || x.action === Actions.changed) !== undefined;
  }

  handleNamesApprovers($event: any[]) {
    this.onChangeNamesApprovers.emit($event);
  }

  handleApproversOrControllersChanged($event: ApproversAndControllers) {
    this.modificationData.controllers = $event.controllers;
    this.modificationData.approvers = $event.approvers;
    this.modificationData.cismartApprovers = $event.cismartApprovers;
  }
}
