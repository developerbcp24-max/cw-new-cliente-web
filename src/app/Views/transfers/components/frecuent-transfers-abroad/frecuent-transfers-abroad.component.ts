import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { GlobalService } from '../../../../Services/shared/global.service';
import { NgForm } from '@angular/forms';
import { TransfersAbroadService } from '../../../../Services/transfers-abroad/transfer-abroad.service';
import { TransferAbroadFrecuent } from '../../../../Services/transfers-abroad/models/transfer-abroad-frecuent';
import { TransferAbroadFrecuentDto } from '../../../../Services/transfers-abroad/models/transfer-abroad-frecuent-dto';
import { TransferAbroadFrecuentResult } from '../../../../Services/transfers-abroad/models/transfer-abroad-frecuent-result';

@Component({
    selector: 'app-frecuent-transfers-abroad',
    standalone: false,
    templateUrl: './frecuent-transfers-abroad.component.html',
    styleUrls: ['./frecuent-transfers-abroad.component.css'],
    providers: [TransfersAbroadService]
})
export class FrecuentTransfersAbroadComponent implements OnInit {

    frecuents: TransferAbroadFrecuentResult[] = [];
    formsTA: TransferAbroadFrecuentResult[] = [];
    frecuentSelected!: TransferAbroadFrecuentResult;
    formSelected!: TransferAbroadFrecuentResult;

    frecuentDeleteSelected = new TransferAbroadFrecuentResult();
    isCheckedFrecuentTransfer: false = false;
    isRemoveModalVisible = false;
    isUpdateModalVisible = false;
    @Input() disabled = false;
    @Input()smsFavorite: boolean = false;
    @Input()smsFormTA: boolean = false;
    isFrecuent = false;
    isFormTA = false;
    isNewTA = true;
    @Output() onChange = new EventEmitter<TransferAbroadFrecuentResult>();
    @Output() onUpdateFrecuent = new EventEmitter<TransferAbroadFrecuentResult>();

    constructor(private transfersAbroadService: TransfersAbroadService,
        private globalService: GlobalService) {
    }

    ngOnInit() {
        this.getFrecuents();
        this.getFormTA();
    }

    getFrecuents() {
        this.frecuentSelected = null!;
        this.transfersAbroadService
            .getTransferFrecuents()
            .subscribe({
                next: (res: TransferAbroadFrecuentResult[]) => {
                    this.frecuents = res.sort((a, b) => a.description.toUpperCase() > b.description.toUpperCase() ? 1 : -1);
                }
            });
    }

    getFormTA() {

        this.frecuentSelected = null!;
        this.transfersAbroadService
            .getFormTransAbroad()
            .subscribe({
                next: (res: TransferAbroadFrecuentResult[]) => {
                    this.formsTA = res.sort((a, b) => a.description.toUpperCase() > b.description.toUpperCase() ? 1 : -1);
                }
            });
    }

    handleChangedFrecuentTransfer() {
      if(this.isFrecuent){
        this.frecuentSelected.options='IsFrecuent';
        this.onChange.emit(this.frecuentSelected);
      }else if(this.isFormTA){
        this.formSelected.options='IsFarmoTA';
        this.onChange.emit(this.formSelected);
      }

    }


    handleUpdatefrecuentTransfer() {
        this.onUpdateFrecuent.emit(this.frecuentSelected);
    }

    showRemoveModal() {
        this.frecuentDeleteSelected = new TransferAbroadFrecuentResult();
        this.isRemoveModalVisible = true;
    }

    handleRemovefrecuentTransfer() {
        this.frecuentDeleteSelected.id = this.frecuentSelected.id;
        const remove: TransferAbroadFrecuentDto = new TransferAbroadFrecuentDto();
        remove.processBatchFrecuentId = this.frecuentDeleteSelected.id;
        this.transfersAbroadService
            .removeFrecuentTransfer(remove)
            .subscribe({
                next: res => {
                    this.getFrecuents();
                    this.isRemoveModalVisible = false;
                    this.globalService.success('Mensaje:', 'Se eliminó correctamente la transferencia frecuente');
                }, error: _err => {
                    this.globalService.danger('Error:', 'Ocurrio un error, por favor intente mas tarde o comuníquese con el administrador del sistema');
                }
            });
    }

    handleFrecuent($event: boolean) {
        this.isFrecuent = $event;
        if (this.isFrecuent) {
            this.frecuentSelected = null!;
            this.isFormTA = false;
            this.isNewTA = false;
        } else {
            this.onChange.emit(new TransferAbroadFrecuentResult());
        }
    }

    handleNewTA($event: boolean) {
        this.isNewTA = $event;
        if (this.isNewTA) {
            this.onChange.emit(new TransferAbroadFrecuentResult());
            this.isFormTA = false;
            this.isFrecuent = false;

        } else {
            this.frecuentSelected = null!;
        }
    }

    handleForm($event: boolean) {
        this.isFormTA = $event;
        if (this.isFormTA) {
            this.formSelected = null!;
            this.isNewTA = false;
            this.isFrecuent = false;
        } else {
            this.onChange.emit(new TransferAbroadFrecuentResult());
        }
    }

    handleGroupChanged($event: any) {
        this.onChange.emit(this.frecuentSelected);
    }
}
