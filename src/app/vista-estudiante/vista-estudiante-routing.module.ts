import { NgModule, Component, ApplicationModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';
import { UsuarioComponent } from '../admin/usuario/usuario.component';
import { LoginComponent } from '../login.component';



const routes: Routes = [
  
  {path:'', component: DashboardComponent},
   {path:'logout',component:UsuarioComponent,children:[
   {path:'login', component: ApplicationModule}]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
