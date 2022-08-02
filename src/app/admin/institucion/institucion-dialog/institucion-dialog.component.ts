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
  seleccionado:string="";
  errors:string="";
  seleccionadoMunicipio="";
  Departamento:string="";
  Municipio:string="";
  
  datos:any;
  form!: FormGroup;
  loading=false;
  spinner=false;
  selectJornada:string="";
  selectZona:string="";
  stateCtrl = new FormControl('',[Validators.required]); 
  stateCtrlmunicipio = new FormControl('',[Validators.required]); 
  filtrarDepartamento!: Observable<interfacedepartamento[]>;
  filtrarmunicipio!: Observable<interfacemunicipio[]>;
  datosmunicipio:any[]=[];
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
        console.log("this institucion: "+this.filtrarDepartamento.forEach(value=>console.log(value)));
      
      
      
      }else{
       
        this.stateCtrlmunicipio.enable();
        this.btnact=true;
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
      console.log(data.jornada);
      console.log(data.zona);
      this.selectJornada=data.jornada;
      this.selectZona=data.zona;
      
  
      
    }
  }

    Ingresar(){

      const nombre = this.form.value.nombre;
      const ubicacion = this.form.value.ubicacion; 
      const telefono = this.form.value.telefono;
      const zona = this.form.value.zona;  
      const jornada = this.form.value.jornada;
      const correoElectronico = this.form.value.correoElectronico; 
     


      if(this.data==null){ 
        const tarea={
          nombre:nombre,
          ubicacion:ubicacion,
          telefono:telefono,
          zona:zona,
          jornada:jornada,
          correoElectronico:correoElectronico,
          municipio: this.Municipio,
          departamento: this.Departamento  //grado= this.datosgrado
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
          console.log(this.datos);
          if(this.datos.message=="success"){
            this._snackBar.open('Docente creado con exito',
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
        nombre:nombre,
        ubicacion: ubicacion,
        telefono:telefono,
        zona:zona,
        jornada:jornada,
        correoElectronico:correoElectronico,
        municipio: this.Municipio,
        departamento: this.Departamento,
      }
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
  
    if(this.datos.ok==true){
      this._snackBar.open('Usuario actualizado con exito',
      '', {horizontalPosition: 'center',
       verticalPosition: 'bottom',
       duration: 5000});
    }else{
      this._snackBar.open('Datos erroneos',
      '', {horizontalPosition: 'center',
       verticalPosition: 'bottom',
       duration: 5000});
    }
   
    this.router.navigate(['/admin/docentes']);
  
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

  


