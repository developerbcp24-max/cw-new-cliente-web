import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { UserInvolved } from '../../../../Services/shared/models/user-involved';

@Component({
  selector: 'app-approvers-and-controllers-detail',
  standalone: false,
  templateUrl: './approvers-and-controllers-detail.component.html',
  styleUrls: ['./approvers-and-controllers-detail.component.css']
})
export class ApproversAndControllersDetailComponent implements OnInit {

  @Input() details: UserInvolved [] = [];
  isRejected = false;

  constructor() {/*This is intentional*/ }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.details !== undefined) {
      this.isRejected = this.details.find(x => x.userDescription === 'RECHAZADO') ? true : false;
    }
  }

}
