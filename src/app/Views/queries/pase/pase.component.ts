import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Services/users/user.service';

@Component({
  selector: 'app-pase',
  standalone: false,
  templateUrl: './pase.component.html',
  styleUrls: ['./pase.component.css']
})
export class PaseComponent implements OnInit {
  public dateInitMain:Date=new Date();
  public dateEndMain: Date = new Date();
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getValidateCurrentUser();
  }

}
