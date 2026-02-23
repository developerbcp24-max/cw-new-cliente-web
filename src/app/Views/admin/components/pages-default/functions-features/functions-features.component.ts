import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../Services/users/authentication.service';

@Component({
  selector: 'app-functions-features',
  standalone: false,
  templateUrl: './functions-features.component.html',
  styleUrl: './functions-features.component.css'
})
export class FunctionsFeaturesComponent {
constructor(private router: Router, public authService: AuthenticationService) {}
  goBack() {
    if (this.authService.isValidSession()) {
      this.router.navigate(['/']); // ruta principal si está autenticado
    } else {
      this.router.navigate(['/login']); // opcional: si no hay token
    }
  }
}
