import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }
}
