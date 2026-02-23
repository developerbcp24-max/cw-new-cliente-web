import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../Services/users/user.service';
//import { UserService } from 'src/app/Services/users/user.service';

@Component({
  selector: 'app-company-name',
  standalone: false,
  templateUrl: './company-name.component.html',
  styleUrls: ['./company-name.component.css']
})
export class CompanyNameComponent implements OnInit {

  user: any;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.getUserToken();
  }

}
