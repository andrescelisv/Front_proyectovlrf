import { Component, OnInit } from '@angular/core';
import { Docentes } from '../interfaces/docentes';
import { url } from '../interfaces/url';
import { NdDialogComponent } from '../nd/nd-dialog/nd-dialog.component';
import { ValVidDialogComponent } from './val-vid-dialog/val-vid-dialog.component';

@Component({
  selector: 'app-val-vid',
  templateUrl: './val-vid.component.html',
  styleUrls: ['./val-vid.component.scss']
})
export class ValVidComponent implements OnInit {
  url:url={
    get:'ValVideos/all',
    update: 'ValVideos/ValVideosUpdate',
    create: 'ValVideos/addValVideos',
    delete: 'ValVideos/deleteValVideos/'
 }

  tipos:any=[
    'val',
    'videourl',
    'estudiante',
    'institucion'
  ]
  
  componentDialog:any =ValVidDialogComponent;
  grado:string="Valoración Video";
  user:any;
  tareas!: Docentes;
  errors: any[] = [];
  termino: string = "";
  displayedColumns: string[] = ['dba', 'nd', 'estudiante', 'docente','acciones'];
  constructor() { }

  ngOnInit(): void {
  }

}
