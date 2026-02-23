import { Component } from '@angular/core';

@Component({
  selector: 'app-whats-app-ia',
  standalone: false,
  templateUrl: './whats-app-ia.component.html',
  styleUrl: './whats-app-ia.component.css'
})
export class WhatsAppIaComponent {

  openWhatsApp() {
    window.open('https://api.whatsapp.com/send/?phone=59172006740', '_blank');
  }
}
