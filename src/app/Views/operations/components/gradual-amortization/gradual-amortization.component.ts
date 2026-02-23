import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { DateAndDescription } from '../../../../Services/ballot-of-warranty/models/date-and-description';

@Component({
  selector: 'app-gradual-amortization',
  standalone: false,
  templateUrl: './gradual-amortization.component.html',
  styleUrls: ['./gradual-amortization.component.css'],
  providers: [UtilsService]
})
export class GradualAmortizationComponent implements OnInit {

  date!: Date;
  dates: DateAndDescription = new DateAndDescription();
  @Output() action = new EventEmitter();
  public options!: IMyDpOptions;
  constructor(private utilsService: UtilsService) {
    this.options = {
      editableDateField: false,
      openSelectorOnInputClick: true,
      dateFormat: 'dd/mm/yyyy',
      inline: false,
      disableUntil: this.utilsService.getToday()
    };
  }

  ngOnInit() {
    /*This is intentional*/
  }

  handleBallotOfWarrantyData() {
    this.action.emit(this.dates);
  }

  handledate($event: any) {
    this.dates.date = $event;
    this.handleBallotOfWarrantyData();
  }

}
