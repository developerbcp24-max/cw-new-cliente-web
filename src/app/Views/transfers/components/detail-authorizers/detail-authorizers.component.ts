import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from '../../../../Services/users/user.service';

@Component({
  selector: 'app-detail-authorizers',
  standalone: false,
  templateUrl: './detail-authorizers.component.html',
  styleUrls: ['./detail-authorizers.component.css']
})
export class DetailAuthorizersComponent implements OnInit, OnChanges {

  @Input() namesApprovers: any = [];
  is_asingature!: boolean;
  asingature: any;

  constructor(private userService: UserService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: any): void {
    this.asingature = this.userService.getUserToken();
    this.is_asingature = this.asingature.is_signature;
  }


}
