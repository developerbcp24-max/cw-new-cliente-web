import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { ProcessBatchDto } from '../../../../Services/shared/models/process-batch';
import { GlobalService } from '../../../../Services/shared/global.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-funds-modal',
  standalone: false,
  templateUrl: './funds-modal.component.html',
  styleUrls: ['./funds-modal.component.css']
})
export class FundsModalComponent implements OnInit {

  @Input() showFundsDestination!: boolean;
  @Input() batchInformation!: ProcessBatchDto;
  @Output() uifRecovered = new EventEmitter<boolean>();
  @ViewChild('fundsForm') fundsForm!: NgForm;
  @Output() onCloseFunds = new EventEmitter();

  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  UifRecovered() {
    this.globalService.validateAllFormFields(this.fundsForm.form);
    if (this.fundsForm.valid) {
      this.showFundsDestination = false;
      this.uifRecovered.emit(true);
    }
  }

  handleCloseFunds($event: boolean) {
    this.showFundsDestination = $event;
    this.onCloseFunds.emit($event);
  }

}
