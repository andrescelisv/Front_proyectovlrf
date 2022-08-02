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
  selector: 'app-materia-dialog',
  templateUrl: './materia-dialog.component.html',
  styleUrls: ['./materia-dialog.component.scss']
})
export class MateriaDialogComponent {

  btnact=false;
  seleccionado:string="";
  errors:string="";
  gradonombre="";
  institucionnombre="";
  institucionid="";
  gradovalue="";
  gradoid="";
  datos:any;
  setins!:any;
  setgrado!:any;
  form!: FormGroup;
  loading=false;
  spinner=false;
  showAlert:boolean=false;
  selectArea:string="";
  selectZona:string="";
  datosgradovalor:string="";
  stateCtrl = new FormControl('',[Validators.required]); 
  stateCtrlgrado = new FormControl('',[Validators.required]); 
  filtrarinstitucion!: Observable<interfaceinstitucion[]>;
  filtrargrado!: Observable<interfacegrado[]>;
  datosgrado:interfacegrado[]=[]
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
        area: new FormControl('',[Validators.required]),
        nombre: new FormControl('',[Validators.required,Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)])
      });
    
        if(data==null){
          this.selectArea='';
        
          this.form.setValue({
            area:"",
            nombre:""
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
          this.spinner=true;
         
          
        this.form.setValue({
          area: data.area,
          nombre: data.nombre
        
        });
        this.setins=data.institucion;
        this.setgrado= data.grado;
        

        this.stateCtrl.setValue(this.setins.map(((value: { nombre: any; }) => value.nombre)));
        this.stateCtrlgrado.setValue(this.setgrado.map(((value: { grado: any; }) => value.grado)));
       console.log(this.stateCtrlgrado.value);
       this._adminService.getAll("Grado/queryname/"+this.setins.map(((value: { nombre: any; }) => value.nombre))+"/").subscribe({next: data => {
        this.datosgrado = data.body;
        
        },
        error:error => {
        this.errors = error.message;
          console.error('There was an error!', this.errors);
        }
      }
      );
        data.area=data.area[0].toUpperCase() + data.area.slice(1);
        this.selectArea=data.area;

        setTimeout(() => {

       

        this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
        );
      console.log("this institucion: "+this.filtrarinstitucion.forEach(value=>console.log(value)));
    
      this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice())),
      );

      console.log("this institucion: "+this.filtrargrado.forEach(value=>console.log(value)));
      console.log(this.datosgrado);
        
        },1000);
        
      }

    
  
}

selectedgrado(event: MatAutocompleteSelectedEvent): void {
  this.seleccionadogrado=(event.option.viewValue);


  this.btnact=true;
}


selected(event: MatAutocompleteSelectedEvent): void {
  this.seleccionado=(event.option.viewValue);

  this.loading=true;
    this.spinner=false;
    this._adminService.getAll("Grado/queryname/"+this.seleccionado+"/").subscribe({next: data => {
      this.datosgrado = data.body;
      
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );


    setTimeout(() => {
      if(this.datosgrado.length>0){
        this.showAlert=false;
        this.stateCtrlgrado.enable();
        
        this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice())),
        );

        
  
        console.log("filtrargrado"+this.filtrargrado.forEach(value=>console.log(value)));
        
      }
      else{
        this.stateCtrlgrado.disable();
        this.showAlert=true;
      
      }

      this.loading=false;
      this.spinner=true;

    },3000)
}



  Ingresar(){

   
    const nombre = this.form.value.nombre;  
    const area = this.form.value.area;
    
    console.log("area: "+area);
    const filterValuegrado = this.stateCtrlgrado.value;
    this.datosgrado=this.datosgrado.filter(state => state.grado.includes(filterValuegrado));
   
    const filterValue = this.stateCtrl.value;
    console.log("filtervalue: "+filterValue);
    this.datosinstitucion=this.datosinstitucion.filter(state => state.nombre.includes(filterValue));


    this.datosgrado.slice().forEach(value=>(this.gradoid=value.id));
    this.datosgrado.slice().forEach(value=>(this.gradovalue=value.grado));
    console.log(this.gradovalue);

    this.datosinstitucion.slice().forEach(value=>(this.institucionnombre=value.nombre,console.log(value.id)));
    this.datosinstitucion.slice().forEach(value=>(this.institucionid=value.id));
    console.log(this.institucionnombre);
   
   

   console.log("data: "+this.data);

    if(this.data==null){ 
      const tarea={
        grado:[{grado: this.gradovalue, id:this.gradoid}],
        nombre:nombre,
        area:area,
        institucion:[{nombre: this.institucionnombre, id:this.institucionid}]
      }

      console.table(tarea);
      
      const respuesta=this._adminService.create(tarea,"Materia/addMateria/").subscribe({next: data => {
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
          this._snackBar.open('Materia creada con exito',
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
      grado:[{grado: this.gradovalue, id:this.gradoid}],
        nombre:nombre,
        area:area,
        institucion:[{nombre: this.institucionnombre, id:this.institucionid}]
      
    }
    console.log(tarea);
      const respuesta=this._adminService.update(this.data.id,tarea,"Materia/materiaUpdate/").subscribe({next: data => {
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
 
  this.router.navigate(['/admin/materias']);

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