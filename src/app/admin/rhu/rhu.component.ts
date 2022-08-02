import { Component, OnInit } from '@angular/core';
import { Docentes } from '../interfaces/docentes';
import { url } from '../interfaces/url';
import { MateriaDialogComponent } from '../materias/materia-dialog/materia-dialog.component';
import { RhuDialogComponent } from './rhu-dialog/rhu-dialog.component';

@Component({
  selector: 'app-rhu',
  templateUrl: './rhu.component.html',
  styleUrls: ['./rhu.component.scss']
})
export class RHUComponent implements OnInit {

  url:url={
    get:'RHU/all',
    update: 'RHU/rhuUpdate',
    create: 'RHU/addRHU',
    delete: 'RHU/deleteRHU/'
 }

  tipos:any=[
    'dba',
    'videovisto',
    'estudiante',
    'docente'
  ]
  
  componentDialog:any =RhuDialogComponent;
  grado:string="RHU";
  user:any;
  tareas!: Docentes;
  errors: any[] = [];
  termino: string = "";
  displayedColumns: string[] = ['dba', 'videovisto', 'estudiante', 'docente','acciones'];
  constructor() { }


  ngOnInit(): void {
  }

}
