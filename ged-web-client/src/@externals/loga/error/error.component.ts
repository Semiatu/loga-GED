import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  providers: []
})
export class ErrorComponent implements OnInit {

  constructor(private router: Router) {
    console.log(this.router);
  }

  ngOnInit() {
  }

}
