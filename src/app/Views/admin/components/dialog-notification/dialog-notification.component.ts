import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-notification',
  standalone: false,
  templateUrl: './dialog-notification.component.html',
  styleUrl: './dialog-notification.component.css',
})
export class DialogNotificationComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      messageTitle: string;
      message: string;
      onDialogClose: Function;
      iconName: string;
      buttonMessage: string;
      iconType?: 'error' | 'warning' | 'success';
      showButton?: boolean;
    },

    public dialogRef: MatDialogRef<DialogNotificationComponent>
  ) {}

  closeDialog() {
    this.data.onDialogClose();
    this.dialogRef.close();
  }
}
