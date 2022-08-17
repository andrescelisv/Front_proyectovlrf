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
  selectionins:any[]=[];
  selectiongra:any[]=[];
  probar:boolean=false;
  probarclick:boolean=false;
  compclick:boolean=false;
  compclickgrado:boolean=false;
  probarclickgrado:boolean=false;
  verificar:boolean=true;
  activate:boolean=false;
  varnombre:string="";
  constructor(
  private fb:FormBuilder,private _adminService: AdminService,private _snackBar: MatSnackBar, private router:Router,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    const respuesta=this._adminService.getAll("institucion/all/").subscribe({next: data => {
      this.datosinstitucion = data.body;
     // console.log("datos institución: "+this.datosinstitucion.slice());
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
          this.form.controls['nombre'].setValue(this.valor());

          setTimeout(() => {
            this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
              startWith(''),
              map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
            );
          
        
          this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice())),
          );
          }, 200);
          
          
       
      
        
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
      // console.log(this.stateCtrlgrado.value);
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
        this.form.controls['nombre'].setValue(this.valor());
          

            this.selectionins.push(this.setins[0].nombre);
            
            this.selectiongra.push(this.setgrado[0].grado);

            this.varnombre=data.nombre;


        setTimeout(() => {

       

        this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
        );
      
    
      this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice())),
      );

   
        
        },1000);
        
      }

    
  
}

selectedgrado(event: MatAutocompleteSelectedEvent): void {
  this.seleccionadogrado=(event.option.viewValue);


  this.btnact=true;
}

valor(){


  this.form.controls['nombre'].valueChanges.subscribe((value:String)=>{
    
    let palabras = value.split(" ");
    palabras=palabras.map((palabra:string)=>{
      return palabra[0].toUpperCase()+palabra.substring(1);
    })
   let palabra1=palabras.join(" ");
  this.form.controls['nombre'].setValue(palabra1,{ emitEvent: false })   //Evitar ser un bucle generando nuevos eventos
  
   
    
  });
 
 
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

        
  
        //console.log("filtrargrado"+this.filtrargrado.forEach(value=>console.log(value)));
        
      }
      else{
        this.stateCtrlgrado.disable();
        this.showAlert=true;
      
      }

      this.loading=false;
      this.spinner=true;

    },3000)
}

verificacion(){
  
  //console.log(this.stateCtrlmateria.value);
  
  this.datosinstitucion.forEach(state=>( state.nombre.trim().toLowerCase() === this.selectionins.toString().trim().toLowerCase() ? (this.compclick=true):"" ));
  this.datosgrado.forEach(state=> (state.grado.trim().toLowerCase() === this.selectiongra.toString().trim().toLowerCase() ?(this.compclickgrado=true) : ""));
  if(this.compclick){this.probarclick=true}else{this.probarclick=false};
  if(this.compclickgrado){this.probarclickgrado=true}else{this.probarclickgrado=false};
  
  this.compclick=false;
  this.compclickgrado=false;
  if(this.selectionins.length>0 && this.selectiongra.length>0 && this.datosgrado.length>0 && this.datosinstitucion.length>0 && (this.probarclick && this.probarclickgrado)){
    this.btnact=true;
    this.probar=true;
    
    //console.log("click verificación true");
  }else{
    this.btnact=false;
    this.probar=false;
    //console.log("click verificación false");
  }
 }


  Ingresar(){

    if(this.probar){
    const nombre = this.form.value.nombre;  
    const area = this.form.value.area;
    
    //console.log("area: "+area);
    const filterValuegrado = this.stateCtrlgrado.value;
    this.datosgrado=this.datosgrado.filter(state => state.grado.includes(filterValuegrado));
   
    const filterValue = this.stateCtrl.value;
    //console.log("filtervalue: "+filterValue);
    this.datosinstitucion=this.datosinstitucion.filter(state => state.nombre.includes(filterValue));


    this.datosgrado.slice().forEach(value=>(this.gradoid=value.id));
    this.datosgrado.slice().forEach(value=>(this.gradovalue=value.grado));
  //  console.log(this.gradovalue);

    this.datosinstitucion.slice().forEach(value=>(this.institucionnombre=value.nombre,console.log(value.id)));
    this.datosinstitucion.slice().forEach(value=>(this.institucionid=value.id));
    //console.log(this.institucionnombre);
   
   

  // console.log("data: "+this.data);

    if(this.data==null){ 
      this._adminService.getCustomRA("Materia/queryverificar",'area','nombre','institucion','grado',this.form.value.area,this.form.value.nombre,this.stateCtrl.value.toString(),this.stateCtrlgrado.value.toString()).subscribe({next: data => {
        this.verificar = data.body;
        
        },
        error:error => {
        this.errors = error.message;
          console.error('There was an error!', this.errors);
        }
      }
      );
      if(this.verificar){
        console.log(this.verificar);
        this._snackBar.open('Espere un momento por favor',
        '', {horizontalPosition: 'center',
         verticalPosition: 'bottom',
         duration: 8000});
         this.btnact=false;
  
       }
      
      setTimeout(() => {
       // console.log(this.verificar);
      if(this.verificar){
       this.activate=true;
      this._snackBar.open('La materia ya se encuentra registrada',
      '', {horizontalPosition: 'center',
       verticalPosition: 'bottom',
       duration: 8000});

       this._snackBar.open('La materia ya se encuentra registrada',
      '', {horizontalPosition: 'center',
       verticalPosition: 'top',
       duration: 8000});

       
       this.btnact=true;
      }
     
      if(!this.verificar){
        this.activate=false;
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
        //console.log(this.datos);
        if(this.datos.message=="success"){
          this._snackBar.open('Materia actualizada con exito',
          '', {horizontalPosition: 'center',
           verticalPosition: 'bottom',
           duration: 5000});
           this.btnact=false;
        }else{
          //Se utiliza un snackBar para visualizar la respuesta del servidor
          this._snackBar.open('Datos erroneos',
          '', {horizontalPosition: 'center',
           verticalPosition: 'bottom',
           duration: 5000});
           this.btnact=true;
        }
      },2000);
    
      }
    
    },1000);
   


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
        this._snackBar.open('Materia actualizada con exito',
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