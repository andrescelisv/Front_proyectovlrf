import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { DocentesComponent } from './admin/docentes/docentes.component';
import { EstudiantesComponent } from './admin/estudiantes/estudiantes.component';
import { GradoComponent } from './admin/grado/grado.component';
import { InstitucionComponent } from './admin/institucion/institucion.component';
import { MateriasComponent } from './admin/materias/materias.component';
import { LoginComponent } from './login.component';
import { AdminModule } from './admin/admin.module';

const routes: Routes = [
   {path: '', redirectTo: 'login', pathMatch : 'full'},
   {path:'login', component: LoginComponent},
   { path: 'admin', loadChildren: () => import(`./admin/admin.module`).then(m => m.AdminModule) },
     {path:'**',redirectTo: 'login', pathMatch : 'full'}
   /*{path:'dashboard',component:DashboardComponent},
   {path:'docentes', component: DocentesComponent},
   {path:'estudiantes', component: EstudiantesComponent},
   {path:'grado', component: GradoComponent},
   {path:'institucion', component: InstitucionComponent},
   {path:'materias', component: MateriasComponent},
   {path:'login', component: LoginComponent},*/
   //{ path: 'dashboard', loadChildren: () => import(`./admin/admin.module`).then(m => m.AdminModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
