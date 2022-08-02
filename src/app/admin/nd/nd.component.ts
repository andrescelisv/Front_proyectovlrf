import { Component, OnInit } from '@angular/core';
import { Docentes } from '../interfaces/docentes';
import { url } from '../interfaces/url';
import { RhuDialogComponent } from '../rhu/rhu-dialog/rhu-dialog.component';
import { NdDialogComponent } from './nd-dialog/nd-dialog.component';

@Component({
  selector: 'app-nd',
  templateUrl: './nd.component.html',
  styleUrls: ['./nd.component.scss']
})
export class NDComponent implements OnInit {
  url:url={
    get:'ND/all',
    update: 'ND/ndUpdate',
    create: 'ND/addND',
    delete: 'ND/deleteND/'
 }

  tipos:any=[
    'dba',
    'nd',
    'estudiante',
    'docente'
  ]
  
  componentDialog:any =NdDialogComponent;
  grado:string="ND";
  user:any;
  tareas!: Docentes;
  errors: any[] = [];
  termino: string = "";
  displayedColumns: string[] = ['dba', 'nd', 'estudiante', 'docente','acciones'];

  constructor() { }

  ngOnInit(): void {
  }

}
