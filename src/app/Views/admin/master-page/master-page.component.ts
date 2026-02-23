import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { AppConfig } from '../../../app.config';
import { DataService } from '../../../Services/shared/data.service';
import { AuthenticationService } from '../../../Services/users/authentication.service';

@Component({
  selector: 'app-master-page',
  standalone: false,
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.css'],
})
export class MasterPageComponent implements OnInit, AfterViewInit {
  isVisibleSesion = false;
  url = '';

  constructor(
    router: Router,
    public dataService: DataService,
    private config: AppConfig,
    private authenticationService: AuthenticationService,
    private userIdle: UserIdleService
  ) {

    router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    router.events.subscribe({
      next: (evt: Event) => {
        if (evt instanceof NavigationEnd) {
          this.dataService.noAccounts = false;
          router.navigated = false;
          window.scrollTo(0, 0);
        }
      },

    });
  }

  ngOnInit(): void {
    let validateSesionTime = this.config.getConfig('validateSesionTime');
    if (validateSesionTime) {
      this.addingTimeout();
    }
  }

  ngAfterViewInit(): void {
    const captcha = document.getElementsByClassName(
      'grecaptcha-badge'
    ) as HTMLCollectionOf<HTMLElement>;

    if (captcha.length > 0) {
      captcha[0].style.display = 'none';
    }
  }

  addingTimeout(): void {
    let time = this.config.getConfig('redirectionMinutes');
    let newTime = Number(time);
    this.userIdle.setConfigValues({ idle: newTime, timeout: 1, ping: 0 });
    this.userIdle.startWatching();
    this.userIdle.onTimerStart().subscribe((_resp: any) => {
      this.userIdle.resetTimer();
      this.userIdle.stopTimer();
      this.userIdle.stopWatching();
      this.authenticationService.logout();
      sessionStorage.removeItem('userActual');
      sessionStorage.clear();
      window.location.href = this.url;

    });
  }

  redirectLogin() {
    this.userIdle.onTimeout().subscribe(() => {
      this.userIdle.stopTimer();
      this.userIdle.stopWatching();
      this.authenticationService.logout();
      sessionStorage.removeItem('userActual');
      sessionStorage.clear();
      this.isVisibleSesion = false;
      window.location.href = this.url;
    });
  }


  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.stopTimer();
    this.userIdle.stopWatching();
    this.addingTimeout();
    this.isVisibleSesion = false;
  }
}
