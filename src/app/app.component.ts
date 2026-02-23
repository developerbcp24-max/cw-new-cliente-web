import { Component, OnInit } from '@angular/core';
import { InactivitySessionService } from './Services/inactivity-session/inactivity-session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'bcp-credinet-web';
  constructor(readonly inactivitySessionService: InactivitySessionService) {}
  ngOnInit() {
    if (sessionStorage.getItem('userActual')) {
      this.inactivitySessionService.startUserActivityInSessionDetection();
    }
  }
}
