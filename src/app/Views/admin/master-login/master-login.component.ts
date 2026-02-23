import { AfterViewChecked, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-login',
  standalone: false,
  templateUrl: './master-login.component.html',
  styleUrl: './master-login.component.css'
})
export class MasterLoginComponent implements OnInit, AfterViewChecked {
  constructor() { // This is intentional
  }

  ngOnInit(): void {
    // This is intentional
  }
  ngAfterViewChecked(): void {
    const captcha = document.getElementsByClassName('grecaptcha-badge') as HTMLCollectionOf<HTMLElement>;
    if (captcha.length > 0) {
      captcha[0].style.display = '';
    }
  }
}
