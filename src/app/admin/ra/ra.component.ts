import { Component, OnInit } from '@angular/core';
import { Docentes } from '../interfaces/docentes';
import { url } from '../interfaces/url';
import { RhuDialogComponent } from '../rhu/rhu-dialog/rhu-dialog.component';
import { RaDialogComponent } from './ra-dialog/ra-dialog.component';

@Component({
  selector: 'app-ra',
  templateUrl: './ra.component.html',
  styleUrls: ['./ra.component.scss']
})
export class RaComponent{
  url:url={
    get:'RA/all',
    update: 'RA/raUpdate',
    create: 'RA/addRA',
    delete: 'RA/deleteRA/'
 }

  tipos:any=[
    'dba',
    'fecha',
    'materia',
    'grado',
    'estudiante',
    'docente',
    'institucion'
    
  ]
  
  componentDialog:any =RaDialogComponent;
  grado:string="RA";
  user:any;
  tareas!: Docentes;
  errors: any[] = [];
  termino: string = "";
  displayedColumns: string[] = ['dba', 'videovisto', 'estudiante', 'docente','acciones'];
  constructor() { }

 

}
