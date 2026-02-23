import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {}

  open<T, D = any>(component: new (...args: any[]) => T, config: any = {}): MatDialogRef<T, D> {
    return this.dialog.open<T, D>(component, config);
  }
}
