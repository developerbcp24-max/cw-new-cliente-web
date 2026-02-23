import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AffiliationRegCwService } from '../../../../Services/AffiliationRegCw/affiliation-reg-cw.service';
import { ResponseTermsAndConditions } from '../../../../Services/AffiliationRegCw/Models/ResponseTermsAndConditions';

@Component({
  selector: 'app-terms-conditions-dialog',
  standalone: false,
  templateUrl: './terms-conditions-dialog.component.html',
  styleUrl: './terms-conditions-dialog.component.css'
})
export class TermsConditionsDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TermsConditionsDialogComponent>,
    private _affiliationService: AffiliationRegCwService
  ) {}

  ngOnInit(): void {
    this.getTermsAndConditions();
  }

  termsAndConditions: string = '';

  getTermsAndConditions() {
    this._affiliationService.getTermsAndConditions().subscribe({
      next: (data: ResponseTermsAndConditions) => {
        this.termsAndConditions = data.containContract;
      },
      error: (error) => {
        //console.warn(error);
      },
    });
  }
}
