import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import { RegisterMobileAnnexDialogComponent } from '../register-mobile-annex-dialog/register-mobile-annex-dialog.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-register-mobile-annex',
  standalone: false,
  templateUrl: './register-mobile-annex.component.html',
  styleUrl: './register-mobile-annex.component.css',
})
export class RegisterMobileAnnexComponent {
  @Input() affiliationDocument: any;
  @Input() companyName: string = '';
  @Input() affiliationDocumentJson: any;
  @Input() affiliationDocumentBase64: SafeResourceUrl | null = null;
  @Input() affiliationDocumentBase64Str: String = '';

  @Output() changeStepEvent: EventEmitter<void> = new EventEmitter<void>();


  constructor(private _dialog: MatDialog, private _sanitizer: DomSanitizer,) { }

  openDocumentDialog() {
    this._dialog.open(RegisterMobileAnnexDialogComponent, {
      data: {
        affiliationDocument: `data:application/pdf;base64,${this.affiliationDocumentBase64Str}`,
      },
      panelClass: 'register-mobile-annex-dialog',
    });
  }

  downloadDocument() {
    const actualDate = new Date();
    const day = String(actualDate.getDate()).padStart(2, '0');
    const month = String(actualDate.getMonth() + 1).padStart(2, '0');
    const year = actualDate.getFullYear();

    const fileName = `Anexo de afiliación - ${this.companyName} ${day}-${month}-${year}.pdf`;

    const byteCharacters = atob(this.affiliationDocumentBase64Str as string);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);

  }

}
