import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mat-toolbar-home',
  templateUrl: './mat-toolbar-home.component.html',
  styleUrls: ['./mat-toolbar-home.component.scss']
})
export class MatToolbarHomeComponent implements OnInit {

  constructor( private router:Router) { }

  ngOnInit(): void {
  }


  logout(){
    console.log("si logout ");
    this.router.navigate(['/']);
  }

}
