import { ApplicationModule, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { DocentesComponent } from './admin/docentes/docentes.component';
import { EstudiantesComponent } from './admin/estudiantes/estudiantes.component';
import { GradoComponent } from './admin/grado/grado.component';
import { InstitucionComponent } from './admin/institucion/institucion.component';
import { MateriasComponent } from './admin/materias/materias.component';
import { LoginComponent } from './login.component';
import { AdminModule } from './admin/admin.module';
import { HomeModule } from './home/home.module';
import { ListaVideosComponent } from './home/lista-videos/lista-videos.component';
import { ControllerModule } from './controller/controller.module';
import { ControllerComponent } from './controller/controller/controller.component';
import  { ModuleWithProviders} from "@angular/core";
import { AdminComponent } from './admin/admin.component';
import { BodyComponent } from './admin/body/body.component';
import { RHUComponent } from './admin/rhu/rhu.component';
import { NDComponent } from './admin/nd/nd.component';
import { LVComponent } from './admin/lv/lv.component';
import { RaComponent } from './admin/ra/ra.component';
import { ValVidComponent } from './admin/val-vid/val-vid.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { ComentariosComponent } from './admin/comentarios/comentarios.component';
import { TemplateComponent } from './admin/template/template.component';
import { VistaEstudianteComponent } from './vista-estudiante/vista-estudiante/vista-estudiante.component';

const routes: Routes = [
   {path: '', redirectTo: 'admin', pathMatch : 'full'},
   {path:'login', component: LoginComponent},
  {path:'home', component: ControllerComponent,children:[
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    { path: 'overview', component: ListaVideosComponent }

  ]},
  {path:'lista', component: ListaVideosComponent},
  {path:'admin', component:AdminComponent,children:[
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
   {path:'lv', component: LVComponent},
   {path:'valvideos', component: ValVidComponent},
   {path:'ra', component: RaComponent},
   {path:'comentario', component: ComentariosComponent},
   {path:'tc', component: TemplateComponent},
   {path:'logout',component:UsuarioComponent,children:[
   {path:'login', component: ApplicationModule}]}
   ]


},

{path:'estudiante',component:VistaEstudianteComponent},
  
   //{path:'home', loadChildren: () => import(`./controller/controller.module`).then(m => m.ControllerModule)},
  // { path: 'admin', loadChildren: () => import(`./admin/admin.module`).then(m => m.AdminModule)},
   
     {path:'**',redirectTo: 'admin', pathMatch : 'full'}
   /*{path:'dashboard',component:DashboardComponent},
   {path:'docentes', component: DocentesComponent},
   {path:'estudiantes', component: EstudiantesComponent},
   {path:'grado', component: GradoComponent},
   {path:'institucion', component: InstitucionComponent},
   {path:'materias', component: MateriasComponent},
   {path:'login', component: LoginComponent},*/
   //{ path: 'dashboard', loadChildren: () => import(`./admin/admin.module`).then(m => m.AdminModule) },
];
export const appRoutingProviders: any[]=[];
export const routing: ModuleWithProviders<any>=
RouterModule.forRoot(routes);
@NgModule({
  //imports: [RouterModule.forRoot(routes,{ enableTracing: true })],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
