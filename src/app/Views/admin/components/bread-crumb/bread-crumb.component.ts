import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UserService } from '../../../../Services/users/user.service';

@Component({
  selector: 'app-bread-crumb',
  standalone: false,
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {
  module = '';
  subModule = '';
  isHome = false;
  currentUser: any ;


  constructor(private router: Router, private userService: UserService) {
    this.currentUser = this.userService.getUserToken();
  }

  ngOnInit() {
    this.userService.getMenu().subscribe({next: resul => {
      const itemsMenu = resul;
      this.parseURL(this.router.url, itemsMenu);
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe({next: (_event) => {
          this.parseURL(this.router.url, itemsMenu);
        }});
    }});
  }

  parseURL(url: string, itemsMenu: any) {
  const detailPase = 'detail-pase';
  const creditCardsMovements = 'creditCardsMovements';
  this.isHome = false;

  try {
    url = url.substring(1);
    const links = url.split('/');

    if (url !== '' && links[0] !== 'login' && links.length > 1) {

      const moduleTemp = itemsMenu.find((x: any) => x.module === links[0]);

      // si el módulo no existe o no tiene items
      if (!moduleTemp || !Array.isArray(moduleTemp.items)) {
        return this.home();
      }

      this.module = moduleTemp.label ?? '';

      // casos especiales
      if (links[1].includes(detailPase)) {
        this.subModule = 'Recaudaciones';
        return;
      }

      if (links[1].includes(creditCardsMovements)) {
        this.subModule = 'Tarjetas de Crédito';
        return;
      }

      // buscar submódulo
      const sub = moduleTemp.items.find((x: any) => x.routerLink === links[1]);

      // ← ESTA LÍNEA ES LA QUE EVITA TU ERROR
      this.subModule = sub?.label ?? '';

    } else {
      this.home();
    }
  } catch (error) {
    //console.log(error);
  }
}


  home() {
    this.isHome = true;
    this.module = '';
    this.subModule = '';
  }
}
