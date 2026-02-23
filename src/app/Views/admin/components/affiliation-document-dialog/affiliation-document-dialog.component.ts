import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-affiliation-document-dialog',
  standalone: false,
  templateUrl: './affiliation-document-dialog.component.html',
  styleUrl: './affiliation-document-dialog.component.css',
})
export class AffiliationDocumentDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { documentDataString: string },

    public dialogRef: MatDialogRef<AffiliationDocumentDialogComponent>
  ) {}

  ngOnInit() {
    const iframe = document.getElementById(
      'iframeDocumentDialog'
    ) as HTMLIFrameElement;
    iframe.src = this.data.documentDataString;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
