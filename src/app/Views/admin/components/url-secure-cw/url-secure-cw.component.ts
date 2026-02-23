import { Component } from '@angular/core';

@Component({
  selector: 'app-url-secure-cw',
  standalone: false,
  templateUrl: './url-secure-cw.component.html',
  styleUrl: './url-secure-cw.component.css'
})
export class UrlSecureCwComponent {
urlSecure(): void {
    window.open('https://www.globalsign.com/es/ssl/secure-site-seal', '_blank');
  }
}
