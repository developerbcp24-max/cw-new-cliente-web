import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ModificationData } from '../../../../Services/operations/models/request-modification/modification-data';
import { User } from '../../../../Services/operations/models/request-modification/user';
import { ChangesInformation } from '../../../../Services/operations/models/request-modification/changes-information';
import { ModificationRequestService } from '../../../../Services/operations/modification-request.service';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-modifications-request-step3',
  standalone: false,
  templateUrl: './modifications-request-step3.component.html',
  styleUrls: ['./modifications-request-step3.component.css']
})
export class ModificationsRequestStep3Component implements OnInit {

  @Input() namesApprovers: any;
  @Input() modificationData!: ModificationData;
  @Input() informationRoles!: ChangesInformation[];
  changesInformationPerPage: ChangesInformation[] = [];
  listUsers: User[] = [];
  rowsPerPageRoles: number[] = [10, 15, 20, 25];
  pageItemsRoles = 10;
  totalItemsRoles = 0;

  rowsPerPageUsers: number[] = [10, 15, 20, 25];
  pageItemsUsers = 10;
  totalItemsUsers = 0;
  processBatchId!: number;
  isVisibleToken = false;
  isOperationSuccessful = false;
  isTokenFormDisabled = false;

  constructor(private service: ModificationRequestService, private cdRef: ChangeDetectorRef, private globalService: GlobalService) { }

  ngOnInit() {
    this.totalItemsRoles = this.informationRoles.length;
    this.totalItemsUsers = this.modificationData.users.length;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handlePageChangedUsers($event: number) {
    this.listUsers = this.modificationData.users.slice((($event - 1) * this.pageItemsUsers), this.pageItemsUsers * $event);
  }

  handleViewRowsUsers($event: string) {
    this.pageItemsUsers = +$event;
    this.handlePageChangedUsers(0);
  }

  handlePageChangedRoles($event: number) {
    this.changesInformationPerPage = this.informationRoles.slice((($event - 1) * this.pageItemsRoles), this.pageItemsRoles * $event);
  }

  handleViewRowsRoles($event: string) {
    this.pageItemsRoles = +$event;
    this.handlePageChangedRoles(0);
  }

  handleShowToken() {
    this.isVisibleToken = true;
  }

  handleTokenSubmit($event: any) {
    this.modificationData.tokenCode = $event.code;
    this.modificationData.tokenName = $event.name;
    this.service.saveChanges(this.modificationData).subscribe({next: response => {
      this.processBatchId = response.processBatchId;
      this.isOperationSuccessful = true;
      this.isVisibleToken = false;
      this.globalService.info('Operación realizada', `Su operación ha sido enviada satisfactoriamente a "Solicitudes Pendientes de Autorización" desde donde el o los usuario(s) que cuenten con los permisos podrán autorizar el lote Nro. ${this.processBatchId} más adelante. Una vez aprobada su operación, será enviada a Back Office para su ejecución.Verificar en la pantalla de Seguimiento hasta comprobar que se procesó corréctamente.`, true);
    }, error: _err => this.globalService.info('Solicitud de modificaciones', _err.message)});
  }

}
