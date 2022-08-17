import { Component, OnInit } from '@angular/core';
import { Docentes } from '../interfaces/docentes';
import { url } from '../interfaces/url';
import { NdDialogComponent } from '../nd/nd-dialog/nd-dialog.component';
import { LvDialogComponent } from './lv-dialog/lv-dialog.component';

@Component({
  selector: 'app-lv',
  templateUrl: './lv.component.html',
  styleUrls: ['./lv.component.scss']
})
export class LVComponent implements OnInit {

  url:url={
    get:'LV/all',
    update: 'LV/lvUpdate',
    create: 'LV/addLV',
    delete: 'LV/deleteLV/'
 }

  tipos:any=[
    'dba',
    'lista Videos',
    'fecha',
    'estudiante',
    'docente'
  ]
  
  componentDialog:any =LvDialogComponent;
  lv:string="Lista Videos";
  user:any;
  tareas!: Docentes;
  errors: any[] = [];
  termino: string = "";
  displayedColumns: string[] = ['dba', 'listaVideos', 'estudiante', 'docente','acciones'];

  constructor() { }

  ngOnInit(): void {
  }

}
