import { Component } from '@angular/core';
import { SidenavComponent } from './admin/sidenav/sidenav.component';

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
  onToggleSideNav(data: SideNavToggle): void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
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
