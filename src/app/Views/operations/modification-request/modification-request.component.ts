import { Component, OnInit } from '@angular/core';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { ChangesInformation } from '../../../Services/operations/models/request-modification/changes-information';
import { ModificationData } from '../../../Services/operations/models/request-modification/modification-data';
import { User } from '../../../Services/operations/models/request-modification/user';
import { UserRole } from '../../../Services/operations/models/request-modification/user-role';
import { ModificationRequestService } from '../../../Services/operations/modification-request.service';
import { ParametersService } from '../../../Services/parameters/parameters.service';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { GlobalService } from '../../../Services/shared/global.service';
import { Actions } from '../../../Services/operations/models/request-modification/actions';
import { Router } from '@angular/router';
import { OriginalData } from '../../../Services/operations/models/request-modification/original-data';
import { UserService } from '../../../Services/users/user.service';

@Component({
  selector: 'app-modification-request',
  standalone: false,
  templateUrl: './modification-request.component.html',
  styleUrls: ['./modification-request.component.css'],
  providers: [ModificationRequestService, ParametersService]
})
export class ModificationRequestComponent implements OnInit {

  currentStep: number;
  modificationData: ModificationData = new ModificationData();
  modificationDataSetp1: ModificationData = new ModificationData();
  modificationDataSetp2: ModificationData = new ModificationData();
  pageItemsForUsers = 5;
  users: User[] = [];
  usersPerPage: User[] = [];
  approversDto: InputApprovers = new InputApprovers();
  userRolesPerCompany!: UserRole[];
  originalUserRolesPerCompany!: UserRole[];
  changesInformation: ChangesInformation[] = [];
  namesApprovers: any[] = [];
  originalDataFull: OriginalData = new OriginalData();
  isVisibleForm = true;

  constructor(private router: Router, private service: ModificationRequestService,
    private messageService: GlobalService, private userService: UserService) {
    this.currentStep = 1;
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.approversDto = {
      operationTypeId: OperationType.formularioSolicitud
    };
    this.service.getOriginalData().subscribe({next: response => {
      this.originalDataFull = response;
      this.users = response.users;
      this.users.forEach(x => x.action = Actions.unchanged);
      this.usersPerPage = this.users;
      this.userRolesPerCompany = response.userRoles;
      this.userRolesPerCompany.forEach(x => x.account.forEach(y => y.role.forEach(z => z.isEditable = z.isSelected)));
      this.modificationData.companyInformations = response.companyInformations;
    }, error: _err => {
      this.messageService.info('Solicitud de modificaciones: ', _err.message);
      if (_err.message.includes('usuario no tiene rol')) {
        this.isVisibleForm = false;
      }
  }});
  }

  handleChangeStep2($event: ModificationData) {
    this.modificationDataSetp2 = $event;
    this.currentStep = 3;
  }
  handleChangeStep1(_$event: number) {
    this.currentStep = 2;
  }

  handleModificationDataDto($event: any) {
    this.modificationDataSetp1 = $event;
  }

  handlePreviusForm() {
    this.currentStep = 2;
  }

  handlePreviusStep() {
    switch (this.currentStep) {
      case 2:
        this.router.navigate(['/operations/modification-request']);
        break;
      case 3:
        this.handlePreviusForm();
        break;
      default:
        this.currentStep = this.currentStep - 1;
        break;
    }
  }

  handleListRoles($event: ChangesInformation[]) {
    this.changesInformation = $event;
  }

  handleNamesApprovers($event: any[]) {
    this.namesApprovers = $event;
  }
}
