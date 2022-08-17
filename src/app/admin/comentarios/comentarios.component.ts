import { Component, OnInit } from '@angular/core';
import { DocenteDialogComponent } from '../docentes/docente-dialog/docente-dialog.component';
import { Docentes } from '../interfaces/docentes';
import { url } from '../interfaces/url';
import { ComentariosDialogComponent } from './comentarios-dialog/comentarios-dialog.component';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss']
})
export class ComentariosComponent implements OnInit {
  url:url={
    get:'comentarios/all',
    update: 'comentario/COMENTARIOUpdate',
    create: 'comentario/addCOMENTARIO',
    delete: 'comentario/deleteCOMENTARIO/'
 }
  
 //Campos con los valores que se quieren mostrar en la tabla de presentación al usuario.
  tipos:any=[
    'comentario',
    'videourl',
    'fecha',
    'materia',
    'grado',
    'estudiante',
    'docente'
    
  ]
  
  componentDialog:any =ComentariosDialogComponent;
  docente:string="Comentario";  //Es el valor que se quiere mostrar en añadir
  user:any;
  tareas!: Docentes;
  errors: any[] = [];
  termino: string = "";
  displayedColumns: string[] = ['nombre', 'correoElectronico', 'fechaNacimiento', 'cedula','institucion','grado','materia','acciones'];
  constructor() { }

  ngOnInit(): void {
  }

}
