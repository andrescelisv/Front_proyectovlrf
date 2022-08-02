import { Component, OnInit } from '@angular/core';
import { GradoDialogComponent } from '../grado/grado-dialog/grado-dialog.component';
import { Docentes } from '../interfaces/docentes';
import { url } from '../interfaces/url';
import { MateriaDialogComponent } from './materia-dialog/materia-dialog.component';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.scss']
})
export class MateriasComponent implements OnInit {

  url:url={
    get:'Materia/all',
    update: 'Materia/materiaUpdate',
    create: 'Materia/addMateria',
    delete: 'Materia/deleteMateria/'
 }

  tipos:any=[
    'nombre',
    'area',
    'grado',
    'institucion'
  ]
  
  componentDialog:any =MateriaDialogComponent;
  grado:string="Materia";
  user:any;
  tareas!: Docentes;
  errors: any[] = [];
  termino: string = "";
  displayedColumns: string[] = ['nombre', 'area', 'grado', 'institucion','acciones'];
  constructor() { }

  ngOnInit(): void {
  }

}
