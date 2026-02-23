import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-elements',
  standalone: false,
  templateUrl: './dialog-elements.component.html',
  styleUrl: './dialog-elements.component.css'
})
export class DialogElementsComponent {
  constructor(private router: Router) {}
  newRegister() {
    this.router.navigate(['/register']);
  }
}
