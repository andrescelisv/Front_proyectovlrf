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
    //console.log("antes de displayed"+this.tipos);
    this.displayedColumns= this.tipos;
    //console.log(this.displayedColumns);
    this.getAll();
    

    

    const respuesta=this._adminService.getAll("institucion/all/").subscribe({next: data => {
      this.datosinstitucion = data.body;
      
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    
    

  }

  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      
    
  
        
  
        let nameSearch = () => {
         
          if(data instanceof Object){
            const entradas= Object.entries(data);
            
            for(let i=0;i<entradas.length;i++){
              let entradas1 = Object.entries(entradas[i]);
              console.log(entradas1)
              let valor= entradas1[1];
             
              
              if(valor[1] instanceof Array){
              
                let array:Array<String> =Object.values(valor[1])
              
               let internal:Array<String>= Object.values(array[0]);
            
                let retorno=internal.map((e:any)=>e instanceof Array ? e : e.toString().toLowerCase().trim().includes(filter.trim()
                .toLowerCase()))
                .map(e=>{return e});
               
                console.log(retorno);
                if(internal.toString().toLowerCase().trim().includes(filter.trim().toLowerCase())){
                 
                  return true;
                }
                
                
              }else{
                //if(valor[1] .toLowerCase().includes(filter.trim().toLowerCase())){
               
                let valor2 = String(valor[1]);
              

                if(valor2.toLowerCase().includes(filter.trim().toLowerCase())){
                  return true;
                }
               /* if(valor2.toLowerCase().includes(filter.trim().toLowerCase())){
                 console.log("si");
                 comprobar=true;*/
                 console.log("false del primero")

               }


             


            }
           
            return true;
          
        }else{
          return false
        }
        }
      return nameSearch()
    }
    return filterFunction
  }
  

  getAll(){
    this._adminService.getAll(this.url.get)
    .subscribe({next: data => {
      this.tareas = data;
     
      this.dataSource = new MatTableDataSource(this.tareas?.body);
      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      
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
    
   
  }

  



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    var comprobar:boolean;
    this.dataSource.filterPredicate = this.dataSource.filterPredicate = (d: any, filter: string) => {
      //const textToSearch = d[column] && d[column].toLowerCase() || '';

     
      switch (this.componente ) {
        case "Comentario":
            
            if(
              d.comentario[0].docente[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase())
              || d.comentario[0].estudiante[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
              d.comentario[0].grado[0].grado.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
              d.comentario[0].materia[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
              d.comentario[0].comentario.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
              d.comentario[0].fecha.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
              d.videourl.trim().toLowerCase().includes(filter.trim().toLowerCase())
              ){
              
                return true;
              }else{
                
                return false;}
              
            
        case "RA":
          var comprobar:boolean=false;  
          var valor=d.dba.map((e:any)=>{
         
            
            if(e.dba.trim().toLowerCase().includes(filter.trim().toLowerCase())){
           
              comprobar=true;
             
                return true;
            }
            else{
              if(comprobar){
                comprobar=true;
                return true;
              }
             else{
              comprobar=false;
              return false;
             }
            }
          });
         
          if(
            d.docente[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase())
            || d.estudiante[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.grado[0].grado.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.materia[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.institucion[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.fecha.trim().toLowerCase().includes(filter.trim().toLowerCase()) || comprobar
            ){
            
              return true;
            }else{
              
              return false;}
            

        case "Valoración Video":
          if(
            d.estudiante[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.institucion[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.videourl.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.val.trim().toLowerCase().includes(filter.trim().toLowerCase())
            ){
            
              return true;
            }else{
             
              return false;}

      case "Lista Videos":
        var comprobar:boolean=false;  
         var valor=d.lv[0].listaVideos.map((e:any)=>{
      
            
            if(e.video.trim().toLowerCase().includes(filter.trim().toLowerCase())){
              
              comprobar=true;
             
                return true;
            }
            else{
              if(comprobar){
                comprobar=true;
                return true;
              }
             else{
              comprobar=false;
              return false;
             }
            }
          });
        if(
          d.lv[0].docente[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase())
          || d.estudiante[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
          d.lv[0].dba.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
          d.institucion[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
          d.lv[0].fecha.trim().toLowerCase().includes(filter.trim().toLowerCase()) || comprobar
          ){
          
            return true;
          }else{
          
            return false;}

        case "ND":
          
          if(
            String(d.nd[0].nd).trim().toLowerCase().includes(filter.trim().toLowerCase())
            || d.estudiante[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.nd[0].dba.trim().toLowerCase().includes(filter.trim().toLowerCase()) || 
            d.nd[0].docente[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.institucion[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.nd[0].fecha.trim().toLowerCase().includes(filter.trim().toLowerCase()) 
            ){
           
              return true;
            }else{
             
              return false;}

        case "RHU":
          
          if(
            d.dba[0].videovisto[0].videovisto.trim().toLowerCase().includes(filter.trim().toLowerCase())
            || d.estudiante[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.dba[0].dba.trim().toLowerCase().includes(filter.trim().toLowerCase()) || 
            d.dba[0].docente[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.institucion[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.dba[0].fecha.trim().toLowerCase().includes(filter.trim().toLowerCase()) 
            ){
         
              return true;
            }else{
           
              return false;}

        case "Usuario":
          if(
            d.username.trim().toLowerCase().includes(filter.trim().toLowerCase())
            || d.email.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.rol.trim().toLowerCase().includes(filter.trim().toLowerCase()) || 
            d.password.trim().toLowerCase().includes(filter.trim().toLowerCase()) 
            ){
         
              return true;
            }else{
              
              return false;}

        case "Materia":
          console.log(d.institucion[0].nombre);
                if(
                  d.area.trim().toLowerCase().includes(filter.trim().toLowerCase())
                  || d.grado[0].grado.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
                  String(d.institucion[0].nombre).trim().toLowerCase().includes(filter.trim().toLowerCase()) || 
                  d.nombre.trim().toLowerCase().includes(filter.trim().toLowerCase())  ||
                  d.area.trim().toLowerCase().includes(filter.trim().toLowerCase()) 
                  ){
                  
                    return true;
                  }else{
                 
                    return false;}

          case "Institución":
                      
                            if(
                              d.correoElectronico.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
                              d.jornada.trim().toLowerCase().includes(filter.trim().toLowerCase()) 
                              || d.telefono.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
                              d.zona.trim().toLowerCase().includes(filter.trim().toLowerCase()) || 
                              d.nombre.trim().toLowerCase().includes(filter.trim().toLowerCase())  ||
                              d.departamento.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
                              d.ubicacion.trim().toLowerCase().includes(filter.trim().toLowerCase()) 
                              ){
                         
                                return true;
                              }else{
                              
                                return false;}

        case "Grado":
                      
                                  if(
                                    d.grado.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
                                    d.grupo.trim().toLowerCase().includes(filter.trim().toLowerCase()) 
                                    || d.institucion[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
                                    d.jornada.trim().toLowerCase().includes(filter.trim().toLowerCase())
                                    ){
                              
                                      return true;
                                    }else{
                                    
                                      return false;}
        
        case "Estudiante":
                      
                                        if(
                                          d.nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
                                          d.cedula.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
                                          d.fechaNacimiento.trim().toLowerCase().includes(filter.trim().toLowerCase()) 
                                          || d.institucion[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
                                          d.correoElectronico.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
                                          d.grado[0].grado.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
                                          d.materia[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase())
                                          ){
                                        
                                            return true;
                                          }else{
                                           
                                            return false;}

        case "Docente":
          var comprobar:boolean=false;  
          var valor=d.grado.map((e:any)=>{
             
             
             if(e.grado.trim().toLowerCase().includes(filter.trim().toLowerCase())){
               
               comprobar=true;
              
                 return true;
             }
             else{
               if(comprobar){
                 comprobar=true;
                 return true;
               }
              else{
               comprobar=false;
               return false;
              }
             }
           });

           var comprobar1:boolean=false;  
          var valor=d.materia.map((e:any)=>{
            
             if(e.nombre.trim().toLowerCase().includes(filter.trim().toLowerCase())){
             
               comprobar1=true;
              
                 return true;
             }
             else{
               if(comprobar1){
                 comprobar1=true;
                 return true;
               }
              else{
               comprobar1=false;
               return false;
              }
             }
           });

          

          if(
            d.nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.cedula.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.fechaNacimiento.trim().toLowerCase().includes(filter.trim().toLowerCase()) 
            || d.institucion[0].nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            d.correoElectronico.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
            comprobar ||
           comprobar1
            ){
          
              return true;
            }else{
             
              return false;}
            
        default: 
            // 
            return false;
     }
     
     


    

      
      
    };
   
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
      width: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAll();
      
    });

    
  }


  addUser(comprobacion:any):void{
  
    
    this.getAll();
    /*console.log(comprobacion);
    if(comprobacion== true){
   
    }
    else{
      
    }
   */
  }

 busqueda(tarea:any){

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
