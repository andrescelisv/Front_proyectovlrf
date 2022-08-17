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


export interface interfacedepartamento {
  nombre: string;
}
export interface interfacemunicipio {
  municipio: string;
}

@Component({
  selector: 'app-institucion-dialog',
  templateUrl: './institucion-dialog.component.html',
  styleUrls: ['./institucion-dialog.component.scss']
})
export class InstitucionDialogComponent {

  btnact=false;
  probar:boolean=false;
  probarclick:boolean=false;
  compclick:boolean=false;
  compclickgrado:boolean=false;
  probarclickgrado:boolean=false;
  seleccionado:string="";
  errors:string="";
  seleccionadoMunicipio="";
  Departamento:string="";
  Municipio:string="";
  selectionmun:any[]=[];
  selectiondep:any[]=[];
  datos:any;
  form!: FormGroup;
  loading=false;
  spinner=false;
  selectJornada:string="";
  setmun:any[]=[];
  verificar:boolean=true;
  activate:boolean=false;
//Almacena los datos procedentes del table-consumer-add que corresponden con institución 
  setdep:any[]=[];
  selectZona:string="";
  stateCtrl = new FormControl('',[Validators.required]); 
  stateCtrlmunicipio = new FormControl('',[Validators.required]); 
  filtrarDepartamento!: Observable<interfacedepartamento[]>;
  filtrarmunicipio!: Observable<interfacemunicipio[]>;
  datosmunicipio:any[]=[];
  varnombre:string="";
  datosdepartamento:any[]=[
    { nombre: "Amazonas"},
    {nombre:"Antioquia"},
  {nombre:"Arauca"},
  {nombre:"Atlántico"},
  {nombre:"Bogotá"},
  {nombre:"Bolívar"},
  {nombre:"Boyacá"},
  {nombre:"Caldas"},
  {nombre:"Caquetá"},
  {nombre:"Casanare"},
  {nombre:"Cauca"},
  {nombre:"Cesar"},
  {nombre:"Chocó"},
  {nombre:"Córdoba"},
  {nombre:"Cundinamarca"},
  {nombre:"Guainía"},
  {nombre:"Guaviare"},
  {nombre:"Huila"},
  {nombre:"La Guajira"},
  {nombre:"Magdalena"},
  {nombre:"Meta"},
  {nombre:"Nariño"},
  {nombre:"Norte de Santander"},
  {nombre:"Putumayo"},
  {nombre:"Quindío"},
  {nombre:"Risaralda"},
  {nombre:"San Andrés y Providencia"},
  {nombre:"Santander	Bucaramanga"},
  {nombre:"Sucre"},
  {nombre:"Tolima"},
  {nombre:"Valle del Cauca"},
  {nombre:"Vaupés"},
  {nombre:"Vichada"}
  ]
  constructor(private fb:FormBuilder,private _adminService: AdminService,private _snackBar: MatSnackBar, private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

    this.form = new FormGroup({
      nombre: new FormControl('',[Validators.required,Validators.minLength(10),Validators.pattern('[A-Za-z \-\_]+')]),
      zona: new FormControl(''),
      jornada: new FormControl(''),
      ubicacion:new FormControl('',[Validators.required,Validators.minLength(14)]),
      telefono: new FormControl('',[Validators.required,Validators.minLength(7),Validators.pattern("^[0-9]*$")]),
      correoElectronico:new FormControl('',[Validators.required,Validators.email]),
    });

      if(data==null){
        this.selectJornada='';
        this.selectZona="";
      
        this.form.setValue({
          nombre:"",
          ubicacion:"",
          telefono:"",
          zona:"",
          jornada:"",
          correoElectronico:""
        });

        
          this.filtrarDepartamento = this.stateCtrl.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filtrardepartamento(state) : this.datosdepartamento.slice())),
          );
       
      
        this.form.controls['nombre'].setValue(this.valor());
      
      
      }else{
       
        this.stateCtrlmunicipio.enable();
        //this.btnact=true;
        this.spinner=true;
       
        
      this.form.setValue({
        nombre: data.nombre,
        ubicacion:data.ubicacion,
        telefono:data.telefono,
        correoElectronico:data.correoElectronico,
        zona: data.zona,
        jornada: data.jornada,
      
      });
      this.stateCtrl.setValue(data.departamento);
      this.stateCtrlmunicipio.setValue(data.municipio);
      
     
      this.selectJornada=data.jornada;
     
      this.selectZona=data.zona;
      
      this.setmun=data.municipio;  //Obtiene los datos de institución de la base de datos, apartir de la consulta realizada inicialmente
    this.setdep=data.departamento;  //Obtiene los datos de grado de la base de datos, apartir de la consulta realizada inicialmente
    
        this.selectiondep.push(this.setdep);
        
        this.selectionmun.push(this.setmun);
        this.varnombre=data.nombre;
        const respuesta=this._adminService.getAll("Departamento_municipio/queryname/"+this.setdep+"/").subscribe({next: data => {
          this.datosmunicipio = data.body;
          
          },
          error:error => {
          this.errors = error.message;
            console.error('There was an error!', this.errors);
          }
        }
        );
       
       
        
        this.stateCtrl.clearValidators();
        this.stateCtrl.addValidators(Validators.required);
        this.stateCtrlmunicipio.clearValidators();
        this.stateCtrlmunicipio.addValidators(Validators.required);
        this.form.controls['nombre'].setValue(this.valor());

        setTimeout(()=>{
          this.filtrarDepartamento= this.stateCtrl.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filtrardepartamento(state) : this.datosdepartamento.slice())),
          );
        
      
        this.filtrarmunicipio = this.stateCtrlmunicipio.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filtrarmunicipio(state) : this.datosmunicipio.slice())),
        );
        },500);
       
      
    }
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

    Ingresar(){
      if(this.probar){
      const nombre = this.form.value.nombre;
      const ubicacion = this.form.value.ubicacion; 
      const telefono = this.form.value.telefono;
      const zona = this.form.value.zona;  
      const jornada = this.form.value.jornada;
      const correoElectronico = this.form.value.correoElectronico; 
     


      if(this.data==null){ 
        this._adminService.getCustomRA("institucion/queryverificar",'nombre','departamento','municipio','zona',nombre,this.stateCtrl.value.toString(),this.stateCtrlmunicipio.value.toString(),zona).subscribe({next: data => {
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
        this._snackBar.open('La institución ya se encuentra registrada',
        '', {horizontalPosition: 'center',
         verticalPosition: 'bottom',
         duration: 8000});
  
         this._snackBar.open('La institución ya se encuentra registrada',
        '', {horizontalPosition: 'center',
         verticalPosition: 'top',
         duration: 8000});
  
         
         this.btnact=true;
        }
       
        if(!this.verificar){
          this.activate=false;
        const tarea={
          nombre:nombre,
          ubicacion:ubicacion,
          telefono:telefono,
          zona:zona,
          jornada:jornada,
          correoElectronico:correoElectronico,
          municipio: this.stateCtrlmunicipio.value,
          departamento: this.stateCtrl.value  //grado= this.datosgrado
        }
        
        const respuesta=this._adminService.create(tarea,"institucion/addInstitucion/").subscribe({next: data => {
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
            this._snackBar.open('Institución agregada con exito',
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
        nombre:nombre,
        ubicacion: ubicacion,
        telefono:telefono,
        zona:zona,
        jornada:jornada,
        correoElectronico:correoElectronico,
        municipio: this.stateCtrlmunicipio.value.toString(),
        departamento: this.stateCtrl.value.toString() 
      }
      console.log(tarea);
        const respuesta=this._adminService.update(this.data.id,tarea,"institucion/institucionUpdate/").subscribe({next: data => {
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
          this._snackBar.open('Institución actualizada con exito',
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
   
    this.router.navigate(['/admin/institucion']);
  
  }
}

  } 

  verificacion(){
  
    //console.log(this.stateCtrlmateria.value);
    console.log(this.datosmunicipio);
    this.datosdepartamento.forEach(state=>( state.nombre.trim().toLowerCase() === this.selectiondep.toString().trim().toLowerCase() ? (this.compclick=true,console.log("entre")):"",console.log(state.nombre.trim().toLowerCase()) ));
    this.datosmunicipio.forEach(state=> (state.municipio.trim().toLowerCase() === this.selectionmun.toString().trim().toLowerCase() ?(this.compclickgrado=true,console.log("entre")) : "",console.log(state.municipio.trim().toLowerCase())));
    if(this.compclick){this.probarclick=true}else{this.probarclick=false};
    if(this.compclickgrado){this.probarclickgrado=true}else{this.probarclickgrado=false};
    
    this.compclick=false;
    this.compclickgrado=false;
    
    if(this.selectiondep.length>0 && this.selectionmun.length>0 && this.datosmunicipio.length>0 && this.datosdepartamento.length>0 && (this.probarclick && this.probarclickgrado)){
      this.btnact=true;
      this.probar=true;
      
      //console.log("click verificación true");
    }else{
      this.btnact=false;
      this.probar=false;
      //console.log("click verificación false");
    }
   }

    selectedMunicipio(event: MatAutocompleteSelectedEvent): void {
      this.seleccionadoMunicipio=(event.option.viewValue);
      this.Municipio= this.seleccionadoMunicipio;
      this.btnact=true;
    
    }


    selected(event: MatAutocompleteSelectedEvent): void {
      this.seleccionado=(event.option.viewValue);
      this.Departamento= this.seleccionado;
      this.loading=true;
       this.spinner=false;
      const respuesta=this._adminService.getAll("Departamento_municipio/queryname/"+this.seleccionado+"/").subscribe({next: data => {
        this.datosmunicipio = data.body;
        console.log("datos institución: "+this.datosdepartamento.slice());
        },
        error:error => {
        this.errors = error.message;
          console.error('There was an error!', this.errors);
        }
      }
      );


      setTimeout(() => {
        
        if(this.datosmunicipio.length>0){
          
          this.loading=false;
       this.spinner=true;
          
          this.filtrarmunicipio = this.stateCtrlmunicipio.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filtrarmunicipio(state) : this.datosmunicipio.slice())),
          );
  
          
    
          console.log("filtrargrado"+this.filtrarmunicipio.forEach(value=>console.log(value)));
          
        }
      },3000);

   
    
  }
    

  private _filtrardepartamento(value: string): interfacedepartamento[] {
    const filterValue = value.toLowerCase();

    return this.datosdepartamento.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrarmunicipio(value: string): interfacemunicipio[] {
    const filterValue = value.toLowerCase();

    return this.datosmunicipio.filter(state => state.municipio.toLowerCase().includes(filterValue));
  }
  
  
  }

  


