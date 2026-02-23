import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ParameterChargeResult } from '../../../../Services/transfers-abroad/models/parameter-charge-result';
import { ParameterASFIResult } from '../../../../Services/transfers-abroad/models/parameter-asfi-result';
import { CategoryASFIData } from '../../../../Services/transfers-abroad/models/category-asfi.data';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-transfer-categories-asfi',
  standalone: false,
  templateUrl: './transfer-categories-asfi.component.html',
  styleUrls: ['./transfer-categories-asfi.component.css']
})
export class TransferCategoriesAsfiComponent implements OnInit, OnChanges {

  @Input() categoryAsfiData: CategoryASFIData = new CategoryASFIData();
  @Input() parametersASFI: ParameterASFIResult[] = [];
  parametersASFISelected: ParameterASFIResult = null!;
  @Output() onChange = new EventEmitter();
  @Input() disabled: boolean = false;
  @ViewChild('formCategoryAsfi') form!: NgForm;
  isVisibleGloss = false;
  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: any/* SimpleChanges */): void {
    if (changes.categoryAsfiData && !changes.categoryAsfiData.isFirstChange()) {
      if (this.categoryAsfiData.categoryASFI !== null) {
        this.parametersASFISelected = this.parametersASFI.find(x => x.categoryNemonId === this.categoryAsfiData.categoryASFI.categoryNemonId)!;
      }
    }
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid;
  }

  handleChangeCategory() {
    this.categoryAsfiData.categoryASFI = this.parametersASFISelected;
    this.onChange.emit(this.categoryAsfiData);
  }

  handleShowGlosary() {
    this.isVisibleGloss = true;
  }
}
