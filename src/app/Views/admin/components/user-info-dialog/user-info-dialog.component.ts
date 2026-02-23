import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface AffiliatedUser {
  accountNumber: string;
  name: string;
  email: string;
  documentNumber: string;
  complement?: string;
  extension?: string;
  phone: string;
  lastNames?: string;
}

export interface Account {
  accountNumber: string;
  noAccount: string;
  userRols: UserRole[];
  // Agregar otras propiedades si las necesitas
}
export interface UserRole {
  isAuthorizer: boolean;
  isController: boolean;
  isPreparer: boolean;
  isConsultant: boolean;
  noAccount: string;
}
export interface GetSignaturesResponse {
  nroAccount: string;
  personId: string;
  idcType: string;
  extension: string;
  complement: string;
  names: string;
  lastNames: string;
  type: string;
  email: string;
  phone: string;
  isSelectAff: boolean;
  isMainSignature: boolean;
  isNewUserAff: boolean;
  userRols?: UserRole[];
}
export interface DialogData {
  user: AffiliatedUser;
  selectedAccounts: Account[];
  selectedSignatures: GetSignaturesResponse[];
}

@Component({
  selector: 'app-user-info-dialog',
  standalone: false,
  templateUrl: './user-info-dialog.component.html',
  styleUrl: './user-info-dialog.component.css'
})
export class UserInfoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UserInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
  isConsultant(account: Account): boolean {
    const found = this.data.selectedSignatures.find((s: any) =>
    s.nroAccount==='' && s.userRols!=null
  );
  if (found?.userRols && Array.isArray(found.userRols)) {
    const isConsult = found.userRols.some(role => role.isConsultant);
    return isConsult;
  }
  if (account.userRols && Array.isArray(account.userRols)) {
    const isAuth: boolean = account.userRols?.some((role: UserRole) => role.isAuthorizer) ?? false;

  return isAuth;
  }

  return false;
}

isPreparer(account: any): boolean {
  const found = this.data.selectedSignatures.find((s: any) =>
    s.nroAccount==='' && s.userRols!=null
  );
  if (found?.userRols && Array.isArray(found.userRols)) {
    const isPrep = found.userRols.some(role => role.isPreparer);
    return isPrep;
  }
  if (account.userRols && Array.isArray(account.userRols)) {
    const isPrep: boolean = account.userRols?.some((role: UserRole) => role.isPreparer) ?? false;
  return isPrep;
  }
  return false;
}

  isAuthorizer(account: any): boolean {
  const found = this.data.selectedSignatures.find((s: any) =>
    s.nroAccount==='' && s.userRols!=null
  );
  if (found?.userRols && Array.isArray(found.userRols)) {
    const isAuth = found.userRols.some(role => role.isAuthorizer);
    return isAuth;
  }
  if (account.userRols && Array.isArray(account.userRols)) {
    const isAuth: boolean = account.userRols?.some((role: UserRole) => role.isAuthorizer) ?? false;
  return isAuth;
  }
  return false;
}
}
