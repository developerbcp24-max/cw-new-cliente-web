import { MatDialog } from '@angular/material/dialog';
import { DialogNotificationComponent } from '../Views/admin/components/dialog-notification/dialog-notification.component';

export function openNotificationDialog(
  message: string,
  messageTitle: string,
  iconName: string,
  buttonMessage: string,
  dialog: MatDialog,
  onDialogClose: Function = () => {
    // This is intentional
  },
  disableClose: boolean = false,
  showButton: boolean = true
) {
  dialog.open(DialogNotificationComponent, {
    disableClose,
    data: {
      message,
      messageTitle,
      iconName,
      buttonMessage,
      onDialogClose,
      showButton,
    },
    panelClass: 'notification-dialog-class',
  });
}
