import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-route',
  standalone: false,
  templateUrl: './bar-route.component.html',
  styleUrls: ['./bar-route.component.css']
})
export class BarRouteComponent implements OnInit {

  @Input() isLast: boolean = false;
  constructor() {
    // This is intentional
  }

  ngOnInit(): void {
    // This is intentional
  }

}
