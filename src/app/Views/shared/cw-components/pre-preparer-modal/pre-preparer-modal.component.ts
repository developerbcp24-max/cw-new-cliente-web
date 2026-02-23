import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constants } from '../../../../Services/shared/enums/constants';
//import { Constants } from 'src/app/Services/shared/enums/constants';

@Component({
  selector: 'app-pre-preparer-modal',
  standalone: false,
  templateUrl: './pre-preparer-modal.component.html',
  styleUrls: ['./pre-preparer-modal.component.css']
})
export class PrePreparerModalComponent implements OnInit {

  @Input() isPreSave = false;
  messagePrePreparer = Constants.messagePrePreparer;
  @Output() prePreparer = new EventEmitter();

  constructor() { /*This is intentional*/}

  ngOnInit() {
    /*This is intentional*/
  }

  handleIsPreparer(isCancel: boolean) {
    this.prePreparer.emit(isCancel);
  }
}
