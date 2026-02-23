import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-new-loader',
  standalone: false,
  templateUrl: './new-loader.component.html',
  styleUrl: './new-loader.component.css'
})
export class NewLoaderComponent {
  /* @Input() isLoading: boolean = true;
  @Input() text: string = 'Procesando transacción...';
  @Input() showProgress: boolean = false;
  @Input() progress: number = 0;
  @Input() showLogo: boolean = true;
  @Input() logoText: string = 'B';
  @Input() overlayOpacity: number = 80; // Valor de opacidad de 0 a 100
  @Input() primaryColor: string = 'blue';
  @Input() zIndex: number = 9999; */
  @Input() loading: boolean = false;
}
