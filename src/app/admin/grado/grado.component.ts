import { Component, OnInit } from '@angular/core';
import { InstitucionDialogComponent } from '../institucion/institucion-dialog/institucion-dialog.component';
import { Docentes } from '../interfaces/docentes';
import { url } from '../interfaces/url';
import { GradoDialogComponent } from './grado-dialog/grado-dialog.component';

@Component({
  selector: 'app-grado',
  templateUrl: './grado.component.html',
  styleUrls: ['./grado.component.scss']
})
export class GradoComponent implements OnInit {
  
  url:url={
    get:'Grado/all',
    update: 'Grado/gradoUpdate',
    create: 'Grado/addGrado',
    delete: 'Grado/deleteGrado/'
 }

  tipos:any=[
    'grado',
    'jornada',
    'grupo',
    'institucion'
  ]
  
  componentDialog:any =GradoDialogComponent;
  grado:string="Grado";
  user:any;
  tareas!: Docentes;
  errors: any[] = [];
  termino: string = "";
  displayedColumns: string[] = ['grado', 'jornada', 'grupo', 'institucion','acciones'];
  constructor() { }

  ngOnInit(): void {
  }

}
