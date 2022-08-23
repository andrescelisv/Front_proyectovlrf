import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavComponent } from './admin/sidenav/sidenav.component';
import { Location } from '@angular/common';
interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}

interface loading {
  loadingadmin : boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Admin-proyectovlrf';
  loginadmin = true;
  isSideNavCollapsed= false;
  screenWidth=0;
  route: string;
  ruta:string;
constructor(location: Location,private router: Router){
  this.ruta= location.path();
  console.log(this.ruta);
  router.events.subscribe((val) => {
    console.log(location.path())
   
    
  })
}

  onToggleSideNav(data: SideNavToggle): void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }


  boton(){
    console.log(this.router.url);
    this.router.navigate(['/homelist']);
    console.log("si");
    console.log(this.router.url); 
  }
 /**
  * The function onloginadmit() is a function that takes in a parameter of type loading. The function
  * then sets the value of the variable loginadmin to the value of the loadingadmin property of the
  * loading object
  * @param {loading} data - loading
  */
  onloginadmit(data:loading):void{
    this.loginadmin=data.loadingadmin;
   
  }
}
