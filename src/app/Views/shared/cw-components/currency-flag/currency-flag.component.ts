import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { CurrencyFlag } from '../../../../Services/shared/models/currency-flag';
/* import { CurrencyFlag } from 'src/app/Services/shared/models/currency-flag';
import { UtilsService } from 'src/app/Services/shared/utils.service'; */

@Component({
  selector: 'app-currency-flag',
  standalone: false,
  templateUrl: './currency-flag.component.html',
  styleUrls: ['./currency-flag.component.css'],
  providers: [UtilsService]
})
export class CurrencyFlagComponent implements OnInit, OnChanges {

  selectedFlag?: CurrencyFlag = new CurrencyFlag();
  flags: CurrencyFlag[] = [];
  @Input() flag: string | undefined;
  @Input() visible = false;

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.loadCurrencyFlags();
  }

  loadCurrencyFlags(): void {
    this.utilsService.getCurrencyFlags().subscribe({
      next: (flags) => {
        this.flags = flags;
      },
      error: (err) => {
        //console.error('Error loading currency flags', err);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadCurrencyFlags();
    this.findFlag();
  }

  findFlag() {
    this.selectedFlag = this.flags.find(x => x.currency === this.flag)!;
  }
}
