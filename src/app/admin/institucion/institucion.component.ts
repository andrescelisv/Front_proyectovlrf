import { Component, OnInit } from '@angular/core';
import { EstudianteDialogComponentComponent } from '../estudiantes/estudiante-dialog-component/estudiante-dialog-component.component';
import { Docentes } from '../interfaces/docentes';
import { url } from '../interfaces/url';
import { InstitucionDialogComponent } from './institucion-dialog/institucion-dialog.component';

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: ['./institucion.component.scss']
})
export class InstitucionComponent implements OnInit {

  url:url={
    get:'institucion/all',
    update: 'institucion/institucionUpdate',
    create: 'institucion/addInstitucion',
    delete: 'institucion/deleteInstitucion/'
 }

  tipos:any=[
    'nombre',
    'correoElectronico',
    'municipio',
    'ubicacion',
    'jornada',
    'zona'
  ]
  
  componentDialog:any =InstitucionDialogComponent;
  estudiante:string="Institución";
  user:any;
  tareas!: Docentes;
  errors: any[] = [];
  termino: string = "";
  displayedColumns: string[] = ['nombre', 'correoElectronico', 'fechaNacimiento', 'cedula','municipio','ubicacion','jornada','zona','acciones'];

  constructor() { }

  ngOnInit(): void {
  }

}
