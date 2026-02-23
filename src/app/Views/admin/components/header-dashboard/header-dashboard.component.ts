import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DefaultUrlSerializer, Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { AppConfig } from '../../../../app.config';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { AuthenticationService } from '../../../../Services/users/authentication.service';
import { ItemMenu } from '../../../../Services/users/models/item-menu';
import { UserService } from '../../../../Services/users/user.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-header-dashboard',
  standalone: false,
  templateUrl: './header-dashboard.component.html',
  styleUrl: './header-dashboard.component.css',
  providers: [ParametersService, UserService, AuthenticationService]
})
export class HeaderDashboardComponent implements OnInit {

  menu: ItemMenu[] = [];
  breadMenu: string;
  breadSubMenu: string;
  isVisibleCloseSession: boolean;
  currentUser: any;
  showMenu!: boolean;
  isMobile = false;

  private destroy$ = new Subject<void>();

  showYPFB: boolean;
  isVisibleNewPase = false;
  showNewService = false;
  isVisibleNewBallot = false
  @ViewChild('element') element!: ElementRef;

  constructor(private parametersService: ParametersService, private userService: UserService, private authenticationService: AuthenticationService,
    private router: Router, private config: AppConfig, private breakpointObserver: BreakpointObserver) {

    this.breadMenu = '';
    this.breadSubMenu = '';
    this.isVisibleCloseSession = false;
    this.showYPFB = false;
  }

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;

        // desktop abierto, mobile cerrado
        this.showMenu = !this.isMobile;
      });

    this.currentUser = this.userService.getUserToken();
    this.showNewService = this.config.getConfig('showNewService');
    this.userService
      .getMenu()
      .subscribe({
        next: (resp: any) => {
          if (!this.showNewService) {
            this.isVisibleNewPase = this.currentUser.company_id == '2295' || this.currentUser.company_id == '767' ? true : false;
          }

          this.menu = resp;
          this.showYPFB = this.config.getConfig('showYPFB');
          if (!this.showNewService) {
            if (!this.isVisibleNewPase) {
              for (let item of this.menu) {
                item.items = item.items.filter((x: any) => x.routerLink != 'new-service');
              }
            }
          }
            this.parametersService
              .getListByGroupAndCode(new ParameterDto({ group: 'APIQRM', code: 'APIQRM' }))
              .pipe(
                map(response =>
                  response.some(param => param.value.includes(this.currentUser.company_id))
                )
              )
              .subscribe({
                next: (hasCompany) => {
                  const routerToRemove = hasCompany ? 'qr-report-bcp' : 'qr-report-bcp-copabol';
                  this.menu.forEach(menuItem => {
                    menuItem.items = menuItem.items.filter(
                      (x: any) => x.routerLink !== routerToRemove
                    );
                  });
                },
                error: (err) => console.error('Error al obtener parámetros:', err)
              });


          this.isVisibleNewBallot = true;
          this.parametersService.getListByGroupAndCode(new ParameterDto({ group: 'NEWBG', code: 'BG' }))
            .subscribe({
              next: (response) => {
                for (let item of response) {
                  if (item.value == this.currentUser.company_id || item.value == '000') {
                    this.isVisibleNewBallot = true;
                  }
                }
                if (!this.isVisibleNewBallot) {
                  for (let item of this.menu) {
                    item.items = item.items.filter((x: any) => x.routerLink != 'newBallotOfWarranty');
                  }
                }
              }
            });


        }
      });
  }

  handleCloseModal() {
    this.isVisibleCloseSession = false;
  }
toggleMenu() {
    if (this.isMobile) {
      this.showMenu = !this.showMenu;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /* showMenuToggle() {
    const isMobile = window.innerWidth <= 768;
    this.showMenu = !isMobile ? true : !this.showMenu;
  }

  ngAfterViewInit() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('orientationchange', this.onResize.bind(this));
    this.onResize();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
    window.removeEventListener('orientationchange', this.onResize.bind(this));
  }

  private onResize() {
     this.isMobile = window.innerWidth <= 768;
    this.showMenu = !isMobile;
  } */
  handleCloseSession() {

    if (this.isValidSession()) {
      this.authenticationService.newReload(this.isValidSession());
    } else {
      this.authenticationService.logout();
    }


  }

  private isValidSession(): boolean {
    const user = this.userService.getUserTokenActive();
    if (!user) {
      return false;
    } else {
      return true;
    }
  }
  handleShowModalCloseSession() {
    this.isVisibleCloseSession = true;
  }

  handleRouter($event: ItemMenu) {
    if ($event.label.toString() === 'Soporte') {
      const url = (new DefaultUrlSerializer()).parse('/#/login/functions-features');
      window.open(url.toString(), '_blank');
    } else {
      this.router.navigate([`/${$event.module}/${$event.routerLink}`]);
    }
  }
}
