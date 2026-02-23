import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ProcessBatchId } from '../../../../Services/shared/models/process-batch-id';
import { ModificationRequestService } from '../../../../Services/operations/modification-request.service';
import { OriginalData } from '../../../../Services/operations/models/request-modification/original-data';
import { GlobalService } from '../../../../Services/shared/global.service';
import { User, Roles } from '../../../../Services/operations/models/request-modification/user';
import { OperationTypeResult } from '../../../../Services/operations/models/request-modification/operation-type-result';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';

@Component({
  selector: 'app-modification-request-detail',
  standalone: false,
  templateUrl: './modification-request-detail.component.html',
  styleUrls: ['./modification-request-detail.component.css'],
  providers: [ModificationRequestService]
})
export class ModificationRequestDetailComponent implements OnInit {

  @Input() batchId!: number;
  showDetailUser = false;
  detail: OriginalData = new OriginalData();
  detailUser: OriginalData = new OriginalData();
  userPage: User [] = [];
  user: User = new User();
  originalUser: User = new User();
  rolesPage: Roles [] = [];
  selectedOperation: OperationTypeResult = new OperationTypeResult();
  operationTypesDetail: OperationTypeResult [] = [];
  originalRoles = [2, 4, 3, 1];
  rowsPerPageUsers: number[] = [10, 15, 20, 25];
  pageItemsUsers = 10;
  totalItemsUsers = 0;

  rowsPerPageRoles: number[] = [10, 15, 20, 25];
  pageItemsRoles = 10;
  totalItemsRoles = 0;
  operationTypeId = 12;

  constructor(private service: ModificationRequestService, private globalService: GlobalService,
    private parametersService: ParametersService) { }

  ngOnInit() {
    this.showDetailUser = false;
    this.handelGetDetailUser();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.showDetailUser = false;
    this.detail = new OriginalData();
    this.user = new User();
    this.operationTypesDetail = [];
    this.totalItemsRoles = 0;
    this.handelGetDetailUser();
  }

  handelGetDetailUser() {
    this.service.getDetail(new ProcessBatchId({ processBatchId: this.batchId }))
      .subscribe({next: res => {
        this.detail = res;
        this.totalItemsUsers = this.detail.users.length;
      }, error: _err => this.globalService.danger('Solicitud de Modificación : ', _err.message)});
  }

  handleShowDetailUser($event: any) {
    this.handelGetDetailUser();
    this.user = $event;
    this.handleGetDocumentType();
    this.originalUser.roles = this.user.roles;
    for (const item of this.user.roles) {
      if (this.operationTypesDetail.find(x => x.id === item.operationTypeId) === undefined) {
          this.operationTypesDetail.push(this.detail.operationTypesDetail.find(y => y.id === item.operationTypeId)!);
      }
    }
      this.selectedOperation = this.operationTypesDetail[0];
    this.totalItemsRoles = this.user.roles.length;
    this.handleGetRoles();
    this.showDetailUser = true;
  }

  handleGetDocumentType() {
    this.parametersService.getByGroupAndCode(new ParameterDto({ group: 'TIPDOC', code: this.user.idcType})).subscribe({next: response => {
      this.user.idcType = response.description;
    }, error: _err => this.globalService.danger('Parámetros', _err.message)});
  }

  handleGetRoles() {
    if (this.selectedOperation !== undefined) {
      this.user.roles = this.originalUser.roles.filter(x => x.operationTypeId === this.selectedOperation.id);
    }
  }

  handlePageChangedUsers($event: number) {
    this.userPage = this.detail.users.slice((($event - 1) * this.pageItemsUsers), this.pageItemsUsers * $event);
  }

  handleViewRowsUsers($event: string) {
    this.pageItemsUsers = +$event;
    this.handlePageChangedUsers(0);
  }

  handlePageChangedRoles($event: number) {
    this.rolesPage = this.user.roles.slice((($event - 1) * this.pageItemsRoles), this.pageItemsRoles * $event);
  }

  handleViewRowsRoles($event: string) {
    this.pageItemsRoles = +$event;
    this.handlePageChangedRoles(0);
  }

}
