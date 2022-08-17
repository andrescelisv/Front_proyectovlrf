import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InstitucionComponent } from './institucion/institucion.component';
import { DocentesComponent } from './docentes/docentes.component';
import { EstudiantesComponent } from './estudiantes/estudiantes.component';
import { MateriasComponent } from './materias/materias.component';
import { GradoComponent } from './grado/grado.component';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './admin-routing.module';
import { UsuarioComponent } from './usuario/usuario.component';
import { SharedModule } from '../shared/shared.module';
import { UsuarioDialogComponent } from './usuario/usuario-dialog/usuario-dialog.component';
import { MatToolbarHomeComponent } from './mat-toolbar-home/mat-toolbar-home.component';
import { TableConsumerAddComponent } from './table-consumer-add/table-consumer-add.component';
import { DocenteDialogComponent } from './docentes/docente-dialog/docente-dialog.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { EstudianteDialogComponentComponent } from './estudiantes/estudiante-dialog-component/estudiante-dialog-component.component';
import { InstitucionDialogComponent } from './institucion/institucion-dialog/institucion-dialog.component';
import { ControlMessagesComponent } from './control-messages/control-messages.component';
import { GradoDialogComponent } from './grado/grado-dialog/grado-dialog.component';
import { TemplateComponent } from './template/template.component';
import { MateriaDialogComponent } from './materias/materia-dialog/materia-dialog.component';
import { RHUComponent } from './rhu/rhu.component';
import { RhuDialogComponent } from './rhu/rhu-dialog/rhu-dialog.component';
import { NDComponent } from './nd/nd.component';
import { NdDialogComponent } from './nd/nd-dialog/nd-dialog.component';
import { LVComponent } from './lv/lv.component';
import { LvDialogComponent } from './lv/lv-dialog/lv-dialog.component';
import { ValVidComponent } from './val-vid/val-vid.component';
import { ValVidDialogComponent } from './val-vid/val-vid-dialog/val-vid-dialog.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { RaComponent } from './ra/ra.component';
import { RaDialogComponent } from './ra/ra-dialog/ra-dialog.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { ComentariosDialogComponent } from './comentarios/comentarios-dialog/comentarios-dialog.component';
import { TitlecaseComponent } from './titlecase/titlecase.component';






@NgModule({
  declarations: [
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    InstitucionComponent,
    DocentesComponent,
    EstudiantesComponent,
    MateriasComponent,
    GradoComponent,
    UsuarioComponent,
    UsuarioDialogComponent,
    MatToolbarHomeComponent,
    TableConsumerAddComponent,
    DocenteDialogComponent,
    TableConsumerAddComponent,
    EstudianteDialogComponentComponent,
    InstitucionDialogComponent,
    ControlMessagesComponent,
    GradoDialogComponent,
    TemplateComponent,
    MateriaDialogComponent,
    RHUComponent,
    RhuDialogComponent,
    NDComponent,
    NdDialogComponent,
    LVComponent,
    LvDialogComponent,
    ValVidComponent,
    ValVidDialogComponent,
    RaComponent,
    RaDialogComponent,
    ComentariosComponent,
    ComentariosDialogComponent,
    TitlecaseComponent
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    SharedModule,
    RatingModule.forRoot(),
    NgxYoutubePlayerModule.forRoot() 
  ],
  exports:[
    SidenavComponent,
    BodyComponent,
    DashboardRoutingModule,
    SharedModule,
    UsuarioDialogComponent,
    DocenteDialogComponent,
    TableConsumerAddComponent
  ],
  providers: [
    DatePipe
  ]
})
export class AdminModule { }
