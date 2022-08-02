import { NgModule, Component, ApplicationModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocentesComponent } from './docentes/docentes.component';
import { EstudiantesComponent } from './estudiantes/estudiantes.component';
import { GradoComponent } from './grado/grado.component';
import { InstitucionComponent } from './institucion/institucion.component';
import { MateriasComponent } from './materias/materias.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AppComponent } from '../app.component';
import { LoginModule } from '../login.module';
import { RHUComponent } from './rhu/rhu.component';
import { NDComponent } from './nd/nd.component';


const routes: Routes = [
  
  {path:'', component: DashboardComponent},
  {path:'dashboard', component: DashboardComponent},
  {path:'body', component: BodyComponent},
  {path:'docentes', component: DocentesComponent},
   {path:'estudiantes', component: EstudiantesComponent},
   {path:'grado', component: GradoComponent},
   {path:'institucion', component: InstitucionComponent},
   {path:'materias', component: MateriasComponent},
   {path:'usuario', component: UsuarioComponent},
   {path:'rhu', component: RHUComponent},
   {path:'nd', component: NDComponent},
   {path:'logout',component:UsuarioComponent,children:[
   {path:'login', component: ApplicationModule}]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
