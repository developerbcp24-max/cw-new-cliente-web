import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CurrencyFlag } from '../../../../Services/shared/models/currency-flag';
import { UtilsService } from '../../../../Services/shared/utils.service';

@Component({
  selector: 'app-depecrated-currency-flag',
  standalone: false,
  templateUrl: './depecrated-currency-flag.component.html',
  styleUrls: ['./depecrated-currency-flag.component.css'],
  providers: [UtilsService]
})
export class DepecratedCurrencyFlagComponent implements OnInit, OnChanges {

  selectedFlag: CurrencyFlag = new CurrencyFlag();
  flags: CurrencyFlag[] = [];
  @Input() flag!: string;
  @Input() visible = false;

  constructor(private utilsService: UtilsService) { }

  ngOnInit() {
    this.utilsService.getCurrencyFlags()
    .subscribe({next: response => {
      this.flags = response;
      this.findFlag();
    }});
  }

  ngOnChanges(changes: SimpleChanges) {
    this.findFlag();
  }

  findFlag() {
    this.selectedFlag = this.flags.find(x => x.currency === this.flag)!;
  }
}
