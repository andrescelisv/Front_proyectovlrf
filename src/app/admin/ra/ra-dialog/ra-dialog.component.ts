import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { responseproyect } from '../../interfaces/response';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { Body, Grado, Materia, institucion } from '../../interfaces/docentes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { interfacegrado, interfacemateria } from '../../docentes/docente-dialog/docente-dialog.component';
import { interfacedba, interfacedocente, interfaceestudiante } from '../../rhu/rhu-dialog/rhu-dialog.component';

export interface interfaceinstitucion {
  id:string;
  nombre: string;
}

@Component({
  selector: 'app-ra-dialog',
  templateUrl: './ra-dialog.component.html',
  styleUrls: ['./ra-dialog.component.scss']
})
export class RaDialogComponent{
  [x: string]: any;
  stateCtrl = new FormControl('',[Validators.required]);  //Formulario de control de instituciones con validación y autocompletar 
  stateCtrldba = new FormControl('',[Validators.required]);
  stateCtrlmateria = new FormControl('',[Validators.required]);
  stateCtrlestudiantes = new FormControl('',[Validators.required,Validators.minLength(8)]);
  stateCtrldocentes = new FormControl('',[Validators.required,Validators.minLength(8)]);
  filtrarinstitucion!: Observable<interfaceinstitucion[]>;
  stateCtrlgrado = new FormControl('',[Validators.required]); 
  filtrargrado!:Observable<interfacegrado[]>;
  filtrarmateria!:Observable<interfacemateria[]>;
  filtrarestudiantes!:Observable<interfaceestudiante[]>;
  filtrardba!:Observable<interfacedba[]>;
  filtrardocentes!:Observable<interfacedocente[]>;
  stateCtrlMat = new FormControl('',[Validators.required]); 
  filtrarMat!:Observable<interfacegrado[]>;
  selectionmateria:any[]=[];
  selectiondba:any[]=[];
  selectionest:any[]=[];
  selectiondoc:any[]=[];
  selectionmat:any[]=[];
  selectiongra:any[]=[];
  datosgrado:interfacegrado[]=[];
  datosmateria:interfacemateria[]=[];
  datosinstitucion:interfaceinstitucion[]=[
   

  ]
 /* Creating an interface for the data that will be received from the database. */
 seleccionadoMat:string=""; //Valor del input matería
  datosdba:interfacedba[]=[];
  datosdocente:interfacedocente[]=[];
 
  datosestudiante:interfaceestudiante[]=[];

  setins:interfaceinstitucion[]=[]; //Almacena los datos procedentes del table-consumer-add que corresponden con institución 
  setgra:interfacedba[]=[];//Almacena los datos procedentes del table-consumer-add que corresponden con grado. 
  setmat:interfacemateria[]=[]; //Almacena los datos procedentes del table-consumer-add que corresponden con materia 
  setdoc:interfacedocente[]=[];
  setest:interfaceestudiante[]=[];
  setdba:interfacedba[]=[];
  loadinggraMat=false;
  spinnergraMat=false;
  loadingestdocdba=false;
  spinnerestdocdba=false;
  spinner=false;
  loading=false;
  showAlertMat:boolean=false;
  showAlert:boolean=false;
  showAlertDoc:boolean=false;
  showAlertEst:boolean=false;
  showAlertDBA:boolean=false;
  form!: FormGroup; //Contiene todos los inputs del formulario docente
  myDatepipe!: any;
  btnact=false; 
  errors:any;
  seleccionado!: string;
  estudiantenombre: any[]=[];
  docentenombre: any[]=[];
  gradonombre: any[]=[];
  materianombre: any[]=[];
  selectionins:any[]=[];
  verificar:boolean=true;
  activate:boolean=false;
  varnombre:string="";
  probar:boolean=false;
  probarclick:boolean=false;
  compclick:boolean=false;
  compclickest:boolean=false;
  compclickdoc:boolean=false;
  compclickdba:boolean=false;
  compclickgra:boolean=false;
  compclickmat:boolean=false;
  probarclickest:boolean=false;
  probarclickdoc:boolean=false;
  probarclickdba:boolean=false;
  probarclickgra:boolean=false;
  probarclickmat:boolean=false;
  inicio= false;
  datos: responseproyect={
    ok: true,
    message:" ",
    body: []
  };

  dbanombre: any[]=[];
  datosmateriatarea: any;
  institucionnombre!: string;
  institucionid!: string;


  constructor(private fb:FormBuilder,private _adminService: AdminService,private _snackBar: MatSnackBar, private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any, datepipe: DatePipe) { 
      /* The above code is calling the getAll method from the admin service. */
       const respuesta=this._adminService.getAll("institucion/all/").subscribe({next: data => {
         this.datosinstitucion = data.body;
         //console.log("datos institución: "+this.datosinstitucion.slice());
         },
         error:error => {
         this.errors = error.message;
           console.error('There was an error!', this.errors);
         }
       }
       );

     
     

    /* The above code is creating a form with the following fields:
    - nombre
    - cedula
    - fechaNacimiento
    - correoElectronico */
     /* *|CURSOR_MARCADOR|* */
     this.form = new FormGroup({
      videovisto: new FormControl('',[Validators.required,Validators.minLength(4)])
    })

   
     this.stateCtrlgrado.disable();  //Desabilita el grado mientras no se vuelva true.
     this.stateCtrlmateria.disable();//Desabilita la materia mientras no se vuelva true.
     
    
     this.myDatepipe = datepipe; //Se creo para dar formato a la fecha de tipo dd-mm-yyyy
     
    // console.log(this.data);
     //Verifica si es un usuario nuevo a ingresar
     if(data==null){
     
       //this.select='Admin';
       this.form.setValue({
        videovisto:""
      
       

      });
       //Inicializa todos los inputs del html
    
       //si la respuesta del servidor para consultar la instituciones es diferentes de null
       if(respuesta !=null){
        this.verificacion();
         //Retornar los objetos que coinciden que con el caracter o la cadena de busqueda ingresada en el input.
         this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
           startWith(''),
           map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
         );
       
       
       
      
     }
     }else{
       //Ingresa cuando se va a editar un usuario
       this.stateCtrlgrado.enable(); //Habilita la busqueda y selección de grado
       this.stateCtrlmateria.enable();  //Habilita la busqueda y selección de materia
   
       this.spinner=true;
       this.spinnergraMat=true;   //Muestra la información dentro del div que contiene el ngIf de spinner
       this.verificacion();
       //console.log(data);
        
       //Inicializa los valores del estudiante.
      this.loadingestdocdba= false;
      this.spinnerestdocdba=true;
     
     this.setins=data.institucion;  //Obtiene los datos de institución de la base de datos, apartir de la consulta realizada inicialmente
     this.setgra=data.grado;  //Obtiene los datos de grado de la base de datos, apartir de la consulta realizada inicialmente
     this.setmat=data.materia;  //Obtiene los datos de matería de la base de datos, apartir de la consulta realizada inicialmente
     this.setdoc=data.docente;
     this.setest=data.estudiante;
     this.setdba=data.dba;
    // console.log(this.setdba);
     
     this.stateCtrl.setValue(this.setins[0].nombre); //Inicializa el input de institución, no obstante esta parte
     //no es del todo fija, sino que se realiza con un tipo two data binding, que contiene el ngModel dentro del input
     this.stateCtrlgrado.setValue(this.setgra[0].grado);//Inicializa el input de grado, no obstante esta parte
     //no es del todo fija, sino que se realiza con un tipo two data binding, que contiene el ngModel dentro del input
    
     
     this.selectionest.push(this.setest[0].nombre);
     this.selectiondoc.push(this.setdoc[0].nombre);
     
     this.selectiongra.push(this.setgra[0].grado);
     this.selectionmat.push(this.setmat[0].nombre);
     this.selectionins.push(this.setins[0].nombre);
    
     const valordba=this.setdba.slice().map(value=>(value.dba));
    // console.log(valordba);
     this.stateCtrldocentes.setValue(this.selectiondoc.toString());
     this.stateCtrlestudiantes.setValue(this.selectionest.toString());
     this.stateCtrldocentes.clearValidators();
     this.stateCtrldocentes.addValidators(Validators.required);
     this.stateCtrldocentes.addValidators(Validators.minLength(1));

     this.stateCtrlestudiantes.clearValidators();
     this.stateCtrlestudiantes.addValidators(Validators.required);
     this.stateCtrlestudiantes.addValidators(Validators.minLength(1));

    this.selectiondba= valordba;
   
     

     
     
 
     //Permite filtrar la instituciones de ser necesario
     this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
       startWith(''),
       map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
     );

     this._adminService.getCustom("dba/","grado","materia",this.setgra[0].grado.toString(),this.setmat[0].nombre.toString()).subscribe({next: data => {
      this.datosdba = data.body;
      //console.log(this.datosdba);
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );

    
 
     //Realiza la consulta de los grados asociados a la institución seleccionada anteriormente, o que se obtuvo de la base
     //de datos.
     this._adminService.getAll("Grado/queryname/"+this.setins[0].nombre+"/").subscribe({next: data => {
      this.datosgrado = data.body;
     // console.log(this.datosgrado);
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
  //Realiza la consulta de las materias asociadas a la institución seleccionada anteriormente, o que se obtuvo de la base
    //de datos.
    this._adminService.getAll("Materia/queryname/"+this.setins[0].nombre+"/").subscribe({next: data => {
      this.datosmateria = data.body;
      //console.log(this.datosmateria);
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    this._adminService.getCustom("Docente/querynombregrado","nombre","grado",this.setins[0].nombre,this.setgra[0].grado).subscribe({next: data => {
      this.datosdocente = data.body;
      console.log(this.datosdocente);
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    //Obtiene las materias asociadas a una institución
    this._adminService.getCustom("estudiante/querynombregrado","nombre","grado",this.setins[0].nombre,this.setgra[0].grado).subscribe({next: data => {
      this.datosestudiante = data.body;
      
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
  
    
  
     //Realiza el filtrado del grado y la selección de un grado
     setTimeout(() => {
      this.verificacion();
     this.filtrardba = this.stateCtrldba.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrardba(state) : this.datosdba.slice(0,4))),
    );
    this.filtrardocentes = this.stateCtrldocentes.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrardocentes(state) : this.datosdocente.slice(0,4))),
    );
    this.filtrarestudiantes = this.stateCtrlestudiantes.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarestudiantes(state) : this.datosestudiante.slice(0,4))),
    );

    this.filtrarmateria = this.stateCtrlmateria.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarmateria(state) : this.datosmateria.slice(0,4))),
    );

    this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice(0,4))),
    );

   
 
     if(this.seleccionadoMat.length>0){
       //En el caso que exista mas de una materia en la base de datos se habilita el botón de guardar.
       this.btnact=true;
      }else{
       this.btnact=false;
      }

    },1000);
   }
   }

  

  selected(event: MatAutocompleteSelectedEvent): void { 
    this.stateCtrlgrado.enable(); //Habilita la busqueda y selección de grado
    this.stateCtrlmateria.enable();  //Habilita la busqueda y selección de materia
    this.spinner=true;
       //Muestra la información dentro del div que contiene el ngIf de spinner
    this.seleccionado=(event.option.viewValue);
    this.loadinggraMat=true;
    this.spinnergraMat=false;
     
    //Inicializa los valores del estudiante.
 


  //Realiza la consulta de los grados asociados a la institución seleccionada anteriormente, o que se obtuvo de la base
  //de datos.
  this._adminService.getAll("Grado/queryname/"+this.seleccionado+"/").subscribe({next: data => {
    this.datosgrado = data.body;
    //console.log(this.datosgrado);
    },
    error:error => {
    this.errors = error.message;
      console.error('There was an error!', this.errors);
    }
  }
  );
//Realiza la consulta de las materias asociadas a la institución seleccionada anteriormente, o que se obtuvo de la base
  //de datos.
  this._adminService.getAll("Materia/queryname/"+this.seleccionado+"/").subscribe({next: data => {
    this.datosmateria = data.body;
    //console.log(this.datosmateria);
    },
    error:error => {
    this.errors = error.message;
      console.error('There was an error!', this.errors);
    }
  }
  );

 

  setTimeout(() => {
    this.loadinggraMat=false;
    this.spinnergraMat=true;
    if(this.datosmateria.length>0){
      this.showAlert=false;
      this.stateCtrldba.enable();
       //console.log(this.datosdba.forEach(value=>(console.log(value))));
      

      this.filtrarmateria = this.stateCtrlmateria.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this._filtrarmateria(state) : this.datosmateria.slice(0,4))),
      );

      this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice(0,4))),
      );

      
    }
    else{
      this.stateCtrlmateria.disable(); //Si no se obtiene nada de la base de datos se desabilita la opción de seleccionar un grado
      this.showAlert=true;
    
    }

    if(this.datosgrado.length>0){
      this.showAlert=false;
      this.stateCtrldocentes.enable();
      

     

   
    }
    else{
      this.stateCtrlgrado.disable(); //Si no se obtiene nada de la base de datos se desabilita la opción de seleccionar una materia
      this.showAlert=true;
    }

     this.verificacion();
    this.loading=false; 
    
    this.spinner=true;

  },3000);

  }
  selectedgrado(event: MatAutocompleteSelectedEvent): void { 

    this.loadingestdocdba=true;
    this.spinnerestdocdba=false;
    //console.log(this.stateCtrl.value.toString());

    const respuestadba=this._adminService.getCustom("dba/","grado","materia",this.stateCtrlgrado.value.toString(),this.stateCtrlmateria.value.toString()).subscribe({next: data => {
      this.datosdba = data.body;
     // console.log(this.datosdba);
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );

    this._adminService.getAll("Docente/queryname/"+this.stateCtrl.value.toString()+"/").subscribe({next: data => {
      this.datosdocente = data.body;
      //console.log(this.datosdocente);
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    //Obtiene las materias asociadas a una institución
    this._adminService.getAll("Estudiante/queryname/"+this.stateCtrl.value.toString()+"/").subscribe({next: data => {
      this.datosestudiante = data.body;
    //  console.log(this.datosestudiante);
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );


    setTimeout(() => {
      this.loadingestdocdba=false;
      this.spinnerestdocdba=true;
     // console.log(this.datosdba);

    this.filtrardba = this.stateCtrldba.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrardba(state) : this.datosdba.slice(0,4))),
    );
    this.filtrardocentes = this.stateCtrldocentes.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrardocentes(state) : this.datosdocente.slice(0,4))),
    );
    this.filtrarestudiantes = this.stateCtrlestudiantes.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarestudiantes(state) : this.datosestudiante.slice(0,4))),
    );

    //console.log(this.selectionest);
   
    this.datosdocente.length>0 ? "" : (this.showAlertDoc=true, this.stateCtrldocentes.disable());
    this.datosdba.length>0 ? "" : (this.showAlertDBA=true, this.stateCtrldba.disable());
    this.datosestudiante.length>0 ? "" : (this.showAlertEst=true, this.stateCtrlestudiantes.disable());
    
  },3000);

  
  

 
  }

 verificacion(){
  this.datosinstitucion.forEach(state=>( state.nombre.trim().toLowerCase() === this.selectionins.toString().trim().toLowerCase() ? (this.compclick=true):"") );
    this.datosestudiante.forEach(state=> (state.nombre.trim().toLowerCase() === this.selectionest.toString().trim().toLowerCase() ?(this.compclickest=true) : ( "")));
    this.datosdocente.forEach(state=> (state.nombre.trim().toLowerCase() === this.selectiondoc.toString().trim().toLowerCase() ?(this.compclickdoc=true) : ( "")));
    //this.datosdba.forEach(state=> (state.identificador.trim().toLowerCase() === this.selectiondba.toString().trim().toLowerCase() ?(this.compclickdba=true) : ""));
    this.datosgrado.forEach(state=> (state.grado.trim().toLowerCase() === this.selectiongra.toString().trim().toLowerCase() ?(this.compclickgra=true) : ""));
    this.datosmateria.forEach(state=> (state.nombre.trim().toLowerCase() === this.selectionmat.toString().trim().toLowerCase() ?(this.compclickmat=true) : ""));
   
    if(this.compclick){(this.probarclick=true)}else{this.probarclick=false};
    if(this.compclickest){this.probarclickest=true}else{this.probarclickest=false};
    if(this.compclickdoc){this.probarclickdoc=true}else{this.probarclickdoc=false};
    //if(this.compclickdba){this.probarclickdba=true}else{this.probarclickdba=false};
    if(this.compclickgra){this.probarclickgra=true}else{this.probarclickgra=false};
    if(this.compclickmat){this.probarclickmat=true}else{this.probarclickmat=false};
    this.compclick=false;
    this.compclickest=false;
    this.compclickdoc=false;
   // this.compclickdba=false;
    this.compclickgra=false;
    this.compclickmat=false;
   
   // console.log(this.datosdba);
 
    if(this.selectionins.length>0 && this.selectionest.length>0 && this.selectiondoc.length>0  
      && this.selectiongra.length>0 && this.selectionmat.length>0 
      && this.datosinstitucion.length>0 && this.datosestudiante.length>0 && this.datosdocente.length>0 && 
      this.datosdba.length>0 && this.datosgrado.length>0 && this.datosmateria.length>0 &&
      (this.probarclick && this.probarclickest && this.probarclickdoc && this.probarclickgra && this.probarclickmat)
      
      
      ){
      this.btnact=true;
      this.probar=true;
      
    }else{
      this.btnact=false;
     
    }
    this.inicio=true;
 }

  selectedEstudiantes(event: MatAutocompleteSelectedEvent): void { 
   
  }
  selectedDocentes(event: MatAutocompleteSelectedEvent): void { 
    if(this.datosdocente.length>0 && this.datosestudiante.length>0 &&this.datosdba.length>0 && this.stateCtrldba.value.length>0 && this.stateCtrldocentes.value.length>0 && this.stateCtrlestudiantes.value.length>0 ){
      this.btnact=true;
    }else{
      this.btnact=false;
    }
  }
  selectedmateria(event: MatAutocompleteSelectedEvent): void { 
    if(this.datosdocente.length>0 && this.datosestudiante.length>0 &&this.datosdba.length>0 && this.stateCtrldba.value.length>0 && this.stateCtrldocentes.value.length>0 && this.stateCtrlestudiantes.value.length>0 ){
      this.btnact=true;
    }else{
      this.btnact=false;
    }
  }

  clickedOptionMateria(){
    //Este se produce cuando el usuario selecciona uno o varias materias
    if(this.datosdocente.length>0 && this.datosestudiante.length>0 &&this.datosdba.length>0 && this.stateCtrldba.value.length>0 && this.stateCtrldocentes.value.length>0 && this.stateCtrlestudiantes.value.length>0 ){
      this.btnact=true;
    }else{
      this.btnact=false;
    }
   
    
   

}

clickedOptionDBA(){
  //Este se produce cuando el usuario selecciona uno o varias materias
 
 
  
 

}

  Ingresar(){

    if(this.probar){
//Antes
      /*
    let filterValueArray:any[]=[];
    let filterDBAArray:any[]=[];
    let filterMateriaArray:any[]=[];
    let filterGradoArray:any[]=[];
    let filterDocentesArray:any[]=[];
    let filterEstudiantesArray:any[]=[];


*/


let filterValueArray:string;
    let filterDBAArray:string;
    let filterMateriaArray:string;
    let filterGradoArray:string;
    let filterDocentesArray:string;
    let filterEstudiantesArray:string;



    let datosdba:any[]=[];
    let datosestudiante:any[]=[];
    let datosdocente:any[]=[];
    let datosgrado:any[]=[];
    let datosmateria:any[]=[];
    
    
    let filtervalue:any="";
    let filtervaluedba:any="";
    let filtervaluedocente:any="";
    let filtervalueestudiante:any="";
    let filtervaluegrado:any="";
    let filtervaluemateria:any="";
    
   // this.datosmateriatarea.length=0;
    this.docentenombre=[];
    this.estudiantenombre=[];
    this.dbanombre=[];

    //Se obtiene los valores del form group y se tratan como constantes
    const videovistostr = this.form.value.videovisto;
    
  
    //Se convierte la fecha obtenida en el formato dispuesta aquí
    let fechaactual = new Date();
    const ConvertedDate = this.myDatepipe.transform(fechaactual, 'dd-MM-yyyy hh:mm a');
    
    //Se obtiene los arreglos de selección del usuario, el de institución que corresponde con stateCtrl es un string junto congrados 
    //en el caso de materia es un arreglo.
    filterValueArray = this.stateCtrl.value;
    filterDBAArray = this.stateCtrldba.value;
    filterDocentesArray = this.stateCtrldocentes.value;
    filterEstudiantesArray = this.stateCtrlestudiantes.value;
    filterMateriaArray = this.stateCtrlmateria.value;
    filterGradoArray = this.stateCtrlgrado.value;

 
      
    /*for(let i=0;i<filterGradoArray.length;i++){
      filtervaluegrado=filterGradoArray[i];
    }

    for(let i=0;i<filterMateriaArray.length;i++){
      filtervaluemateria=filterMateriaArray[i];
    }*/
    
    let filterValue: string;
    let filterValueestudiante: string;
    let filterValuedocente: string;
    let filterValuegrado: string;
    let filterValuemateria: string;
    let filterValuedba: string;
    filtervalue= filterValueArray; 
    
    if(typeof filtervalue != 'string'){
    filterValue = filtervalue[0].toLowerCase(); //Se convierte a minuscula para hacer una comparación igualitaria.
   // console.log(filterValue);
    }else{
      filterValue = filtervalue.toLowerCase(); 
    }
    //Se extrae el objeto que corresponde con el valor ingresado por el usuario.
    this.datosinstitucion=this.datosinstitucion.filter(state => state.nombre.toLowerCase().includes(filterValue));
    
   
    /*const filterValueMat = this.seleccionadoMat;
    this.datosmateria=this.datosmateria.filter(state => state.nombre.toLowerCase().includes(filterValueMat));*/

   


   
     
    filtervalueestudiante = filterEstudiantesArray;
  if(typeof filtervalueestudiante != 'string'){
    filterValueestudiante = filtervalueestudiante[0].toLowerCase(); //Convierte el valor de grado a minusculas //Se convierte a minuscula para hacer una comparación igualitaria.
    }else{
      filterValueestudiante = filtervalueestudiante.toLowerCase(); //Convierte el valor de grado a minusculas
    }
  
  
      
      //Realiza agregación del objeto que coincide con la busqueda del usuario.
      datosestudiante.push(this.datosestudiante.filter(state => state.nombre.toLowerCase().includes(filterValueestudiante)));
  
       
 
  
     //Se obtiene la o las materias seleccionadas para el estudiante.
     datosestudiante.slice().forEach(value=>(value.forEach((value: { id: string; nombre:string;})=>(this.estudiantenombre.push({id:value.id,nombre:value.nombre})))));
   //this.datosmateria.slice().forEach(value=>(this.materiaid=value.id));
  
   filtervaluedocente = filterDocentesArray;
   if(typeof filtervaluedocente != 'string'){
     filterValuedocente = filtervaluedocente[0].toLowerCase(); //Convierte el valor de grado a minusculas //Se convierte a minuscula para hacer una comparación igualitaria.
     }else{
       filterValuedocente = filtervaluedocente.toLowerCase(); //Convierte el valor de grado a minusculas
     }
   
    
       
       //Realiza agregación del objeto que coincide con la busqueda del usuario.
       datosdocente.push(this.datosdocente.filter(state => state.nombre.toLowerCase().includes(filterValuedocente)));
   
     
  
   
      //Se obtiene la o las materias seleccionadas para el estudiante.
      datosdocente.slice().forEach(value=>(value.forEach((value: { id: string; nombre:string;})=>(this.docentenombre.push({id:value.id,nombre:value.nombre})))));
    //this.datosmateria.slice().forEach(value=>(this.materiaid=value.id));

   for(let i=0;i<filterDBAArray.length;i++){
    
      filterValuedba = filterDBAArray[i].toLowerCase(); //Convierte el valor de grado a minusculas //Se convierte a minuscula para hacer una comparación igualitaria.
      
    
     
     
        
        //Realiza agregación del objeto que coincide con la busqueda del usuario.
        datosdba.push(this.datosdba.filter((state:any) => state.toLowerCase().includes(filterValuedba)));
      }
         

      //value=>(value.forEach((value: { id: string; identificador:string;})=>(this.dbanombre.push({id:value.id,dba:value}),console.log(value.id))))
   
    
       //Se obtiene la o las materias seleccionadas para el estudiante.
       datosdba.slice().forEach(value=>this.dbanombre.push({dba:value.toString()}));
     //this.datosmateria.slice().forEach(value=>(this.materiaid=value.id));
  

     filtervaluemateria = filterMateriaArray;
    if(typeof filtervaluemateria != 'string'){
      filterValuemateria = filtervaluemateria[0].toLowerCase(); //Convierte el valor de grado a minusculas //Se convierte a minuscula para hacer una comparación igualitaria.
      }else{
        filterValuemateria = filtervaluemateria.toLowerCase(); //Convierte el valor de grado a minusculas
      }
    
    
        
        //Realiza agregación del objeto que coincide con la busqueda del usuario.
        datosmateria.push(this.datosmateria.filter(state => state.nombre.toLowerCase().includes(filterValuemateria)));
    
         
   
    
       //Se obtiene la o las materias seleccionadas para el estudiante.
       datosmateria.slice().forEach(value=>(value.forEach((value: { id: string; nombre:string;})=>(this.materianombre.push({id:value.id,nombre:value.nombre})))));
       
       function comparar(valor:string,filtro:string):boolean{
        if(valor==filtro){
          return true;
        }else{
          return false;
        }
       }


       filtervaluegrado = filterGradoArray;
       if(typeof filtervaluegrado != 'string'){
         filterValuegrado = filtervaluegrado[0].toLowerCase(); //Convierte el valor de grado a minusculas //Se convierte a minuscula para hacer una comparación igualitaria.
         }else{
           filterValuegrado = filtervaluegrado.toLowerCase(); //Convierte el valor de grado a minusculas
         }
       
       
           
           //Realiza agregación del objeto que coincide con la busqueda del usuario.
           datosgrado.push(this.datosgrado.filter(state => comparar(state.grado.trim().toLowerCase().toString(),filterValuegrado.
           trim().toLowerCase().toString())));
       
            
      
       
          //Se obtiene la o las materias seleccionadas para el estudiante.
          datosgrado.slice().forEach(value=>(value.forEach((value: { id: string; grado:string;})=>(this.gradonombre.push({id:value.id,grado:value.grado})))));
        //this.datosmateria.slice().forEach(value=>(this.materiaid=value.id));
     
    
     
       //this.datosmateria.slice().forEach(value=>(this.materiaid=value.id));
   //Se obtiene la institución seleccionada para el estudiante
   this.datosinstitucion.slice().forEach(value=>(this.institucionnombre=value.nombre));
    this.datosinstitucion.slice().forEach(value=>(this.institucionid=value.id));
   

   
    if(this.data==null){ 
      this._adminService.getCustomRA("RA/queryestudianteRA",'nombreestudiante','nombremateria','grado','nombredocente',this.stateCtrlestudiantes.value,this.stateCtrlmateria.value,this.stateCtrlgrado.value,this.stateCtrldocentes.value).subscribe({next: data => {
        this.verificar = data.body;
        
        },
        error:error => {
        this.errors = error.message;
          console.error('There was an error!', this.errors);
        }
      }
      );
      if(this.verificar){
        //console.log(this.verificar);
        this._snackBar.open('Espere un momento por favor',
        '', {horizontalPosition: 'center',
         verticalPosition: 'bottom',
         duration: 8000});
         this.btnact=false;
  
       }
      
      
       
       setTimeout(() => {
        
      if(this.verificar){
       this.activate=true;
      this._snackBar.open('La ruta de aprendizaje ya se encuentran registrada',
      '', {horizontalPosition: 'center',
       verticalPosition: 'bottom',
       duration: 8000});

       this._snackBar.open('La ruta de aprendizaje ya se encuentra registrada',
      '', {horizontalPosition: 'center',
       verticalPosition: 'top',
       duration: 8000});

       
       this.btnact=true;
      }
     
      if(!this.verificar){
        
       //En el caos que sea un usuario nuevo se crea el objeto tareas de la siguiente forma
      const tarea:any={
        dba:[],
        fecha: ConvertedDate,
        grado:[{id:this.gradonombre[0].id,grado:this.gradonombre[0].grado}],
        materia:[{id:this.materianombre[0].id,nombre:this.materianombre[0].nombre}],
        docente:[{id:this.docentenombre[0].id,nombre:this.docentenombre[0].nombre}],
        estudiante:[],
        institucion:[{id:this.institucionid, nombre: this.institucionnombre}]
        //grado= this.datosgrado
      }


      /*for(let i=0;i<this.dbanombre.length;i++){
        tarea.dba.
        .dba.push(this.dbanombre[i]); //Se añaden al objeto tarea el grado seleccionado por el estudiante.
      }*/
       
      
      /*this.datosdocente.forEach(value=>console.log(value));
      for(let i=0;i<this.docentenombre.length;i++){
        tarea.dba.docente.push(this.docentenombre[i]);//Se añaden al objeto tarea la materia seleccionada por el estudiante.
      }*/
           
        
      for(let i=0;i<1;i++){
        tarea.estudiante.push(this.estudiantenombre[i]);//Se añaden al objeto tarea la materia seleccionada por el estudiante.
      }

      for(let i=0;i<this.dbanombre.length;i++){
        
        tarea.dba.push(this.dbanombre[i]);//Se añaden al objeto tarea la materia seleccionada por el estudiante.
      }

     /* console.log(tarea);
      for(let i=0;i<datosvideovisto.length;i++){
        console.log(datosvideovisto[i]);
        tarea.dba.videovisto.push(datosvideovisto[i]);//Se añaden al objeto tarea la materia seleccionada por el estudiante.
      }*/

    // console.log(tarea);
      //Se añade el objeto tarea a la petición post del servicio.
      const respuesta=this._adminService.create(tarea,"RA/addRA/").subscribe({next: data => {
      this.datos = data;
     // console.log("create: "+this.datos);
  
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    //Se espera un tiempo hasta obtener la respuesta del servidor
   //Se espera un tiempo hasta obtener la respuesta del servidor
   setTimeout(() => {
    //console.log(this.datos);
    if(this.datos.message=="success"){
      this._snackBar.open('Ruta de aprendizaje agregada con exito',
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
    }
    else{
       //En el caso que se este editando un estudiante se realiza el mismo procedimiento que para un usuario nuevo con la diferencia
       // que la petición utilizada en el servicio es de tipo put.
      
       let fechaactual = new Date();
       const ConvertedDate = this.myDatepipe.transform(fechaactual, 'dd-MM-yyyy hh:mm a');
      const tarea:any={
        id:this.data.id,
        dba:[],
        fecha: ConvertedDate,
        grado:[{id:this.gradonombre[0].id,grado:this.gradonombre[0].grado}],
        materia:[{id:this.materianombre[0].id,nombre:this.materianombre[0].nombre}],
        docente:[{id:this.docentenombre[0].id,nombre:this.docentenombre[0].nombre}],
        estudiante:[],
        institucion:[{id:this.institucionid, nombre: this.institucionnombre}]
        //grado= this.datosgrado
      }


      /*for(let i=0;i<this.dbanombre.length;i++){
        tarea.dba.
        .dba.push(this.dbanombre[i]); //Se añaden al objeto tarea el grado seleccionado por el estudiante.
      }*/
       
      
      /*this.datosdocente.forEach(value=>console.log(value));
      for(let i=0;i<this.docentenombre.length;i++){
        tarea.dba.docente.push(this.docentenombre[i]);//Se añaden al objeto tarea la materia seleccionada por el estudiante.
      }*/
           
        
      for(let i=0;i<1;i++){
        tarea.estudiante.push(this.estudiantenombre[i]);//Se añaden al objeto tarea la materia seleccionada por el estudiante.
      }

      for(let i=0;i<this.dbanombre.length;i++){
        tarea.dba.push(this.dbanombre[i]);//Se añaden al objeto tarea la materia seleccionada por el estudiante.
      }
      //console.log(tarea);
        const respuesta=this._adminService.update(this.data.id,tarea,"RA/RAUpdate/").subscribe({next: data => {
        this.datos = data;
  //  console.log(this.datos);
        },
        error:error => {
        this.errors = error.message;
          console.error('There was an error!', this.errors);
        }
      }
      );
  
    if(this.datos.ok==true){
      this._snackBar.open('Ruta de aprendizaje actualizado con exito',
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
    //this.comprobar= true;
    this.router.navigate(['/admin/ra']);
  }
  
  }

  }

  private _filtrarinstitucion(value: string): interfaceinstitucion[] {
    const filterValue = value.toLowerCase();

    return this.datosinstitucion.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrargrado(value: string): interfacegrado[] {
    const filterValue = value.toLowerCase();
    
   
    return this.datosgrado.filter(state => state.grado.toLowerCase().includes(filterValue));
  }

  private _filtrarmateria(value: string): interfacemateria[] {
    const filterValue = value.toLowerCase();
    
   
    return this.datosmateria.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrardba(value: string): interfacedba[] {
    const filterValue = value.toLowerCase();
    
   // console.log(this.datosdba.filter(state => state.dba.toLowerCase().includes(filterValue)));
    if(this.stateCtrldba.value.length>0 && this.stateCtrldocentes.value.length>10 && this.stateCtrlestudiantes.value.length>10){
      this.btnact=true;
      
    }else{
      
      this.btnact=false;
    }
    return this.datosdba.filter(state => state.dba.toLowerCase().includes(filterValue));
  }

  private _filtrardocentes(value: string): interfacedocente[] {
    const filterValue = value.toLowerCase();
    if(this.stateCtrldba.value.length>0 && this.stateCtrldocentes.value.length>10 && this.stateCtrlestudiantes.value.length>10){
      this.btnact=true;
     
    }else{
    
      this.btnact=false;
    }

    return this.datosdocente.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrarestudiantes(value: string): interfaceestudiante[] {
    const filterValue = value.toLowerCase();
    if(this.stateCtrldba.value.length>0 && this.stateCtrldocentes.value.length>10 && this.stateCtrlestudiantes.value.length>10){
      this.btnact=true;
     
    }else{
    
      this.btnact=false;
    }
    
    return this.datosestudiante.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

}
