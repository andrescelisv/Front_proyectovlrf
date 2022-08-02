/* This class is a component that is used to display a list of teachers, it has a table that is filled
with the data of the teachers, it has a search bar to search for teachers by name, it has a button
to add a teacher, it has a button to edit a teacher and it has a button to delete a teacher */
import { CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Docentes } from '../interfaces/docentes';
import { responseproyect } from '../interfaces/response';
import { url } from '../interfaces/url';
import { DocenteDialogComponent } from './docente-dialog/docente-dialog.component';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.scss']
})
export class DocentesComponent implements OnInit {
  

  //Url que corresponden a los servicios rest dispuestos en el back
  url:url={
    get:'Docente/all',
    update: 'Docente/docenteUpdate',
    create: 'Docente/addDocente',
    delete: 'Docente/deleteDocente/'
 }
  
 //Campos con los valores que se quieren mostrar en la tabla de presentación al usuario.
  tipos:any=[
    'nombre',
    'cedula',
    'correoElectronico',
    'fechaNacimiento',
    'institucion',
    'grado',
    'materia'
  ]
  
  componentDialog:any =DocenteDialogComponent;
  docente:string="Docente";  //Es el valor que se quiere mostrar en añadir
  user:any;
  tareas!: Docentes;
  errors: any[] = [];
  termino: string = "";
  displayedColumns: string[] = ['nombre', 'correoElectronico', 'fechaNacimiento', 'cedula','institucion','grado','materia','acciones'];
  constructor(private _adminService: AdminService) { }

  ngOnInit(): void {
    this.getAll();
  }

  

 /**
  * It gets all the teachers from the database.
  */
  getAll(){
    this._adminService.getAll("Docente/all")
    .subscribe({next: data => {
      this.tareas = data;
      console.log(this.tareas);
      console.log(typeof(this.tareas));
    },
    error:error => {
      this.errors = error.message;
          console.error('There was an error!', this.errors);
    }
    }
    
    
    );
  }

}
