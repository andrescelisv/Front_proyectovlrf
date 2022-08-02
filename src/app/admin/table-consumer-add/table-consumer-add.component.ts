import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { responseproyect } from '../interfaces/response';
import { url } from '../interfaces/url';
import { UsuarioDialogComponent } from '../usuario/usuario-dialog/usuario-dialog.component';
import { institucion } from '../interfaces/docentes';
import { KeyValue } from '@angular/common';

export interface interfaceinstitucion {
  nombre: string;
  ubicacion: string;
}

@Component({
  selector: 'app-table-consumer-add',
  templateUrl: './table-consumer-add.component.html',
  styleUrls: ['./table-consumer-add.component.scss']
})
export class TableConsumerAddComponent {

  user:any;
  tareas: responseproyect={
    ok: true,
    message:" ",
    body: []
  }
  termino: string = '';
  datosinstitucion:interfaceinstitucion[]=[]
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() url!: url;
  @Input() tipos:any=[];
  @Input() componente:string="";
  @Input() componenteDialog:any;

 public itemval:string="element.cedula";
  elemento:any;
 
  errors: any[] = [];
  comprobacion= false;
  varcomprobacion= false;
  terminosearch: string = "";
  
  displayedColumns: string = this.tipos;
  constructor(private _adminService: AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog) { }


  ngOnInit(): void {
    this.tipos= this.tipos.concat('acciones');
    console.log("antes de displayed"+this.tipos);
    this.displayedColumns= this.tipos;
    console.log(this.displayedColumns);
    this.getAll();
    

    console.log(this.tipos);

    const respuesta=this._adminService.getAll("institucion/all/").subscribe({next: data => {
      this.datosinstitucion = data.body;
      console.table(this.datosinstitucion);
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    
    

  }

 
  

  getAll(){
    this._adminService.getAll(this.url.get)
    .subscribe({next: data => {
      this.tareas = data;
      console.table(this.tareas?.body)
      this.dataSource = new MatTableDataSource(this.tareas?.body);
      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("itemval"+this.itemval);
      
    },
    error:error => {
      this.errors = error.message;
          console.error('There was an error!', this.errors);
    }
    }
    
    
    );
  }

  save(){
    if(this.tareas.body[0].id){
      this._adminService.update(this.tareas.body[0].id,this.tareas.body,this.url.update)
      .subscribe(()=> this.getAll());//cargar nuevamente las tareas)
    }else {
      this._adminService.create(this.tareas.body,this.url.create)
    .subscribe(()=> this.getAll());//cargar nuevamente las tareas)

    }

    this._adminService.create(this.tareas.body,this.url.create)
    .subscribe(()=> this.getAll());//cargar nuevamente las tareas)

    this.tareas={
      ok: true,
      message:" ",
      body: []
    }
  
    /*this.tarea ={
    id: null,
    nombre: '',
    completado: false
    }*/
  }

  edit(tarea:any){
    this.tareas.body = {
      ...tarea
    };
  }
  
    delete(tarea: any){
      
      this._adminService.delete(tarea.id,this.url.delete)
      .subscribe(()=> this.getAll())
      this._snackBar.open('El usuario fue eliminado con exito',
      '', {horizontalPosition: 'center',
         verticalPosition: 'bottom',
         duration:2500});
    }
  


  buscar(event: Event){
    console.log(this.tareas.body[0].id);
   
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialogEdit(tarea:any){
     console.table(tarea.grado);

    const dialogRef= this.dialog.open(this.componenteDialog, {
      width: '40%',
      data:tarea
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAll();
      
    });


  }

  openDialog() {
    this.varcomprobacion=true;
    const dialogRef= this.dialog.open(this.componenteDialog, {
      width: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAll();
      
    });

    
  }


  addUser(comprobacion:any):void{
    console.log("se ejecuta el addUser: "+comprobacion);
    
    this.getAll();
    /*console.log(comprobacion);
    if(comprobacion== true){
   
    }
    else{
      
    }
   */
  }

 busqueda(tarea:any){
  console.log(this.termino);
  console.log(tarea);
 }

 teclaPresionada(valor:any){
  console.log(valor);
 }

 isNumber(val: any): boolean { return val.map((value:any)=> value instanceof Array)  }

 isString(val: any):any { return val.map(function(num: any) {
  if(num instanceof Array){
    return 'true';
  }
  else{
    return 'false';
  }
  }
  ); 
 }
}
