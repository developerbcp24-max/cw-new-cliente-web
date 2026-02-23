import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upload-file',
  standalone: false,
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent{

  constructor() {/*This is intentional*/ }

  @Input() Label: string = "Seleccione un Archivo";
  @Input() Extension: string = ".txt";

  @Output() onEvent_SelectFile = new EventEmitter();

  public onSelectFile($event: any){
    if ($event.target.files && $event.target.files.length > 0) {
      this.onEvent_SelectFile.emit($event.target.files[0]);
    }
  }
}
