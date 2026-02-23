import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BusinesBranchId } from '../../../../../Services/qr/models/BusinesBranchId';
import { ListAtmQR } from '../../../../../Services/qr/models/ListAtmQR';
import { RequestCaja } from '../../../../../Services/qr/models/RequestCaja';
import { UpBraAtmhUserQr } from '../../../../../Services/qr/models/UpBraAtmhUserQr';
import { RegBoQrService } from '../../../../../Services/qr/reg-bo-qr.service';
import { GlobalService } from '../../../../../Services/shared/global.service';
import { PaginationComponent } from '../../../../../Views/shared/cw-components/pagination/pagination.component';

@Component({
  selector: 'app-list-atm',
  standalone: false,
  templateUrl: './list-atm.component.html',
  styleUrls: ['./list-atm.component.css']
})
export class ListAtmComponent implements OnInit, OnChanges {

  headers = {
    line: true,
    atmName: true,
    name: true,
    city: true,
    userId: true,
    branchCode: true,
    status: true,
    isDeleted: true
  }
  rowsPerPage: number[] = [5, 10, 20, 25];
  itemsPerPage = 5;
  batchInformation: any;


  businesBranchId: BusinesBranchId= new BusinesBranchId();
  updateBraAtmhUserQr: UpBraAtmhUserQr= new UpBraAtmhUserQr();
  @Input() listAtmQR: ListAtmQR[] = [];
  listAtmQRs: ListAtmQR[] = [];

  @Input() spreadsheetSize!: number;
  @Input() visible: boolean=false;
  @Input() cajaNewList: RequestCaja[]=[];
  @Input() disabled = false;
  @Input() businessId: number=0;
  @ViewChild(PaginationComponent) pagination: PaginationComponent = new PaginationComponent();
  spreadsheetPerPage: ListAtmQR[]=[];

  constructor(private globalService: GlobalService, private regBoQrServices: RegBoQrService) { }

  ngOnInit(): void {
    // This is intentional
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.businesBranchId.businessId=changes['businessId'].currentValue;
  }

  handlePageChanged(pageNumber: number) {
    this.listAtmQRs = this.listAtmQR.slice((pageNumber - 1) * this.itemsPerPage, this.itemsPerPage * pageNumber);
  }
  handleViewRows($event: string) {
    this.itemsPerPage = +$event;
    this.handlePageChanged(0);
  }

  toggleUserState(usuario: ListAtmQR) {
    this.updateBraAtmhUserQr.Id=usuario.id;
    this.updateBraAtmhUserQr.IsDeleted=usuario.isDeleted;
    this.updateBraAtmhUserQr.Option='Atm'
    this.updatestatusUser();
  }

  updatestatusUser(){
    this.regBoQrServices.upBraAtmhUserQr(this.updateBraAtmhUserQr)
    .subscribe({next: (_resp) =>{
      this.globalService.info('', 'Su cambio de estado fue exitoso.');
    }})
  }
}
