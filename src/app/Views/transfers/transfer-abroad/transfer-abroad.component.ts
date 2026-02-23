import { Component, OnInit } from '@angular/core';
import { TransferAbroadDetailDto } from '../../../Services/transfers-abroad/models/transfer-abroad-detail-dto';
import { Router } from '@angular/router';
import { GlobalService } from '../../../Services/shared/global.service';
import { TransferAbroadDto } from '../../../Services/transfers-abroad/models/transfer-abroad-dto';
import { TransfersAbroadService } from '../../../Services/transfers-abroad/transfer-abroad.service';
import { UserService } from '../../../Services/users/user.service';

@Component({
  selector: 'app-transfer-abroad',
  standalone: false,
  templateUrl: './transfer-abroad.component.html',
  styleUrls: ['./transfer-abroad.component.css'],
  providers: [TransfersAbroadService]
})
export class TransferAbroadComponent implements OnInit {

  currentStep: number;
  batch!: number;
  detail: TransferAbroadDetailDto = new TransferAbroadDetailDto();
  namesApprovers: any[] = [];
  isAvailable = false;
  isAvailableMessage!: string;
  resultFunds: TransferAbroadDto = new TransferAbroadDto();
  resultFundsUif: TransferAbroadDto = new TransferAbroadDto();

  constructor(private router: Router, private userService: UserService) {
    this.currentStep = 1;
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
  }

  handleFunds($event: TransferAbroadDto) {
    this.resultFunds = $event;
    this.resultFundsUif = $event;
  }

  handleChangeStep1($event: number) {
    this.batch = $event;
    this.currentStep = 2;
  }

  handleSaveFavorite() {
    this.currentStep = 1;
    this.batch = null!;
  }

  handlePreviusForm() {
    this.currentStep = 2;
  }

  handleSaveTransfer($event: TransferAbroadDetailDto) {
    this.detail = $event;
    this.currentStep = 3;
  }

  handleResultUif($event: TransferAbroadDto) {

  }

  handleNamesApprovers($event: any[]) {
    this.namesApprovers = $event;
  }

  handlePreviusStep() {
    switch (this.currentStep) {
      case 2:
        this.router.navigate(['/transfers/transfer-abroad']);
        break;
      case 3:
        this.handlePreviusForm();
        break;
      default:
        this.currentStep = this.currentStep - 1;
        break;
    }
  }
}
