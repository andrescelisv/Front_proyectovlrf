import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AdminService } from 'src/app/services/admin.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ControlMessagesComponent } from '../../control-messages/control-messages.component';
import { institucion, Grado } from '../../interfaces/docentes';

export interface interfaceinstitucion {
  id:string;
  nombre: string;
  ubicacion: string;
}

export interface interfacegrado {
  id:string;
  grado: string;
}


@Component({
  selector: 'app-grado-dialog',
  templateUrl: './grado-dialog.component.html',
  styleUrls: ['./grado-dialog.component.scss']
})
export class GradoDialogComponent {
  btnact=false;
  seleccionado:string="";
  errors:string="";
  gradonombre="";
  institucionnombre="";
  institucionid="";
  datos:any;
  setins!:any;
  form!: FormGroup;
  loading=false;
  spinner=false;
  selectJornada:string="";
  selectZona:string="";
  datosgradovalor:string="";
  stateCtrl = new FormControl('',[Validators.required]); 
  stateCtrlgrado = new FormControl('',[Validators.required]); 
  filtrarinstitucion!: Observable<interfaceinstitucion[]>;
  filtrargrado!: Observable<interfacegrado[]>;

  //Se crea un arreglo que contiene objetos con todos los grados en una institución educativa.
  datosgrado:interfacegrado[]=[
    {id:'1',grado:'Preescolar'},
    {id:'2',grado:'Primero'},
    {id:'3',grado:'Segundo'},
    {id:'4',grado:'Tercero'},
    {id:'5',grado:'Cuarto'},
    {id:'6',grado:'Quinto'},
    {id:'7',grado:'Sexto'},
    {id:'8',grado:'Septimo'},
    {id:'9',grado:'Octavo'},
    {id:'10',grado:'Noveno'},
    {id:'11',grado:'Decimo'},
    {id:'12',grado:'Undecimo'}
    
  ]
  datosinstitucion:interfaceinstitucion[]=[
    { id:"1",nombre: "Jardin los angeles",
  ubicacion:"" },

  ]
  seleccionadogrado!: string;
  constructor(
  private fb:FormBuilder,private _adminService: AdminService,private _snackBar: MatSnackBar, private router:Router,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    const respuesta=this._adminService.getAll("institucion/all/").subscribe({next: data => {
      this.datosinstitucion = data.body;
      console.log("datos institución: "+this.datosinstitucion.slice());
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    ); 
    
      this.form = new FormGroup({
        jornada: new FormControl('',[Validators.required]),
        grupo: new FormControl('',[Validators.required,Validators.pattern('[A-Za-z \-\_]+')])
      });
    
        if(data==null){
          this.selectJornada='';
        
          this.form.setValue({
            grupo:"",
            jornada:""
          });
    
          
            this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
              startWith(''),
              map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
            );
          console.log("this institucion: "+this.filtrarinstitucion.forEach(value=>console.log(value)));
        
          this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice())),
          );
        console.log("this grado: "+this.filtrargrado.forEach(value=>console.log(value)));
      
        
        }else{
         
         
          this.btnact=true;
          
         
          
        this.form.setValue({
          jornada: data.jornada,
          grupo: data.grupo
        
        });
        this.setins=data.institucion;
        this.stateCtrl.setValue(this.setins.map(((value: { nombre: any; }) => value.nombre)));
        this.stateCtrlgrado.setValue(data.grado);
        
        this.selectJornada=data.jornada;

        this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
        );
      console.log("this institucion: "+this.filtrarinstitucion.forEach(value=>console.log(value)));
    
      this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice())),
      );
        
    
        
      }

    
  
}

selectedgrado(event: MatAutocompleteSelectedEvent): void {
  this.seleccionadogrado=(event.option.viewValue);


  this.btnact=true;
}


selected(event: MatAutocompleteSelectedEvent): void {
  this.seleccionado=(event.option.viewValue);
  
}
  Ingresar(){

   
    const grupo = this.form.value.grupo;  
    const jornada = this.form.value.jornada;

   
    const filterValue = this.stateCtrl.value;
    console.log("filtervalue: "+filterValue);
    this.datosinstitucion=this.datosinstitucion.filter(state => state.nombre.includes(filterValue));

    this.datosinstitucion.slice().forEach(value=>(this.institucionnombre=value.nombre,console.log(value.id)));
    this.datosinstitucion.slice().forEach(value=>(this.institucionid=value.id));


   const filterValueGrado = this.stateCtrlgrado.value;
   console.table(filterValueGrado);
    this.datosgrado=this.datosgrado.filter(state => state.grado.includes(filterValueGrado));
    
    this.datosgrado.slice().forEach(value=>(this.gradonombre=value.grado,console.log(value.grado)));
    
   

   console.log("data: "+this.data);

    if(this.data==null){ 
      const tarea={
        grado:this.seleccionadogrado,
        grupo:grupo,
        jornada:jornada,
      institucion:[{nombre: this.institucionnombre, id:this.institucionid}]
      }

      console.log("tarea: "+tarea);
      
      const respuesta=this._adminService.create(tarea,"Grado/addGrado/").subscribe({next: data => {
        this.datos = data;
        console.log("create: "+this.datos);
    
        },
        error:error => {
        this.errors = error.message;
          console.error('There was an error!', this.errors);
        }
      }
      );
      setTimeout(() => {
        console.log(this.datos);
        if(this.datos.message=="success"){
          this._snackBar.open('Grado creado con exito',
          '', {horizontalPosition: 'center',
           verticalPosition: 'bottom',
           duration: 5000});
           this.btnact=false;
        }else{
          this._snackBar.open('Datos erroneos',
          '', {horizontalPosition: 'center',
           verticalPosition: 'bottom',
           duration: 5000});
        }
      },2000);
   


  }else{

    const tarea={
      id:this.data.id,
      grado:this.gradonombre,
        grupo:grupo,
        jornada:jornada,
      institucion:[{nombre: this.institucionnombre, id:this.institucionid}]
      
    }
    console.log(tarea);
      const respuesta=this._adminService.update(this.data.id,tarea,"Grado/gradoUpdate/").subscribe({next: data => {
      this.datos = data;
  console.log(this.datos);
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );

    setTimeout(() => {
      console.log(this.datos);
      if(this.datos.message=="success"){
        this._snackBar.open('Grado creado con exito',
        '', {horizontalPosition: 'center',
         verticalPosition: 'bottom',
         duration: 5000});
         this.btnact=false;
      }else{
        this._snackBar.open('Datos erroneos',
        '', {horizontalPosition: 'center',
         verticalPosition: 'bottom',
         duration: 5000});
      }
    },2000);
 
  this.router.navigate(['/admin/grado']);

}

} 

  

private _filtrarinstitucion(value: string): interfaceinstitucion[] {
  const filterValue = value.toLowerCase();

  return this.datosinstitucion.filter(state => state.nombre.toLowerCase().includes(filterValue));
}

private _filtrargrado(value: string): interfacegrado[] {
  const filterValue = value;

  return this.datosgrado.filter(state => state.grado.includes(filterValue));
}

}

