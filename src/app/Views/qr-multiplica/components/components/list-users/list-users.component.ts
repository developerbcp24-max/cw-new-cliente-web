import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BusinesBranchId } from '../../../../../Services/qr/models/BusinesBranchId';
import { ClientResponseUser } from '../../../../../Services/qr/models/ClientResponseUser';
import { UpBraAtmhUserQr } from '../../../../../Services/qr/models/UpBraAtmhUserQr';
import { RegBoQrService } from '../../../../../Services/qr/reg-bo-qr.service';
import { GlobalService } from '../../../../../Services/shared/global.service';
import { PaginationComponent } from '../../../../../Views/shared/cw-components/pagination/pagination.component';

@Component({
  selector: 'app-list-users',
  standalone: false,
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {

  headers = {
    line: true,
    Nombre: true,
    userType: true,
    bachAtmId: true,
    estadoUser: true,
    celular: true,
    email: true,
    Accion: true

  }

  sta: boolean=false;;
  isVisibleList: boolean=false;
  businesBranch: BusinesBranchId = new BusinesBranchId()
  rowsPerPage: number[] = [5, 10, 20, 25];
  pageSize = 5;
  listUserCli: ClientResponseUser[]=[];
  @Input()listUserQr: ClientResponseUser[]=[]
  updateBraAtmhUserQr: UpBraAtmhUserQr= new UpBraAtmhUserQr();
  @Input() disabled = false;
  @Input() spreadsheetSize!: number;
  @Input() visible: boolean=false;
  @Input() userNewList: ClientResponseUser[]=[];
  @ViewChild(PaginationComponent) pagination: PaginationComponent = new PaginationComponent();
  constructor(private globalService: GlobalService, private regBoQrServices: RegBoQrService) { }

  ngOnInit(): void {

  }

  toggleUserState(usuario: ClientResponseUser) {
    this.updateBraAtmhUserQr.Id=usuario.id;
    this.updateBraAtmhUserQr.IsDeleted=usuario.status;
    this.updateBraAtmhUserQr.Option='User'
    this.updatestatusUser();
  }

  updatestatusUser(){
    this.regBoQrServices.upBraAtmhUserQr(this.updateBraAtmhUserQr)
    .subscribe({next: (_resp) =>{
      this.globalService.info('', 'Su cambio de estado fue exitoso.');
    }})
  }


  handleShowEditForm(_$event: any): void {
  }
  handlePageChanged($event: number) {
    this.listUserCli = this.listUserQr.slice((($event - 1) * this.pageSize), this.pageSize * $event);
    this.isVisibleList = this.listUserCli.length > 0;
  }
  handleViewRows($event: string) {
    this.pageSize = +$event;
    this.handlePageChanged(0);
  }
}
