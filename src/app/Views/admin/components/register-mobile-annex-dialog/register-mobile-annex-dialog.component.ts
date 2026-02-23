import { Component, Inject, OnInit, SecurityContext } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-mobile-annex-dialog',
  standalone: false,
  templateUrl: './register-mobile-annex-dialog.component.html',
  styleUrl: './register-mobile-annex-dialog.component.css',
})
export class RegisterMobileAnnexDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { affiliationDocument: any },

    public dialogRef: MatDialogRef<RegisterMobileAnnexDialogComponent>
  ) {}

  ngOnInit() {
    const iframe = document.getElementById(
      'iframeDocumentDialog'
    ) as HTMLIFrameElement;
    iframe.src = this.data.affiliationDocument;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
