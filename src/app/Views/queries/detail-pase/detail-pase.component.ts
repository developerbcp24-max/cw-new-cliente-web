
import { Component, OnInit } from '@angular/core';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { Router } from '@angular/router';
import { RequestModelHeadPase } from '../../../Services/pase/Models/Request-model-pase';
import { ListPaseComponent } from '../components/list-pase/list-pase.component'

@Component({
  selector: 'app-detail-pase',
  standalone: false,
  templateUrl: './detail-pase.component.html',
  styleUrls: ['./detail-pase.component.css']
})
export class DetailPaseComponent implements OnInit {
  dateIni!: string;
  dateEnd!: string;
  CodeServ!: string;
  request!: RequestModelHeadPase;
  constructor(private router: Router) { }

  ngOnInit() {
    this.dateIni = this.router.parseUrl(this.router.url).queryParams['DateIniHeadStr'];
    this.dateEnd = this.router.parseUrl(this.router.url).queryParams['DateEndHeadStr'];
    this.CodeServ = this.router.parseUrl(this.router.url).queryParams['numberAccount'];
    this.request = { DatesInicial: this.dateIni, DatesEnd: this.dateEnd, CodeService: this.CodeServ };
  }
}
