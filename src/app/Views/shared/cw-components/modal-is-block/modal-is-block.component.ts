import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { AppConfig } from '../../../../app.config';
//import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-modal-is-block',
  standalone: false,
  templateUrl: './modal-is-block.component.html',
  styleUrls: ['./modal-is-block.component.css']
})
export class ModalIsBlockComponent implements OnInit {

  @Input() showMessageIsBlock!: boolean;
  @Output() onCloseModal = new EventEmitter();
  messageIsBlocked: string;

  constructor(@Inject(AppConfig) private config: AppConfig ) {
    this.messageIsBlocked = this.config.getConfig('messageIsBlocked');
   }

  ngOnInit() {
    /*This is intentional*/
  }

  handleClose($event: boolean) {
    this.showMessageIsBlock = $event;
    this.onCloseModal.emit($event);
  }
}
