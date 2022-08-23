import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistaEstudianteComponent } from './vista-estudiante/vista-estudiante.component';
import { SharedModule } from '../shared/shared.module';
import { SliderComponent } from './slider/slider.component';
import { EstudiantesComponent } from '../admin/estudiantes/estudiantes.component';



@NgModule({
  declarations: [
    VistaEstudianteComponent,
    SliderComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    VistaEstudianteComponent
  ]
})
export class VistaEstudianteModule { }
