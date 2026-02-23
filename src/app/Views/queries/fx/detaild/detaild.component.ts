import {Component, Input, OnInit} from '@angular/core';
import {TransactionFx} from "../../../../Models/transaction-fx";

@Component({
  selector: 'app-detaild',
  standalone: false,
  templateUrl: './detaild.component.html',
  styleUrls: ['./detaild.component.css']
})
export class DetaildComponent {
  @Input() transactionFx!: TransactionFx;
}
