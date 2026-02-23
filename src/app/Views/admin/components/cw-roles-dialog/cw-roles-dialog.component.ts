import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cw-roles-dialog',
  standalone: false,
  templateUrl: './cw-roles-dialog.component.html',
  styleUrl: './cw-roles-dialog.component.css'
})
export class CwRolesDialogComponent {
constructor(public dialogRef: MatDialogRef<CwRolesDialogComponent>) {}
}
