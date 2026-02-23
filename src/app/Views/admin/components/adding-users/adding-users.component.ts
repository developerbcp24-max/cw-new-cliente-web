import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SecurityContext, SimpleChanges } from '@angular/core';
import { GetAccountsResponse } from '../../../../Services/AffiliationRegCw/Models/GetAccountsResponse';
import { GetSignaturesResponse, UserRole } from '../../../../Services/AffiliationRegCw/Models/GetSignaturesResponse';
import { ConsultClientRequest } from '../../../../Services/AffiliationRegCw/Models/ConsultClientRequest';
import { ConsultClientResponse } from '../../../../Services/AffiliationRegCw/Models/ConsultClientResponse';
import { AffiliationRegCwService } from '../../../../Services/AffiliationRegCw/affiliation-reg-cw.service';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AffiliatedUser } from '../../../../Services/AffiliationRegCw/Models/AffiliatedUser';
import { UserInfoDialogComponent } from '../user-info-dialog/user-info-dialog.component';
import { openNotificationDialog } from '../../../../Helpers/notification-dialog.helper';


import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import { ResponseBranchOffices } from '../../../../Services/AffiliationRegCw/Models/ResponseBranchOffices';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CwRolesDialogComponent } from '../cw-roles-dialog/cw-roles-dialog.component';
@Component({
  selector: 'app-adding-users',
  standalone: false,
  templateUrl: './adding-users.component.html',
  styleUrl: './adding-users.component.css'
})
export class AddingUsersComponent implements OnInit, OnChanges {
  [x: string]: any;
  pdfUrl: string = '';
displayedColumns: string[] = ['avatarName', 'actions'];
  @Input() affCompanyId: string = "";
  @Input() selectedAccounts: GetAccountsResponse[] = [];
  signatures: {
    signature: GetSignaturesResponse;
    selected: boolean;
  }[] = [];

 @Input() set setSignatures(values: GetSignaturesResponse[]) {
  this.signatures = values
    .map((value) => {
      return {
        signature: value,
        selected: value.isSelectAff,
      };
    })
    .sort((x, y) => Number(y.selected) - Number(x.selected));
}
  @Input() client: {
    request: ConsultClientRequest;
    response: ConsultClientResponse;
  } = {
    request: new ConsultClientRequest(),
    response: new ConsultClientResponse(),
  };
  @Output() documentDataStringEvent: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() changeStepEvent: EventEmitter<number> = new EventEmitter<number>();
  _respBranchOffices: ResponseBranchOffices[] = [];
  stepOptions = [
    { value: 1, viewValue: 'LR', selected: true },
    { value: 2, viewValue: 'UL', selected: false },
    { value: 3, viewValue: 'AD', selected: false },
  ];
  selectedSignatures: GetSignaturesResponse[] = [];
   newUser: GetSignaturesResponse = new GetSignaturesResponse();
  formCli!: FormGroup;
  constructor(
    private _affiliationService: AffiliationRegCwService,
    private dialog: MatDialog,
    private readonly _sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
  ) {}
  SelectAccount: string[] = [];

  ngOnInit() {
    this.SelectAccount = this.selectedAccounts.map(account => account.noAccount);
    this.initializeFormCli();
    this.getBranchOffice();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['signatures']) {
      if (changes['signatures'].currentValue.length === 0) {
        this.changePage(2);
      } else {
        this.changePage(1);
      }
    }
  }
  changePage(page: number) {;
    for (let item of this.stepOptions) {
      item.selected = item.value === page;
    }
  }
  getAffiliatedUsers(): AffiliatedUser[] {
    this.selectedSignatures = this.signatures

      .filter((signature) => signature.selected)
      .map((sign) => sign.signature);
    const users: AffiliatedUser[] = [];
    users.push(
      ...this.selectedSignatures
        .filter((signature) => signature)
        .map((signature): AffiliatedUser => {
          return {
            name: signature?.names ?? '',
            documentNumber: signature?.personId ?? '',
            complement: signature?.complement ?? '',
            extension: signature?.extension ?? '',
            accountNumber: signature?.nroAccount ?? '',
            email: signature?.email ?? '',
            phone: signature?.phone ?? '',
            lastNames: signature?.lastNames ?? ''
          };
        })
    );
    return users;
  }
  backUserList() {
    this.selectedSignatures = [];
    this.changePage(1);
  }
  updateSelectedAccountAndFirmantesAndGetDocument() {
    this._affiliationService
      .updateSelectedAccountAndFirmantes({
        affCompanyId: this.affCompanyId,
        necessaryAccounts: this.selectedAccounts,
        necessaryfirmantes: this.selectedSignatures,
      })
      .subscribe({
        next: (data: string) => {
          const json = JSON.parse(data);
          pdfMake.createPdf(json).getDataUrl((outDoc: string) => {
            const doc =
              this._sanitizer.sanitize(
                SecurityContext.RESOURCE_URL,
                this._sanitizer.bypassSecurityTrustResourceUrl(outDoc)
              ) ?? '';
            /* const iframe = document.getElementById(
              'iframeDocument'
            ) as HTMLIFrameElement;
            iframe.src = doc; */
            pdfMake.createPdf(json).getDataUrl((outDoc: string) => {
            this.pdfUrl = this._sanitizer.bypassSecurityTrustResourceUrl(outDoc) as string;
            this.documentDataStringEvent.emit(outDoc);
          });
            this.documentDataStringEvent.emit(outDoc);
          });
          this.changeStepEvent.emit(1);
        },
        error: (_) => {
          openNotificationDialog(
            'Error interno, favor comunicarse con Soporte Help Desk a la Linea gratuita 800-10-2244',
            'La solicitud no pudo ser procesada',
            'incorrect',
            'Intentar nuevamente',
            this.dialog
          );
        },
      });
  }
  getInitials(fullName: string): string {
  if (!fullName) return '';

  return fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
openUserInfoDialog(user: AffiliatedUser) {
  //const userAccountNumbers = user.accountNumber.split(',').map(acc => acc.trim());

  // Crear copias profundas para el diálogo
  const userAccounts = this.selectedAccounts
  .filter(acc => acc.isSelectAff === true)
  .map(acc => ({
    ...acc,
    userRols: acc.userRols
      ? acc.userRols.map(role => ({ ...role }))
      : [{
          noAccount: acc.noAccount,
          isController: false,
          isPreparer: false,
          isAuthorizer: false,
          isConsultant: false
        }]
  }));


  const userSignatures = this.selectedSignatures
    .filter(sig => sig.personId === user.documentNumber)
    .map(sig => ({ ...sig })); // Copiar signatures también

  const dialogRef = this.dialog.open(UserInfoDialogComponent, {
    data: {
      user: { ...user }, // Copiar el usuario también
      selectedAccounts: userAccounts,
      selectedSignatures: userSignatures
    },
    panelClass: ['user-info-dialog-class'],
    width: '744px',
    maxWidth: '95vw',
    autoFocus: false,
    restoreFocus: false,
    disableClose: false,
    hasBackdrop: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      //console.log('Modal cerrado con resultado:', result);
    }
  });
}

/* openUserInfoDialog(user: AffiliatedUser) {
  const dialogRef = this.dialog.open(UserInfoDialogComponent, {
    data: {
      user,
      selectedAccounts: this.selectedAccounts,
      selectedSignatures: this.selectedSignatures
    },
    panelClass: ['user-info-dialog-class'],
    width: '744px',
    maxWidth: '95vw',
    autoFocus: false,
    restoreFocus: false,
    disableClose: false,
    hasBackdrop: true
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      ////console.log('Modal cerrado con resultado:', result);
    }
  });
} */
  getBranchOffice() {
		this._affiliationService.getBranchOffice().subscribe({
			next: (data: ResponseBranchOffices[]) => {
				this._respBranchOffices = data;
			},
			error: (error) => {
				////console.warn(error);
			},
		});
	}


  initializeFormCli() {
  this.formCli = this.formBuilder.group({
    personId: [
      this.newUser.personId,
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(16),
      ],
    ],
    extension: [this.newUser.extension, [Validators.required]],
    complement: [this.newUser.complement, [Validators.maxLength(3)]],
    names: [this.newUser.names || '', [Validators.required]],
    lastNames: [this.newUser.lastNames || '', [Validators.required]],
    idcType: [this.newUser.idcType || '', [Validators.required]],
    phone: [this.newUser.phone || '', [Validators.required]],
    email: [this.newUser.email || '', [Validators.required, Validators.email]],
  });
  this.initializeUserRoles();
}
  openRoles() {
      this.dialog.open(CwRolesDialogComponent, {
        panelClass: 'roles-dialog',
      });
    }

getIsConsultant(index: number): boolean {
  if (!this.newUser.userRols || this.newUser.userRols.length === 0) {
    this.initializeUserRoles();
  }
  return this.newUser.userRols?.[index]?.isConsultant || false;
}

setIsConsultant(index: number, value: boolean) {
  if (!this.newUser.userRols || this.newUser.userRols.length === 0) {
    this.initializeUserRoles();
  }

  if (this.newUser.userRols && this.newUser.userRols[index]) {
    this.newUser.userRols[index].isConsultant = value;
  }
}

getIsPreparador(index: number): boolean {
  if (!this.newUser.userRols || this.newUser.userRols.length === 0) {
    this.initializeUserRoles();
  }
  return this.newUser.userRols?.[index]?.isPreparer || false;
}

setIsPreparador(index: number, value: boolean) {
  if (!this.newUser.userRols || this.newUser.userRols.length === 0) {
    this.initializeUserRoles();
  }

  if (this.newUser.userRols && this.newUser.userRols[index]) {
    this.newUser.userRols[index].isPreparer = value;
  }
}

private initializeUserRoles() {
  this.newUser.userRols = this.selectedAccounts.map(account => ({
    noAccount: account.noAccount,
    isController: false,
    isPreparer: false,
    isAuthorizer: false,
    isConsultant: false
  }));
}
resetForm() {
  this.formCli.reset();
  this.newUser = new GetSignaturesResponse();
  this.initializeUserRoles();
  this.changePage(2);
}

addUser() {
  if (this.formCli.valid) {
    this.newUser = { ...this.newUser, ...this.formCli.value };
    this.newUser.nroAccount = this.SelectAccount.join(',');
    this.newUser.isSelectAff = true;
    this.newUser.isMainSignature = false;
    this.newUser.isNewUserAff = true;
    if (!this.newUser.userRols || this.newUser.userRols.length === 0) {
      this.initializeUserRoles();
    }
    this.signatures.push({ signature: this.newUser, selected: true });
    this.selectedSignatures.push(this.newUser);
    this.formCli.reset();
    this.newUser = new GetSignaturesResponse();
    this.initializeUserRoles();
    this.changePage(2);
  }
}
onSignatureCheckboxChange(personId: string, isSelected: boolean) {
  const signatureIndex = this.signatures.findIndex(sig => sig.signature.personId === personId);
  if (signatureIndex !== -1) {
    this.signatures[signatureIndex].selected = isSelected;
    this.signatures[signatureIndex].signature.isSelectAff = isSelected;

  }
}
}
