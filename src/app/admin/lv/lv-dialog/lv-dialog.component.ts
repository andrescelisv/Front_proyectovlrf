import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { responseproyect } from '../../interfaces/response';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { Body, Grado, Materia, institucion, Docentes } from '../../interfaces/docentes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { videoLista } from './listaVideo';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

interface comprobacion {
  comprobar : boolean;
}

export interface interfaceinstitucion {
  id:string;
  nombre: string;
  ubicacion: string;
}

export interface interfacedba {
  id:string,
  identificador: string;
  materia: string;
  grado: string;
  dba: string;
}

export interface interfacemateria{
  id:string,
  nombre: string;
}

export interface interfaceestudiante{
  id:string,
  nombre:string
}

export interface interfacedocente{
  id:string,
  nombre:string
}

export interface interfacelistaVideos{
  video: string;
}

export interface interfacevideovisto{
  fecha:string,
  videovisto:string
}
export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: 'app-lv-dialog',
  templateUrl: './lv-dialog.component.html',
  styleUrls: ['./lv-dialog.component.scss']
})
export class LvDialogComponent{

  @Input() tareasEdit: any =[]; //Recibe de en event emitter procedente de tabla template
   //Contiene todos los inputs del formulario docente
  seleccionado:string=""; // valor del input institución
  seleccionadostr:string=""; //valor del input grado
  seleccionadoMat:string=""; //Valor del input matería
  seleccionadoDoc:string="";
  seleccionadoEst:string="";
  stateCtrl = new FormControl('',[Validators.required]);  //Formulario de control de instituciones con validación y autocompletar 
  stateCtrldba = new FormControl('',[Validators.required]); //Formulario de control de dba con validación y autocompletar
  stateCtrlLV = new FormControl('',[Validators.required]); //Formulario de control de grado con validación y autocompletar
  stateCtrldocentes = new FormControl('',[Validators.required]);//Formulario de control de materia con validación y autocompletar
  stateCtrlestudiantes = new FormControl('',[Validators.required]);
  select = new Date(0, 0, 0); //Creación de objeto fecha.
  comprobar=false; 
  filteredStates!: Observable<State[]>; 
  filtrarinstitucion!: Observable<interfaceinstitucion[]>;//Captura las peticiones get de institución y espera hasta obtener la respuesta asincrona por medio del observable
  filtrardba!: Observable<interfacedba[]>;//Captura las peticiones get de grado y espera hasta obtener la respuesta asincrona por medio del observable
  filtrarlv!: Observable<interfacelistaVideos[]>;//Captura las peticiones get de grado y espera hasta obtener la respuesta asincrona por medio del observable
  filtrarestudiantes!: Observable<interfaceestudiante[]>;
  filtrarmateria!: Observable<interfacemateria[]>;//Captura las peticiones get de materia y espera hasta obtener la respuesta asincrona por medio del observable
  filtrardocentes!: Observable<interfacedocente[]>;
  loading=false; // Carga un spinner en pantalla
  loadingEst=false;
  spinner=false; //Se utiliza en el div para gestionar la presencia o no de inputs.
  spinnerEst=false;
  loadingInst=false;
  spinnerInst=false;
  setins:interfaceinstitucion[]=[]; //Almacena los datos procedentes del table-consumer-add que corresponden con institución 
  setgra:interfacedba[]=[];//Almacena los datos procedentes del table-consumer-add que corresponden con grado. 
  setmat:interfacemateria[]=[]; //Almacena los datos procedentes del table-consumer-add que corresponden con materia 
  setdoc:interfacedocente[]=[];
  setdba:interfacedba[]=[];
  setest:interfaceestudiante[]=[];
  setlistaVideos:any[]=[];
  selectionmateria:any[]=[]; //Almacena la materia seleccionada
  datosgradotarea:any[]=[];  //alamcena los datos de grado que van a ser enviados al back.
  datosmateriatarea:any[]=[]; //alamcena los datos de materia que van a ser enviados al back.
  docenteid="";  //Almacena el id de grado que es de tipo string.
  docentenombre:any[]=[]; //Almacena el valor de grado, que es un vector que corresponde a la selección de los diferentes grados
  //por parte del usuario.
  dbaid="";  //id de materia
  dbanombre:interfacedba[]=[]; //Nombre de materia
  estudianteid="";  //id de materia
  estudiantenombre:any[]=[]; //Nombre de materia
  btnact=false;   //boton de guardar no activo por defecto
  institucionnombre:string="";   //Nombre de institución
  institucionid:string="";      //id de institución
  showAlert:boolean=false;  //Muestra un toots de alerta para institución
  showAlertMat:boolean= false;  //Muestra un toots de alerta para materia
  form:FormGroup;
  selectionins:any[]=[];
  selectionest:any[]=[];
  selectiondoc:any[]=[];
  amper:boolean=false;
  selectiondba:any[]=[];
  verificar:boolean=true;
  activate:boolean=false;
  varnombre:string="";
  probar:boolean=false;
  probarclick:boolean=false;
  compclick:boolean=false;
  compclickest:boolean=false;
  compclickdoc:boolean=false;
  compclickdba:boolean=false;
  probarclickest:boolean=false;
  probarclickdoc:boolean=false;
  probarclickdba:boolean=false;
  /* Creating a variable called datos and assigning it a value of an object with the properties ok,
  message, and body. */
  datos: responseproyect={
    ok: true,
    message:" ",
    body: []
  };

/* Creating an array of objects that have the same structure. */
  datosinstitucion:interfaceinstitucion[]=[
   

  ]
 /* Creating an interface for the data that will be received from the database. */
  datosdba:interfacedba[]=[];
  datosdocente:interfacedocente[]=[];
  datosmateria:interfacemateria[]=[];
  datosestudiante:interfaceestudiante[]=[];
  datoslistaVideo:any[]=[];
 
  
 /* The above code is creating a new event emitter called addUser. */
  errors:any;
  @Output() addUser: EventEmitter<comprobacion> = new EventEmitter();
  myDatepipe!: any;

  constructor(private fb:FormBuilder,private _adminService: AdminService,private _snackBar: MatSnackBar, private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any, datepipe: DatePipe
    ){ 
     /* The above code is calling the getAll method from the admin service. */
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

      const respuestadba=this._adminService.getAll("DBA/all/").subscribe({next: data => {
        this.datosdba = data.body;
        
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
    this.myDatepipe = datepipe; //Se creo para dar formato a la fecha de tipo dd-mm-yyyy
    this.stateCtrldba.disable();  //Desabilita el grado mientras no se vuelva true.
    this.stateCtrldocentes.disable();//Desabilita la materia mientras no se vuelva true.
    this.form = new FormGroup({
      listaVideos: this.fb.array([],[Validators.required,Validators.max(13),videoLista])
    })
   
    if(this.datosinstitucion.length>0){
      this.loadingInst=true;
      this.spinnerInst=false;
    }else{
      this.loadingInst=false;
      this.spinnerInst=true;
    }
 
    //Verifica si es un usuario nuevo a ingresar
    if(data==null){
      //this.select='Admin';
    
      //Inicializa todos los inputs del html
      this.form.setValue({
        listaVideos:[]
      
       

      });
      //si la respuesta del servidor para consultar la instituciones es diferentes de null
      if(respuesta !=null){

        //Retornar los objetos que coinciden que con el caracter o la cadena de busqueda ingresada en el input.
        this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
        );
      
      
      
     
    }
    }else{
      //Ingresa cuando se va a editar un usuario
      this.stateCtrldba.enable(); //Habilita la busqueda y selección de grado
      this.stateCtrldocentes.enable();  //Habilita la busqueda y selección de materia
      this.stateCtrlestudiantes.enable(); 
      this.loadingEst=false;
      this.spinnerEst=true;
      this.spinner=true;  //Muestra la información dentro del div que contiene el ngIf de spinner
      this.btnact=true;
     console.log(this.data);
     
 
    
//Crea un objeto con los valores obtenidos de la base de datos, relacionados 
    //a la fecha de nacimiento del estudiante.
    
      
      //this.select= new Date(Number(year),Number(month),Number(day));

      //Inicializa el input tipo date con los valores del objeto generador anteriormente
       
      //Inicializa los valores del estudiante.
    this.form.setValue({
      listaVideos: []
    });
    this.listaVideosFieldAsFormArray.push(this.listaVideo())
    for(let i=0;i<data.lv[0].listaVideos.length;i++){
    this.listaVideosFieldAsFormArray.push(this.listaVideo())
    }
    this.setlistaVideos = data.lv[0].listaVideos;

    var tagsArray: FormGroup[] = []; //Crea un arreglo que va a almacenar todos los formControl que se cree que son del input

this.setlistaVideos.forEach(product => tagsArray.push(this.fb.group({listaVideos: [product.video, [Validators.required]]})));  //Se crea nuevamente en el formGroup el input Array form
//Se utiliza el vector que contiene los datos que provienen del mat table que a su vez obtiene los datos de la base de datos.
this.form.setControl('listaVideos', this.fb.array(tagsArray || [])); //Con el array creado realiza el control
    


    console.log(this.setins.map(value => value.nombre));
    
    this.setdoc=data.lv[0].docente;  //Obtiene los datos de institución de la base de datos, apartir de la consulta realizada inicialmente
    this.setdba=data.lv;  //Obtiene los datos de grado de la base de datos, apartir de la consulta realizada inicialmente
    this.setest=data.estudiante;  //Obtiene los datos de matería de la base de datos, apartir de la consulta realizada inicialmente
    this.setins= data.institucion;
    this.setlistaVideos = data.lv[0].listaVideos;


    this.stateCtrl.setValue(this.setins.map(value => value.nombre)); //Inicializa el input de institución, no obstante esta parte
    //no es del todo fija, sino que se realiza con un tipo two data binding, que contiene el ngModel dentro del input
    this.stateCtrldba.setValue(this.setdba.map(value => value.dba));//Inicializa el input de grado, no obstante esta parte
    //no es del todo fija, sino que se realiza con un tipo two data binding, que contiene el ngModel dentro del input
    this.stateCtrldocentes.setValue(this.setdoc.map(value => value.nombre));

    this.stateCtrlestudiantes.setValue(this.setest.map(value => value.nombre));

    this.selectionins.push(this.setins[0].nombre);
            
    this.selectionest.push(this.setest[0].nombre);
    this.selectiondoc.push(this.setdoc[0].nombre);
    this.selectiondba.push(this.setdba[0].dba);
    

    let institucion = this.setins.map(value => value.nombre).toString();
    console.log(this.datosinstitucion);
    
     //Coloca el vector con los valores obtenidos de la base de datos utilizando two data binding.

    //Permite filtrar la instituciones de ser necesario
    this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
    );

    //Realiza la consulta de los grados asociados a la institución seleccionada anteriormente, o que se obtuvo de la base
    //de datos.
    console.log(institucion);
    this._adminService.getAll("Docente/queryname/"+this.setins[0].nombre+"/").subscribe({next: data => {
      this.datosdocente = data.body;
     
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
//Realiza la consulta de las materias asociadas a la institución seleccionada anteriormente, o que se obtuvo de la base
    //de datos.
    this._adminService.getAll("Estudiante/queryname/"+this.setins[0].nombre+"/").subscribe({next: data => {
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

      if(this.datosdocente.length == 0 || this.datosestudiante.length==0){
        this.stateCtrldocentes.disable();
        this.stateCtrlestudiantes.disable();
      }else{
        this.stateCtrldocentes.enable();
        this.stateCtrlestudiantes.enable();
      }
    this.filtrardba = this.stateCtrldba.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrardba(state) : this.datosdba.slice(0,4))),
    );
 
    //Filtra las materias por un criterio de busqueda ingresado en el input. Este seleeciona varias materias.
    this.filtrardocentes = this.stateCtrldocentes.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrardocentes(state) : this.datosdocente.slice(0,4))),
    );

    this.filtrarestudiantes = this.stateCtrlestudiantes.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarestudiantes(state) : this.datosestudiante.slice(0,4))),
    );

    },1000);

    
  }
  }

  

  selecteddba(event: MatAutocompleteSelectedEvent): void { 
    //Este evento se activa cuando el usuario selecciona un grado
    this.seleccionadostr=(event.option.viewValue);
    console.log(this.seleccionadostr);

    if(this.seleccionadostr.length>0){
      this.btnact=true;
     }else{
      this.btnact=false;
     }
   

  }

  get listaVideosFieldAsFormArray():any{
    return this.form.get('listaVideos') as FormArray;
  }

  listaVideo():any{
      return this.fb.group({
        listaVideos : this.fb.control(''),
      })
  }

  addControl() :void{
    console.log(this.form.get('listaVideos'));
    this.listaVideosFieldAsFormArray.push(this.listaVideo())
  }

  remove(i: number): void{
    this.listaVideosFieldAsFormArray.removeAt(i);
  }

  formValue(): void{
   
    console.log(this.form.value);
  }

  selectedlv(event: MatAutocompleteSelectedEvent): void { 
    //Este evento se activa cuando el usuario selecciona un grado
    this.seleccionadostr=(event.option.viewValue);
    console.log(this.seleccionadostr);

    if(this.seleccionadostr.length>0){
      this.btnact=true;
     }else{
      this.btnact=false;
     }
   

  }

  clickedOptionMateria(){
    //Este se produce cuando el usuario selecciona uno o varias materias
    this.btnact=true;
   
    
   

}

verificacion(){
    
  let valor=" ";
    this.datosinstitucion.forEach(state=>( state.nombre.trim().toLowerCase() === this.selectionins.toString().trim().toLowerCase() ? (this.compclick=true):"") );
    this.datosestudiante.forEach(state=> (state.nombre.trim().toLowerCase() === this.selectionest.toString().trim().toLowerCase() ?(this.compclickest=true) : ( "")));
    this.datosdocente.forEach(state=> (state.nombre.trim().toLowerCase() === this.selectiondoc.toString().trim().toLowerCase() ?(this.compclickdoc=true) : ( "")));
    this.datosdba.forEach(state=> (state.identificador.trim().toLowerCase() === this.selectiondba.toString().trim().toLowerCase() ?(this.compclickdba=true) : ""));
    if(this.compclick){(this.probarclick=true)}else{this.probarclick=false};
    if(this.compclickest){this.probarclickest=true}else{this.probarclickest=false};
    if(this.compclickdoc){this.probarclickdoc=true}else{this.probarclickdoc=false};
    if(this.compclickdba){this.probarclickdba=true}else{this.probarclickdba=false};
    this.compclick=false;
    this.compclickest=false;
    this.compclickdoc=false;
    this.compclickdba=false;
   
   
    this.listaVideosFieldAsFormArray.value.forEach((e: any)=>e.listaVideos.indexOf('&')>0 ?this.amper=true : "")
    let ampersan:boolean;
    if(this.amper==true){ampersan=true}else{ampersan=false}
    this.amper=false;
   
    if(this.selectionins.length>0 && this.selectionest.length>0 && this.selectiondoc.length>0 && this.selectiondba.length>0 && this.datosinstitucion.length>0 && this.datosestudiante.length>0 && this.datosdocente.length>0 && 
      this.datosdba.length>0 &&
      (this.probarclick && this.probarclickest && this.probarclickdoc && this.probarclickdba) &&
    ampersan == false
      ){
      this.btnact=true;
      this.probar=true;
      //console.log("click verificación true");
    }else{
      this.btnact=false;
      //console.log("click verificación false");
    }
 
    
   }

  selectedDocentes(event: MatAutocompleteSelectedEvent): void {
      //Este evento se activa cuando el usuario selecciona una o varias materias
    this.seleccionadoMat=(event.option.viewValue);

    
   
//Si el vector obtenido de la consulta a la base de datos es mayor que cero se habilita la selección de materias
   if(this.seleccionadoMat.length>0){
    this.btnact=true;
   }else{
    this.btnact=false;
   }

  }

  selectedEstudiantes(event: MatAutocompleteSelectedEvent): void {
    //Este evento se activa cuando el usuario selecciona una o varias materias
    this.seleccionadoEst=(event.option.viewValue);
    
    if(this.datosdocente.length>0){
      this.loading=false;
      this.spinner=true;
    }
 
 

}

ValidateVideo(control: AbstractControl): {[key: string]: any} | null  {
  if (control.value && control.value.length != 10) {
    console.log("entrando ");
    return { 'phoneNumberInvalid': true };
  }
  return null;
}


  selected(event: MatAutocompleteSelectedEvent): void { 
      //Este evento se activa cuando el usuario selecciona una institución. A partir de que se obtiene la institución seleccionada
      //pór el usuario se realiza la consulta a la base de datos por los grados.
    this.seleccionado=(event.option.viewValue); //Obtiene el valor del input multiple
  
    this.loadingEst=true; //Carga y muestra el sppiner
    this.spinnerEst=false;
    
    this._adminService.getAll("Docente/queryname/"+this.seleccionado+"/").subscribe({next: data => {
      this.datosdocente = data.body;
      console.log(this.datosdocente);
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    
    this._adminService.getAll("Estudiante/queryname/"+this.seleccionado+"/").subscribe({next: data => {
      this.datosestudiante = data.body;
      console.log(this.datosestudiante);
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    
    
    //Espera un tiempo para obtener los grados y materias de la base de datos.
    setTimeout(() => {
      if(this.datosdba.length>0){
        this.showAlert=false;
        this.stateCtrldba.enable();
         console.log(this.datosdba.forEach(value=>(console.log(value))));
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

        
      }
      else{
        this.stateCtrldba.disable(); //Si no se obtiene nada de la base de datos se desabilita la opción de seleccionar un grado
        this.showAlert=true;
      
      }
      console.log(this.datosdocente);
      if(this.datosdocente.length>0){
        this.showAlertMat=false;
        this.stateCtrldocentes.enable();
        

       
  
     
      }
      else{
        this.stateCtrldocentes.disable(); //Si no se obtiene nada de la base de datos se desabilita la opción de seleccionar una materia
        this.showAlertMat=true;
      }

      if(this.datosestudiante.length>0){
        this.showAlertMat=false;
        this.stateCtrlestudiantes.enable();
        

       
  
     
      }
      else{
        this.stateCtrlestudiantes.disable(); //Si no se obtiene nada de la base de datos se desabilita la opción de seleccionar una materia
        this.showAlertMat=true;
      }
      this.loadingEst=false; 
      this.spinnerEst=true;

    },3000)
    
    
    
    
    
  }

  

  Ingresar(){
   //Cuando se presiona el botón ingresar
    /* Declaring variables and initializing them. */
    if(this.probar){
    let filterValueArray:any[]=[];
    let filterDBAArray:any[]=[];
    let filterMateriaArray:any[]=[];
    let filterDocentesArray:any[]=[];
    let filterEstudiantesArray:any[]=[];
    let datosdba:any[]=[];
    let datoslistaVideo:any[]=[];
    let datosestudiante:any[]=[];
    let datosdocente:any[]=[];
    let datosvideovisto:interfacevideovisto[]=[];
    let filtervalue:any="";
    let filtervaluedba:any="";
    let filtervaluedocente:any="";
    let filtervalueestudiante:any="";
    this.datosmateriatarea.length=0;
    this.docentenombre=[];
    this.estudiantenombre=[];
    this.dbanombre=[];

    //Se obtiene los valores del form group y se tratan como constantes
    const videolista = this.form.value;
    console.log(videolista);


    
  
    //Se convierte la fecha obtenida en el formato dispuesta aquí
    let fechaactual = new Date();
    const ConvertedDate = this.myDatepipe.transform(fechaactual, 'dd-MM-yyyy hh:mm a');
    
    //Se obtiene los arreglos de selección del usuario, el de institución que corresponde con stateCtrl es un string junto congrados 
    //en el caso de materia es un arreglo.
    filterValueArray = this.stateCtrl.value;
    filterDBAArray = this.stateCtrldba.value;
    filterDocentesArray = this.stateCtrldocentes.value;
    filterEstudiantesArray = this.stateCtrlestudiantes.value;

    
      
    /*for(let i=0;i<filterGradoArray.length;i++){
      filtervaluegrado=filterGradoArray[i];
    }

    for(let i=0;i<filterMateriaArray.length;i++){
      filtervaluemateria=filterMateriaArray[i];
    }*/
    let filterValue: string;
    let filterValuedba: string;
    let filterValuedocente: string;
    let filterValueestudiante: string;
    filtervalue= filterValueArray; 
    
    if(typeof filtervalue != 'string'){
    filterValue = filtervalue[0].toLowerCase(); //Se convierte a minuscula para hacer una comparación igualitaria.
    console.log(filterValue);
    }else{
      filterValue = filtervalue.toLowerCase(); 
    }
    //Se extrae el objeto que corresponde con el valor ingresado por el usuario.
    this.datosinstitucion=this.datosinstitucion.filter(state => state.nombre.toLowerCase().includes(filterValue));
    
   
    /*const filterValueMat = this.seleccionadoMat;
    this.datosmateria=this.datosmateria.filter(state => state.nombre.toLowerCase().includes(filterValueMat));*/

   
  

     for(let i=0;i<videolista.listaVideos.length;i++){
      datoslistaVideo.push(videolista.listaVideos[i].listaVideos);
     }

 
    

  
    filtervaluedba = filterDBAArray;
    if(typeof filtervaluedba != 'string'){
      filterValuedba = filtervaluedba[0].toLowerCase(); //Convierte el valor de grado a minusculas //Se convierte a minuscula para hacer una comparación igualitaria.
      }else{
       filterValuedba = filtervaluedba.toLowerCase(); //Convierte el valor de grado a minusculas
      }
   
    
     console.log(filterValuedba);
      
      //Realiza agregación del objeto que coincide con la busqueda del usuario.
      datosdba.push(this.datosdba.filter(state => state.identificador.toLowerCase().includes(filterValuedba)));

      
    
  
   
  //Como las materias son un arerglo realiza un recorrido para obtener todas las materias seleccionadas para el estudiante.
  filtervaluedocente = filterDocentesArray;
  if(typeof filtervaluedocente != 'string'){
    filterValuedocente = filtervaluedocente[0].toLowerCase(); //Convierte el valor de grado a minusculas //Se convierte a minuscula para hacer una comparación igualitaria.
    }else{
      filterValuedocente = filtervaluedocente.toLowerCase(); //Convierte el valor de grado a minusculas
    }
 
   console.log(this.datosdocente);
    
    //Realiza agregación del objeto que coincide con la busqueda del usuario.
    datosdocente.push(this.datosdocente.filter(state => state.nombre.toLowerCase().includes(filterValuedocente)));

    
     
    filtervalueestudiante = filterEstudiantesArray;
  if(typeof filtervalueestudiante != 'string'){
    filterValueestudiante = filtervalueestudiante[0].toLowerCase(); //Convierte el valor de grado a minusculas //Se convierte a minuscula para hacer una comparación igualitaria.
    }else{
      filterValueestudiante = filtervalueestudiante.toLowerCase(); //Convierte el valor de grado a minusculas
    }
  
  
      
      //Realiza agregación del objeto que coincide con la busqueda del usuario.
      datosestudiante.push(this.datosestudiante.filter(state => state.nombre.toLowerCase().includes(filterValueestudiante)));
  
       
    //Se obtiene el grado que seleccionaron para el estudiante.
    datosdba.slice().forEach(value=>(value.forEach((value: { id: string; identificador:string;})=>(this.dbanombre.push({
      identificador: value.identificador,
      id: '',
      materia: '',
      grado: '',
      dba: ''
    }),console.log(value.id)))));
   // this.datosgradotarea.slice().forEach(value=>(value.forEach((value: {   })=>(this.gradovalue.push(value.grado),console.log(value.grado)))));
   datosdocente.slice().forEach(value=>(value.forEach((value: { id: string; nombre:string;})=>(this.docentenombre.push({id:value.id,nombre:value.nombre}),console.log(value.id)))));
     //Se obtiene la o las materias seleccionadas para el estudiante.
     datosestudiante.slice().forEach(value=>(value.forEach((value: { id: string; nombre:string;})=>(this.estudiantenombre.push({id:value.id,nombre:value.nombre}),console.log(value.id)))));
   //this.datosmateria.slice().forEach(value=>(this.materiaid=value.id));
  
   //Se obtiene la institución seleccionada para el estudiante
   this.datosinstitucion.slice().forEach(value=>(this.institucionnombre=value.nombre,console.log(value.nombre)));
    this.datosinstitucion.slice().forEach(value=>(this.institucionid=value.id));

   

   
    if(this.data==null){ 
       //En el caos que sea un usuario nuevo se crea el objeto tareas de la siguiente forma
       this._adminService.getCustomRA("LV/queryverificar",'dba','estudiante','docente','institucion',this.stateCtrldba.value.toString(),this.stateCtrlestudiantes.value.toString(),this.stateCtrldocentes.value.toString(),this.stateCtrl.value.toString()).subscribe({next: data => {
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
       // console.log(this.verificar);
      if(this.verificar){
       this.activate=true;
      this._snackBar.open('La lista de videos ya se encuentra registrada',
      '', {horizontalPosition: 'center',
       verticalPosition: 'bottom',
       duration: 8000});

       this._snackBar.open('La lista de videos ya se encuentra registrada',
      '', {horizontalPosition: 'center',
       verticalPosition: 'top',
       duration: 8000});

       
       this.btnact=true;
      }
     
      if(!this.verificar){
        this.activate=false;
      const tarea:any={
        lv:[{
          fecha: ConvertedDate,
          dba:this.dbanombre[0].identificador,
          docente:[{id:this.docentenombre[0].id,nombre:this.docentenombre[0].nombre}],
          listaVideos:[]
        }
        ],
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

     

      for(let i=0;i<datoslistaVideo.length;i++){
        tarea.lv[0].listaVideos.push({video:datoslistaVideo[i]});
      }

     /* console.log(tarea);
      for(let i=0;i<datosvideovisto.length;i++){
        console.log(datosvideovisto[i]);
        tarea.dba.videovisto.push(datosvideovisto[i]);//Se añaden al objeto tarea la materia seleccionada por el estudiante.
      }*/

     console.log(tarea);
      //Se añade el objeto tarea a la petición post del servicio.
      const respuesta=this._adminService.create(tarea,"LV/addLV/").subscribe({next: data => {
      this.datos = data;
      console.log("create: "+this.datos);
  
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    //Se espera un tiempo hasta obtener la respuesta del servidor
    setTimeout(() => {
      //console.log(this.datos);
      if(this.datos.message=="success"){
        this._snackBar.open('Lista de videos creada con exito',
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

       console.log(this.docentenombre);
       let fechaactual = new Date();
       const ConvertedDate = this.myDatepipe.transform(fechaactual, 'dd-MM-yyyy hh:mm a');
      const tarea:any={
        id:this.data.id,
        lv:[{
          fecha: ConvertedDate,
          dba:this.dbanombre[0].identificador,
          docente:[{id:this.docentenombre[0].id,nombre:this.docentenombre[0].nombre}],
          listaVideos:[]
        }
        ],
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
      
      for(let i=0;i<datoslistaVideo.length;i++){
        tarea.lv[0].listaVideos.push({video:datoslistaVideo[i]});
      }
      console.log(tarea);
        const respuesta=this._adminService.update(this.data.id,tarea,"LV/lvUpdate/").subscribe({next: data => {
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
      this._snackBar.open('Lista de videos actualizada con exito',
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
    this.comprobar= true;
    this.router.navigate(['/admin/lv']);
    }
  }
    
  }

  //Estos metodos son invocados para realizar el filtrado del texto ingresado por el usuario en los campos input, cabe
  //recalcar que estos son solo apra institución,grado y materia, porqué se debe realizar un filtrado de la información
  //de acuerdo a la necesidad del usuario.

  private _filtrarinstitucion(value: string): interfaceinstitucion[] {
    console.log(value);
    const filterValue = value.toLowerCase();

    return this.datosinstitucion.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrardba(value: string): interfacedba[] {
    

    const filterValue = value.toLowerCase();
    console.log(filterValue);
    
    console.log(this.datosdba.filter(state => state.grado.toLowerCase().includes(filterValue)));
    return this.datosdba.filter(state => state.identificador.toLowerCase().includes(filterValue));
  }

  private _filtrarmateria(value: string): interfacemateria[] {
    const filterValue = value.toLowerCase();
    
    console.log(this.datosmateria.filter(state => state.nombre.toLowerCase().includes(filterValue)));
    return this.datosmateria.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrarestudiantes(value: string): interfacemateria[] {
    const filterValue = value[0].toLowerCase();
    
    console.log(this.datosestudiante.filter(state => state.nombre.toLowerCase().includes(filterValue)));
    return this.datosestudiante.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrardocentes(value: string): interfacemateria[] {
    console.log(value);
    const filterValue = value[0].toLowerCase();
    
    console.log(this.datosdocente.filter(state => state.nombre.toLowerCase().includes(filterValue)));
    return this.datosdocente.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }
  
  

}

//Se utilizan estos dos metodos finales para generar excepciones con el objeto tarea, si es el caso que sea necesario.
function tarea(tarea: any, arg1: string) {
  throw new Error('Function not implemented.');
}



function moment(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}




function $any(arg0: AbstractControl | null) {
  throw new Error('Function not implemented.');
}

