import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { Constants } from '../../../../Services/shared/enums/constants';

@Component({
  selector: 'app-batch-detail',
  standalone: false,
  templateUrl: './batch-detail.component.html',
  styleUrls: ['./batch-detail.component.css']
})
export class BatchDetailComponent implements OnInit {


  @Input()
  operation!: string;
  @Input()
  batchId!: number;
  @Input()
  operationTypeId!: number;
  @Input()
  isShow!: boolean;
  @Input()
  isAuthorize!: boolean;
  @Output() onChangeDetail = new EventEmitter();
  isDetailBG: boolean = false;

  constants: Constants = new Constants();

  constructor(private parametersService: ParametersService) { }

  ngOnInit(): void {
    this.parametersService.getByGroupAndCode(new ParameterDto({ group: 'NEWBG', code: 'DETBG' }))
      .pipe(
        catchError((error) => {
          if (error.message.includes('No existe el parámetro')) {
            ////console.warn('El parámetro no existe:', error);
            // Manejar el caso específico en el que el parámetro no existe
            this.isDetailBG = false;
          } else {
            //console.error('Error fetching parameter:', error);
            // Manejar otros errores
            this.isDetailBG = false;
          }
          return of(null); // Retornar un observable vacío para continuar el flujo
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.isDetailBG = response.value == 'A' ? true : false;
          }
        }
      });
  }
  /*ngOnInit(): void {
    this.parametersService.getByGroupAndCode(new ParameterDto({ group: 'NEWBG', code: 'DETBG' }))
        .subscribe({next: (response) => {
          this.isDetailBG = response.value == 'A' ? true : false;
        }});
  }*/

  handleChangeDetail() {
    this.onChangeDetail.emit();
  }

}
