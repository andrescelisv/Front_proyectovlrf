import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { responseproyect } from '../../interfaces/response';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import {map, startWith} from 'rxjs/operators';
import {NEVER, Observable} from 'rxjs';
import { Body, Grado, Materia } from '../../interfaces/docentes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { interfaceestudiante, interfacedocente } from '../../lv/lv-dialog/lv-dialog.component';

interface comprobacion {
  comprobar : boolean;
}

//Interface que define los atributos del tipo institucion
export interface interfaceinstitucion {
  id:string;
  nombre: string;
  ubicacion: string;
}


//Interface que define los atributos del tipo grado
export interface interfacegrado {
  id:string,
  grado: string;
  jornada: string;
}


//Interface que define los atributos del tipo materia
export interface interfacemateria{
  id:string,
  nombre: string;
}


//Interface que define los atributos del tipo state
export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: 'app-comentarios-dialog',
  templateUrl: './comentarios-dialog.component.html',
  styleUrls: ['./comentarios-dialog.component.scss']
})
export class ComentariosDialogComponent {

  @Input() tareasEdit: any =[]; //Recibe de en event emitter procedente de tabla template
  form: FormGroup; //Contiene todos los inputs del formulario docente
  seleccionado:string=""; // valor del input institución
  seleccionadostr:any[]=[]; //valor del input grado
  seleccionadoMat:string=""; //Valor del input matería
  stateCtrl = new FormControl('',[Validators.required,Validators.minLength(1)]);  //Formulario de control de instituciones con validación y autocompletar 
  stateCtrlgrado = new FormControl('',[Validators.required,Validators.minLength(1)]); //Formulario de control de grado con validación y autocompletar
  stateCtrlmateria = new FormControl('',[Validators.required,Validators.minLength(1)]);//Formulario de control de materia con validación y autocompletar
  stateCtrlestudiantes = new FormControl('',[Validators.required,Validators.minLength(1)]); //Formulario de control de grado con validación y autocompletar
  stateCtrldocentes = new FormControl('',[Validators.required,Validators.minLength(1)]);
  select = new Date(0, 0, 0); //Creación de objeto fecha.
  comprobar=false; 
  filteredStates!: Observable<State[]>; 
  filtrarinstitucion!: Observable<interfaceinstitucion[]>;//Captura las peticiones get de institución y espera hasta obtener la respuesta asincrona por medio del observable
  filtrargrado!: Observable<interfacegrado[]>;//Captura las peticiones get de grado y espera hasta obtener la respuesta asincrona por medio del observable
  filtrarmateria!: Observable<interfacemateria[]>;//Captura las peticiones get de materia y espera hasta obtener la respuesta asincrona por medio del observable
  filtrarestudiantes!: Observable<interfaceestudiante[]>;
  filtrardocentes!: Observable<interfacedocente[]>;
  loading=false; // Carga un spinner en pantalla
  spinner=false; //Se utiliza en el div para gestionar la presencia o no de inputs.
  setins:interfaceinstitucion[]=[]; //Almacena los datos procedentes del table-consumer-add que corresponden con institución 
  setgra:interfacegrado[]=[];//Almacena los datos procedentes del table-consumer-add que corresponden con grado. 
  setmat:interfacemateria[]=[]; //Almacena los datos procedentes del table-consumer-add que corresponden con materia 
  setdoc:interfacedocente[]=[];//Almacena los datos procedentes del table-consumer-add que corresponden con grado. 
  setest:interfaceestudiante[]=[]; //Almacena los datos procedentes del table-consumer-add que corresponden con materia 
  selection:any[]=[];   //Contiene  un vector con los valores obtenidos de la base de datos para grado
  selectionmateria:any[]=[];//Contiene  un vector con los valores obtenidos de la base de datos para materia
  gradoid=""; //Almacena el id del grado que se esta trabajando
  gradovalue:any[]=[];  //Almacena el valor del grado
  materiaid=""; //Almacena el valor del id de matería 
  materianombre:any[]=[];  //Almacena el valor del nombre de la materia
  btnact=false;  //Activa el botón guardar una vez se cumple una condición, por defecto está en falso.
  institucionnombre:string="";  //Almacena el nombre de una institución
  institucionid:string=""; //Almacena el id de una institución
  showAlert:boolean=false;  //Muestra un mensaje toots con un mensaje de alerta.
  showAlertMat:boolean= false; //Muestra un mensaje toots con un mensaje de alerta.
  //Inicializa el objeto datos que contiene la estructura de la respuesta por parte del back.
  inicio:boolean=false;
  showAlertEst:boolean= false;
  showAlertDoc:boolean= false;
  datos: responseproyect={
    ok: true,
    message:" ",
    body: []
  };

  verificar:boolean=true;
  activate:boolean=false;
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
  
  datosgradotarea:any[]=[]; //Vector que almacena los grados seleccionado por el usuario para el docente.
  datosmateriatarea:any[]=[];  //Vector que almacena las materias seleccionadas por el usuario para el docente.
  //Inicializa el vector datosinstitución que es de tipo interfaceinstitucion
  datosinstitucion:interfaceinstitucion[]=[
    { id:"1",nombre: "Jardin los angeles",
  ubicacion:"" },

  ]
  datosgrado:interfacegrado[]=[]; //Vector que almacena los datos de grado para ser enviados al back
  datosmateria:interfacemateria[]=[]; //vector que alamcena los datos de materia para ser enviados al back
  datosestudiante:interfaceestudiante[]=[]; //Vector que almacena los datos de grado para ser enviados al back
  datosdocente:interfacedocente[]=[]; //vector que alamcena los datos de materia para ser enviados al back
  selectionest:any[]=[];
  selectiondoc:any[]=[];
  selectiongra:any[]=[];
  selectionmat:any[]=[];
  selectionins:any[]=[];

  estudiantenombre: any[]=[];
  docentenombre: any[]=[];
  gradonombre: any[]=[];
 
  
  errors:any;
  @Output() addUser: EventEmitter<comprobacion> = new EventEmitter();
  myDatepipe!: any;


  constructor(private fb:FormBuilder,private _adminService: AdminService,private _snackBar: MatSnackBar, private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any, datepipe: DatePipe
    ){ 
      const respuesta=this._adminService.getAll("institucion/all/").subscribe({next: data => {
        this.datosinstitucion = data.body;
        
        },
        error:error => {
        this.errors = error.message;
          console.error('There was an error!', this.errors);
        }
      }
      ); // Petición para obtener las instituciones almacenadas en la base de datos, cabe aclarar que de tipo observable por lo 
      //cuál se hace uso de las propiedades de rxjs para el manejo de errores, que está por encima de realizarlo mediante una promesa.
    this.myDatepipe = datepipe; // Es un pipe diseñado para el manejo personalizado de fechas.
    this.stateCtrlgrado.disable();  //Desabilita mostrar el input de grado.
    this.stateCtrlmateria.disable();//Desabilita mostrar el input de materia.
    this.form = new FormGroup({
      videourl: new FormControl('',[Validators.required,Validators.minLength(8),Validators.pattern('[A-Za-z \-\_]+')]), //validar el nombre con minimo de longitud y un patron sin cararectes especiales ni tildes.
      comentario:new FormControl('',[Validators.required,Validators.minLength(4), Validators.pattern('[A-Za-z \-\_]+')]), //Validación requerida y patrón con números
    })
   
    
   // console.log(this.data);

    //Si los datos son para agregar se utiliza está opción
    if(data==null){
      //this.select='Admin';
      this.verificacion();
    
      this.form.setValue({
        videourl:"",  //Inicializar el input de nombre
        comentario:""  //Inicializar el input de cedula
       
      
       

      });
      if(respuesta !=null){
         //Si la respuesta a la consulta de la instituciones resulta positiva, entonces se aplica un filtro que obtiene asincronicamente
         //de los valores ingresados por teclado en institución, de lo contrario el operador ternario hace su trabajo y obtiene de filtro
         //original.
        this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
        );
     
      
      
     
    }
    }else{
      //Esta condición se cumple cuando se desea editar los valores de institución
      this.stateCtrlgrado.enable(); //Habilita el poder seleccionar el grado
      this.stateCtrlmateria.enable(); //Habilita el poder seleccionar la materia
      this.stateCtrlestudiantes.enable(); //Habilita el poder seleccionar el grado
      this.stateCtrldocentes.enable();
      //this.btnact=true; //Activa el botón guardar
      this.spinner=true; // Habilita el cargador del spinner
      
      this.verificacion();
   
     
      
    this.form.setValue({
      videourl: data.videourl, //inicializa con el nombre dado anteriormente
      comentario:data.comentario[0].comentario //Inicializa con la cedula dada anteriormente
    });
    
    this.setins=data.institucion;  //Almacena el valor creado anteriormente de institución
    this.setgra=data.comentario[0].grado;   //Almacena el valor creado anteriormente de grado
    this.setmat=data.comentario[0].materia; //Almacena el valor creado anteriormente de materia
    this.setdoc=data.comentario[0].docente;   //Almacena el valor creado anteriormente de grado
    this.setest=data.comentario[0].estudiante;
     

    this.selectionest.push(this.setest[0].nombre);
    this.selectiondoc.push(this.setdoc[0].nombre);
    this.selectiongra.push(this.setgra[0].grado);
     this.selectionmat.push(this.setmat[0].nombre);
     this.selectionins.push(this.setins[0].nombre);
   

    //this.stateCtrl.setValue(this.setins.map(value => value.nombre)); 
    
    this.stateCtrl.setValue(this.setins[0].nombre);
    
    
    
    
    //Inicializa el input de institución, no obstante esta parte
    
    
    
    
    
    //no es del todo fija, sino que se realiza con un tipo two data binding, que contiene el ngModel dentro del input
      

    this.stateCtrldocentes.clearValidators();
     this.stateCtrldocentes.addValidators(Validators.required);
     this.stateCtrldocentes.addValidators(Validators.minLength(1));

     this.stateCtrlestudiantes.clearValidators();
     this.stateCtrlestudiantes.addValidators(Validators.required);
     this.stateCtrlestudiantes.addValidators(Validators.minLength(1));

     this.stateCtrlgrado.clearValidators();
     this.stateCtrlgrado.addValidators(Validators.required);
     this.stateCtrlgrado.addValidators(Validators.minLength(1));

     this.stateCtrlmateria.clearValidators();
     this.stateCtrlmateria.addValidators(Validators.required);
     this.stateCtrlmateria.addValidators(Validators.minLength(1));
    

    

    /* The above code is taking the values of the array and mapping them to a new array. */
   

   

    /*this.stateCtrl.setValue(this.setins.map(value => value.nombre));
    //this.stateCtrlgrado.setValue(this.setgra.map(value => value.grado));
    this.stateCtrlmateria.setValue(this.setmat.map(value => value.nombre));*/


    this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
    );

    
   /* Getting the data from the API and storing it in the variable datosgrado. */
   //Obtiene del back los grado asociados a la institución consultada.
    this._adminService.getAll("Grado/queryname/"+this.setins.map(value => value.nombre)+"/").subscribe({next: data => {
      this.datosgrado = data.body;
      //console.log(this.datosgrado);
      
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    //Obtiene del back las materias asociadas a la institución consultada.
    this._adminService.getAll("Materia/queryname/"+this.setins.map(value => value.nombre)+"/").subscribe({next: data => {
      this.datosmateria = data.body;
      
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );

    this._adminService.getAll("Docente/queryname/"+this.setins.map(value => value.nombre)+"/").subscribe({next: data => {
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
    this._adminService.getAll("Estudiante/queryname/"+this.setins.map(value => value.nombre)+"/").subscribe({next: data => {
      this.datosestudiante = data.body;
      //console.log(this.datosestudiante);
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
     //Filtra la busqueda de los grados ingresados por el usuario
     setTimeout(() => {

      this.verificacion();
    this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice())),
    );
 //Filtra la busqueda de las materias ingresadas por el usuario
    this.filtrarmateria = this.stateCtrlmateria.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarmateria(state) : this.datosmateria.slice())),
    );

    this.filtrardocentes = this.stateCtrldocentes.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrardocentes(state) : this.datosdocente.slice(0,4))),
    );
    this.filtrarestudiantes = this.stateCtrlestudiantes.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarestudiantes(state) : this.datosestudiante.slice(0,4))),
    );
    //Habilita el botón de guardar.
    if(this.datosdocente.length>0 && this.datosestudiante.length>0 &&this.datosgrado.length>0  && this.datosmateria.length>0 && this.stateCtrlgrado.value.length>0 && this.stateCtrlmateria.value.length>0 && this.stateCtrldocentes.value.length>0 && this.stateCtrlestudiantes.value.length>0 ){
      this.btnact=true;
    }

    this.datosdocente.length>0 ? "" : (this.showAlertDoc=true, this.stateCtrldocentes.disable());
    this.datosgrado.length>0 ? "" : (this.showAlert=true, this.stateCtrlgrado.disable());
    this.datosestudiante.length>0 ? "" : (this.showAlertEst=true, this.stateCtrlestudiantes.disable());
    this.datosmateria.length>0 ? "" : (this.showAlertMat=true, this.stateCtrlmateria.disable());

     },2000);
  }
  }

  

  selectedgrado(event: MatAutocompleteSelectedEvent): void {
    if(this.stateCtrlestudiantes.value.length>0 && this.stateCtrlgrado.value.length>0 && this.stateCtrlmateria.value.length>0){
      this.btnact=true;
     }else{
      this.btnact=false;
     }
   
    

  }

  selectedEstudiantes(event: MatAutocompleteSelectedEvent): void {
    //this.seleccionadostr=(event.option.viewValue);
    if(this.stateCtrlestudiantes.value.length>0 && this.stateCtrlgrado.value.length>0 && this.stateCtrlmateria.value.length>0){
      this.btnact=true;
     }else{
      this.btnact=false;
     }
   
    

  }

  
  selectedDocentes(event: MatAutocompleteSelectedEvent): void {
    //this.seleccionadostr=(event.option.viewValue);
    //console.log(this.seleccionadostr);

    if(this.stateCtrlestudiantes.value.length>0 && this.stateCtrlgrado.value.length>0 && this.stateCtrlmateria.value.length>0){
      this.btnact=true;
     }else{
      this.btnact=false;
     }
   
    

  }

  selectedmateria(event: MatAutocompleteSelectedEvent): void {
    //this.seleccionadostr=(event.option.viewValue);
    if(this.stateCtrlestudiantes.value.length>0 && this.stateCtrlgrado.value.length>0 && this.stateCtrlmateria.value.length>0){
      this.btnact=true;
     }else{
      this.btnact=false;
     }
   
    

  }
    
  /**
   * A function that is called when the button is clicked.
   */
  clickedOption(){
     this.btnact=true;
  }

  /**
   * 
   */
  /**
   * A function that is called when the user clicks on the option of the subject.
   */
  clickedOptionMateria(){   
      this.btnact=true;
   }
   //Almacena la selección del input materia
  selectedMateria(event: MatAutocompleteSelectedEvent): void {
    this.seleccionadoMat=(event.option.viewValue);
    //console.log("seleccionado str: "+this.seleccionadoMat);

   if(this.seleccionadoMat.length>0){
    this.btnact=true;
   }else{
    this.btnact=false;
   }
   
    

  }
  //Almacena la selección del input grado
  selected(event: MatAutocompleteSelectedEvent): void {
    this.seleccionado=(event.option.viewValue);
    this.loading=true;  
    this.spinner=false;
    /* Calling the getAll method of the adminService and passing the url to the method. */
    //Obtiene los grados asociados a la institución, esto con el fin de qué el usuario presione una institución y se carguen los 
    //grados asociados a la institución.
    this._adminService.getAll("Grado/queryname/"+this.seleccionado+"/").subscribe({next: data => {
      this.datosgrado=data.body;
      
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
//Obtiene las materias asociadas a la institución, esto con el fin de qué el usuario presione una institución y se carguen las 
    //materias asociadas a la institución.
    this._adminService.getAll("Materia/queryname/"+this.seleccionado+"/").subscribe({next: data => {
      this.datosmateria = data.body;
      
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    
    );
    
    this._adminService.getAll("Docente/queryname/"+this.seleccionado+"/").subscribe({next: data => {
      this.datosdocente = data.body;
   
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    //Obtiene las materias asociadas a una institución
    this._adminService.getAll("Estudiante/queryname/"+this.seleccionado+"/").subscribe({next: data => {
      this.datosestudiante = data.body;
     
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );

    
   
   //Espera un tiempo mientras se carga la respuesta al back, porqué la tarea es asincrona. 
    setTimeout(() => {

      this.loading=false; // Habilita la carga del spinner
      this.spinner=true;  //Muesta los campos alojados en etiquita de división del html <div ngIf>></div>

      this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice())),
      );
   //Filtra la busqueda de las materias ingresadas por el usuario
      this.filtrarmateria = this.stateCtrlmateria.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this._filtrarmateria(state) : this.datosmateria.slice())),
      );

      this.filtrardocentes = this.stateCtrldocentes.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this._filtrardocentes(state) : this.datosdocente.slice(0,4))),
      );
      this.filtrarestudiantes = this.stateCtrlestudiantes.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this._filtrarestudiantes(state) : this.datosestudiante.slice(0,4))),
      );
      
      if(this.datosgrado.length>0){
        //Si la cantidad de datos que llegan son mayores que 0 entones se habilita el campo para ingresar los grados.
        this.showAlert=false;
        this.stateCtrlgrado.enable();
        //console.log("filtrargrado"+this.filtrargrado.forEach(value=>console.log(value)));
        
      }
      else{
        //Si la cantidad de datos que llegan son menores que 0 entones se deshabilita el campo para ingresar los grados.
        this.stateCtrlgrado.disable();
        this.showAlert=true;
      
      }

      if(this.datosmateria.length>0){
        //Si la cantidad de datos de materia que llegan son mayores que 0 entones se habilita el campo para ingresar las materias.
        //console.table("datos materia: "+this.datosmateria.forEach(value=>console.log(value)));
        this.showAlertMat=false; // Se quita la alerta
        this.stateCtrlmateria.enable(); // Se habilita el input de materia.
        

      
      }
      else{
        this.stateCtrlmateria.disable(); //Se desabilita el campo de ingresar materia
        this.showAlertMat=true; 
      }
      this.loading=false;
      this.spinner=true;

    },3000) // Se esperan 3 segundos hasta la carga de grados y materias.
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
        && this.datosinstitucion.length>0 && this.datosestudiante.length>0 && this.datosdocente.length>0 && this.datosgrado.length>0 && this.datosmateria.length>0 &&
        (this.probarclick && this.probarclickest && this.probarclickdoc && this.probarclickgra && this.probarclickmat)
        
        
        ){
        this.btnact=true;
        this.probar=true;
        //console.log("click verificación true");
      }else{
        this.btnact=false;
       
      }
      this.inicio=true;
   }
  
  

   Ingresar(){
   if(this.probar){
//Estos son los parametros originales
    /*
    let filterValueArray:any[]=[];
    let filterDBAArray:any[]=[];
    let filterMateriaArray:any[]=[];
    let filterGradoArray:any[]=[];
    let filterDocentesArray:any[]=[];
    let filterEstudiantesArray:any[]=[];
*/

    let filterValueArray:String;
    let filterDBAArray:String
    let filterMateriaArray:String;
    let filterGradoArray:String;
    let filterDocentesArray:String;
    let filterEstudiantesArray:String;




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

    //Se obtiene los valores del form group y se tratan como constantes
    const videovistostr = this.form.value.videovisto;
    
  
    //Se convierte la fecha obtenida en el formato dispuesta aquí
    let fechaactual = new Date();
    const ConvertedDate = this.myDatepipe.transform(fechaactual, 'dd-MM-yyyy hh:mm a');
    
    //Se obtiene los arreglos de selección del usuario, el de institución que corresponde con stateCtrl es un string junto congrados 
    //en el caso de materia es un arreglo.
    filterValueArray = this.stateCtrl.value;
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
  
    filtervalue= filterValueArray; 
    
    if(typeof filtervalue != 'string'){
    filterValue = filtervalue[0].toLowerCase(); //Se convierte a minuscula para hacer una comparación igualitaria.
   
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

   
         
   
    
       //Se obtiene la o las materias seleccionadas para el estudiante.
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
     
       filtervaluegrado = filterGradoArray;
       if(typeof filtervaluegrado != 'string'){
         filterValuegrado = filtervaluegrado[0].toLowerCase(); //Convierte el valor de grado a minusculas //Se convierte a minuscula para hacer una comparación igualitaria.
         }else{
           filterValuegrado = filtervaluegrado.toLowerCase(); //Convierte el valor de grado a minusculas
         }
       
       
           
           //Realiza agregación del objeto que coincide con la busqueda del usuario.
           datosgrado.push(this.datosgrado.filter(state => state.grado.toLowerCase().includes(filterValuegrado)));
       
            
      
       
          //Se obtiene la o las materias seleccionadas para el estudiante.
          datosgrado.slice().forEach(value=>(value.forEach((value: { id: string; grado:string;})=>(this.gradonombre.push({id:value.id,grado:value.grado})))));
        //this.datosmateria.slice().forEach(value=>(this.materiaid=value.id));
     
    
     
       //this.datosmateria.slice().forEach(value=>(this.materiaid=value.id));
   //Se obtiene la institución seleccionada para el estudiante
   this.datosinstitucion.slice().forEach(value=>(this.institucionnombre=value.nombre,console.log(value.nombre)));
    this.datosinstitucion.slice().forEach(value=>(this.institucionid=value.id));
   
  //Si los datos son nulos.
   
    // Se crea el objeto tareas.
    if(this.data==null){ 
      this._adminService.getCustomRA("comentario/queryestudianteComentario",'nombreestudiante','nombremateria','grado','nombredocente',this.stateCtrlestudiantes.value,this.stateCtrlmateria.value,this.stateCtrlgrado.value,this.stateCtrldocentes.value).subscribe({next: data => {
        this.verificar = data.body;
        
        },
        error:error => {
        this.errors = error.message;
          console.error('There was an error!', this.errors);
        }
      }
      );
      if(this.verificar){
       
        this._snackBar.open('Espere un momento por favor',
        '', {horizontalPosition: 'center',
         verticalPosition: 'bottom',
         duration: 8000});
         this.btnact=false;
  
       }
      
      setTimeout(() => {
        
      if(this.verificar){
       this.activate=true;
      this._snackBar.open('Los comentarios ya se encuentran registrados',
      '', {horizontalPosition: 'center',
       verticalPosition: 'bottom',
       duration: 8000});

       this._snackBar.open('Los comentarios ya se encuentran registrados',
      '', {horizontalPosition: 'center',
       verticalPosition: 'top',
       duration: 8000});

       
       this.btnact=true;
      }
     
      if(!this.verificar){
       
      const tarea:any={
        videourl:this.form.value.videourl,
        comentario:[{
          comentario:this.form.value.comentario,
          grado: [],  // Arrays dentro del objeto
          materia:[], // Arrays dentro del objeto
          estudiante:[],
          docente: [],
          fecha: ConvertedDate
        }],
        
        
        institucion: [{id:this.institucionid, nombre:this.institucionnombre}]
        
        //grado= this.datosgrado
      }
      for(let i=0;i<this.gradonombre.length;i++){
        tarea.comentario[0].grado.push(this.gradonombre[i]);  // Ingresa al array el valor de grado que coíncidio con el filtro de busqueda
      }

      for(let i=0;i<this.materianombre.length;i++){
        tarea.comentario[0].materia.push(this.materianombre[i]); // Ingresa al array el valor de grado que coíncidio con el filtro de busqueda
      }

      for(let i=0;i<this.estudiantenombre.length;i++){
        tarea.comentario[0].estudiante.push(this.estudiantenombre[i]); // Ingresa al array el valor de grado que coíncidio con el filtro de busqueda
      }

      for(let i=0;i<this.docentenombre.length;i++){
        tarea.comentario[0].docente.push(this.docentenombre[i]); // Ingresa al array el valor de grado que coíncidio con el filtro de busqueda
      }
    
      
     
      const respuesta=this._adminService.create(tarea,"comentario/addCOMENTARIO/").subscribe({next: data => {
      this.datos = data;
     
  
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );

     //Genera un toost tanto para si el docente fue creado como sino.
     setTimeout(() => {
     
      if(this.datos.message=="success"){
        this._snackBar.open('Comentario agregado con exito',
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

      const tarea:any={
        id:this.data.id,
        videourl:this.form.value.videourl,
        comentario:[{
          comentario:this.form.value.comentario,
          grado: [],  // Arrays dentro del objeto
          materia:[], // Arrays dentro del objeto
          estudiante:[],
          docente: [],
          fecha: ConvertedDate
        }],
        
        
        institucion: [{id:this.institucionid, nombre:this.institucionnombre}]       
      }
      for(let i=0;i<this.gradonombre.length;i++){
        tarea.comentario[0].grado.push(this.gradonombre[i]);  // Ingresa al array el valor de grado que coíncidio con el filtro de busqueda
      }

      for(let i=0;i<this.materianombre.length;i++){
        tarea.comentario[0].materia.push(this.materianombre[i]); // Ingresa al array el valor de grado que coíncidio con el filtro de busqueda
      }

      for(let i=0;i<this.estudiantenombre.length;i++){
        tarea.comentario[0].estudiante.push(this.estudiantenombre[i]); // Ingresa al array el valor de grado que coíncidio con el filtro de busqueda
      }

      for(let i=0;i<this.docentenombre.length;i++){
        tarea.comentario[0].docente.push(this.docentenombre[i]); // Ingresa al array el valor de grado que coíncidio con el filtro de busqueda
      }
      
      
       /* The above code is updating the data in the database. */
       //Actualiza el valor de docente en el caso de que este editando algún valor del docente.
        const respuesta=this._adminService.update(this.data.id,tarea,"comentario/COMENTARIOUpdate/").subscribe({next: data => {
        this.datos = data;
    //console.log(this.datos);
        },
        error:error => {
        this.errors = error.message;
          console.error('There was an error!', this.errors);
        }
      }
      );
   //Genera un toost tanto para si el docente fue creado como sino.
    if(this.datos.ok==true){
      this._snackBar.open('Comentario actualizado con exito',
      '', {horizontalPosition: 'center',
       verticalPosition: 'bottom',
       duration: 5000});
       this.btnact=false;
    }else{
      this._snackBar.open('Datos erroneos',
      '', {horizontalPosition: 'center',
       verticalPosition: 'bottom',
       duration: 5000});

       this.btnact=true;
    }
    this.comprobar= true;
    this.router.navigate(['/admin/comentario']);
    }
  }
    
  }
 

  //Realiza el filtrado de la información ingresada por el usuario para institución
  private _filtrarinstitucion(value: string): interfaceinstitucion[] {
    const filterValue = value.toLowerCase();

    return this.datosinstitucion.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }
//Realiza el filtrado de la información ingresada por el usuario para grado
  private _filtrargrado(value: string): interfacegrado[] {
    const filterValue = value.toLowerCase();
    
   
    return this.datosgrado.filter(state => state.grado.toLowerCase().includes(filterValue));
  }
//Realiza el filtrado de la información ingresada por el usuario para materia
  private _filtrarmateria(value: string): interfacemateria[] {
    const filterValue = value.toLowerCase();
    
    
    return this.datosmateria.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrarestudiantes(value: string): interfaceestudiante[] {
    const filterValue = value.toLowerCase();
    
   
    return this.datosestudiante.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrardocentes(value: string): interfacedocente[] {
    const filterValue = value.toLowerCase();
    
   
    return this.datosdocente.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }
 

 

}
