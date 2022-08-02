import { Component, OnInit } from '@angular/core';
import { DocenteDialogComponent } from '../docentes/docente-dialog/docente-dialog.component';
import { Docentes, Estudiantes } from '../interfaces/docentes';
import { url } from '../interfaces/url';
import { EstudianteDialogComponentComponent } from './estudiante-dialog-component/estudiante-dialog-component.component';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})

export class EstudiantesComponent implements OnInit {
  //Son las url del crud a la base de datos
  url:url={
    get:'estudiante/all',
    update: 'estudiante/estudiantesUpdate',
    create: 'estudiante/addEstudiante',
    delete: 'estudiante/deleteEstudiante/'
 }
  //Los tipos son los valores que retorna la base de datos y que se quieren mostrar en la tabla estudiante
  tipos:any=[
    'nombre',
    'cedula',
    'correoElectronico',
    'fechaNacimiento',
    'institucion',
    'grado',
    'materia'
  ]
  
  componentDialog:any =EstudianteDialogComponentComponent;
  estudiante:string="Estudiante";
  user:any;
  tareas!: Estudiantes;
  errors: any[] = [];
  termino: string = "";
  //Son las columnas que se envian al filtro de la tabla para ser mostradas
  displayedColumns: string[] = ['nombre', 'correoElectronico', 'fechaNacimiento', 'cedula','institucion','grado','materia','acciones'];

  constructor() { }

  ngOnInit(): void {
  }

}
