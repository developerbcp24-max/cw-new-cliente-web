import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { RequestSucursal } from '../../../../../Services/qr/models/RequestSucursal';
import { PaginationComponent } from '../../../../../Views/shared/cw-components/pagination/pagination.component';
import { BusinesBranchId } from '../../../../../Services/qr/models/BusinesBranchId';
import { ListBranchQR } from '../../../../../Services/qr/models/ListBranchQR';
import { RegBoQrService } from '../../../../../Services/qr/reg-bo-qr.service';
import { UpBraAtmhUserQr } from '../../../../../Services/qr/models/UpBraAtmhUserQr';
import { GlobalService } from '../../../../../Services/shared/global.service';

@Component({
  selector: 'app-list-branch',
  standalone: false,
  templateUrl: './list-branch.component.html',
  styleUrls: ['./list-branch.component.css']
})
export class ListBranchComponent implements OnInit, OnChanges {

  headers = {
    line:true,
    sucursal: true,
    user: true,
    status: true,
    city: true,
    accion: true
  }
  rowsPerPage: number[] = [5, 10, 15, 20];

  pageSize = 5;
  businesBranchId: BusinesBranchId= new BusinesBranchId();
  updateBraAtmhUserQr: UpBraAtmhUserQr= new UpBraAtmhUserQr();
  listBranchQR: ListBranchQR[]=[];

  @Input()listBranchQrs: ListBranchQR[]=[];

  listBranQR: ListBranchQR[]=[];
  batchInformation: any;
  @Input() spreadsheetSize!: number;
  @Input() visible: boolean=false;
  @Input() branchNewList: RequestSucursal[]=[];
  @Input() disabled = false;
  @Input() businessId: number=0;
  @ViewChild(PaginationComponent) pagination: PaginationComponent = new PaginationComponent();
  constructor( private globalService: GlobalService,private regBoQrServices: RegBoQrService) { }

  ngOnInit(): void {
    // This is intentional
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.businesBranchId.businessId=this.businessId;
  }
  toggleUserState(usuario: ListBranchQR) {
    this.updateBraAtmhUserQr.Id=usuario.id;
    this.updateBraAtmhUserQr.IsDeleted=usuario.isDeleted;
    this.updateBraAtmhUserQr.Option='Branch';
    this.updatestatusUser();
  }

  updatestatusUser(){
    this.regBoQrServices.upBraAtmhUserQr(this.updateBraAtmhUserQr)
    .subscribe({next: (_resp) =>{
      this.globalService.info('', 'Su cambio de estado fue exitoso.');
    }})
  }
  handlePageChanged($event: number) {
    this.listBranchQR = this.listBranchQrs.slice((($event - 1) * this.pageSize), this.pageSize * $event);
  }
  handleViewRows($event: string) {
    this.pageSize = +$event;
    this.handlePageChanged(0);
  }
}
