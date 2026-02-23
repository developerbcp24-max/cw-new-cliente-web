import { Component, OnInit, forwardRef, ViewChild, Input } from '@angular/core';
import { BallotOfWarrantyService } from '../../../../Services/ballot-of-warranty/ballot-of-warranty.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { BallotOfWarrantyDto } from '../../../../Services/ballot-of-warranty/models/ballot-of-warranty-dto';
import { NgForm, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BallotOfWarrantyContractRoeDto } from '../../../../Services/ballot-of-warranty/models/ballot-of-warranty-contract-reo-dto';

@Component({
  selector: 'app-roedata',
  standalone: false,
  templateUrl: './roedata.component.html',
  styleUrls: ['./roedata.component.css'],
  providers: [BallotOfWarrantyService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RoedataComponent),
      multi: true
    }]
})
export class RoedataComponent implements OnInit, ControlValueAccessor {

  ballot: BallotOfWarrantyDto = new BallotOfWarrantyDto();
  @Input() disabled = false;
  @ViewChild('formComponent') form!: NgForm;

  constructor(private globalService: GlobalService) {
  }

  ngOnInit() {
    /*This is intentional*/
  }

  changeFile($event: any): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    if (file.type === 'application/pdf') {
      const myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {
        this.ballot.contractRoe = new BallotOfWarrantyContractRoeDto();
        this.ballot.contractRoe.roeDocument = myReader.result!.toString();
        this.propagateChange(this.ballot);
      };
      myReader.readAsDataURL(file);
    } else {
      this.ballot.contractRoe.roeDocument = null!;
      this.globalService.warning('Error al cargar el archivo', 'Debe seleccionar un archivo PDF válido');
    }
  }

  handleValidate(): boolean {
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid!;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.ballot = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(_fn: any): void {
    //not more
  }

  propagateChange = (_: any) => {
    //not more
  };
}
