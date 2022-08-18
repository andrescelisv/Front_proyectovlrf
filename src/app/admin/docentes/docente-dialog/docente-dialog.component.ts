/**
 * 
 * @param {any} tarea - the task object
 * @param {string} arg1 - The first argument to the function.
 */

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
  selector: 'app-docente-dialog',
  templateUrl: './docente-dialog.component.html',
  styleUrls: ['./docente-dialog.component.scss']
})
export class DocenteDialogComponent {

  @Input() tareasEdit: any =[]; //Recibe de en event emitter procedente de tabla template
  form: FormGroup; //Contiene todos los inputs del formulario docente
  seleccionado:string=""; // valor del input institución
  seleccionadostr:any[]=[]; //valor del input grado
  seleccionadoMat:string=""; //Valor del input matería
  stateCtrl = new FormControl('',[Validators.required,Validators.minLength(1)]);  //Formulario de control de instituciones con validación y autocompletar 
  stateCtrlgrado = new FormControl('',[Validators.required,Validators.minLength(1)]); //Formulario de control de grado con validación y autocompletar
  stateCtrlmateria = new FormControl('',[Validators.required,Validators.minLength(1)]);//Formulario de control de materia con validación y autocompletar
  select = new Date(0, 0, 0); //Creación de objeto fecha.
  comprobar=false; 
  filteredStates!: Observable<State[]>; 
  filtrarinstitucion!: Observable<interfaceinstitucion[]>;//Captura las peticiones get de institución y espera hasta obtener la respuesta asincrona por medio del observable
  filtrargrado!: Observable<interfacegrado[]>;//Captura las peticiones get de grado y espera hasta obtener la respuesta asincrona por medio del observable
  filtrarmateria!: Observable<interfacemateria[]>;//Captura las peticiones get de materia y espera hasta obtener la respuesta asincrona por medio del observable
  loading=false; // Carga un spinner en pantalla
  spinner=false; //Se utiliza en el div para gestionar la presencia o no de inputs.
  setins:interfaceinstitucion[]=[]; //Almacena los datos procedentes del table-consumer-add que corresponden con institución 
  setgra:interfacegrado[]=[];//Almacena los datos procedentes del table-consumer-add que corresponden con grado. 
  setmat:interfacemateria[]=[]; //Almacena los datos procedentes del table-consumer-add que corresponden con materia 
  selection:any[]=[];   //Contiene  un vector con los valores obtenidos de la base de datos para grado
  selectionins:any[]=[];
  selectiongra:any[]=[];
  selectionmat:any[]=[];
  selectionmateria:any[]=[];//Contiene  un vector con los valores obtenidos de la base de datos para materia
  gradoid=""; //Almacena el id del grado que se esta trabajando
  gradovalue:any[]=[];  //Almacena el valor del grado
  materiaid=""; //Almacena el valor del id de matería 
  materianombre:any[]=[];  //Almacena el valor del nombre de la materia
  btnact=false;  //Activa el botón guardar una vez se cumple una condición, por defecto está en falso.
  allow=false;
  institucionnombre:string="";  //Almacena el nombre de una institución
  institucionid:string=""; //Almacena el id de una institución
  showAlert:boolean=false;  //Muestra un mensaje toots con un mensaje de alerta.
  showAlertgra:boolean= false;
  showAlertMat:boolean= false; //Muestra un mensaje toots con un mensaje de alerta.
  //Inicializa el objeto datos que contiene la estructura de la respuesta por parte del back.
  varnombre:string="";
  verificar:boolean=true;
  activate:boolean=false;
  datos: responseproyect={
    ok: true,
    message:" ",
    body: []
  };
  probar:boolean=false;
  probarclick:boolean=false;
  compclick:boolean=false;
  compclickgrado:boolean=false;
  probarclickgrado:boolean=false;
  palabrasstr!:string;
  datosgradotarea:any[]=[]; //Vector que almacena los grados seleccionado por el usuario para el docente.
  datosmateriatarea:any[]=[];  //Vector que almacena las materias seleccionadas por el usuario para el docente.
  //Inicializa el vector datosinstitución que es de tipo interfaceinstitucion
  datosinstitucion:interfaceinstitucion[]=[
    { id:"1",nombre: "Jardin los angeles",
  ubicacion:"" },

  ]
  datosgrado:interfacegrado[]=[]; //Vector que almacena los datos de grado para ser enviados al back
  datosmateria:interfacemateria[]=[]; //vector que alamcena los datos de materia para ser enviados al back
 
  
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
      nombre: new FormControl('',[Validators.required,Validators.minLength(10),Validators.pattern('[A-Za-z \-\_]+')]), //validar el nombre con minimo de longitud y un patron sin cararectes especiales ni tildes.
      cedula:new FormControl('',[Validators.required,Validators.minLength(8), Validators.pattern("^[0-9]*$")]), //Validación requerida y patrón con números
      fechaNacimiento: new FormControl('',[Validators.required]), //validador requerido
      correoElectronico:new FormControl('',[Validators.required,Validators.email]), //validador de email
    })
   
    
    console.log(this.data);

    //Si los datos son para agregar se utiliza está opción
    if(data==null){
      //this.select='Admin';
    
      this.form.setValue({
        nombre:"",  //Inicializar el input de nombre
        cedula:"",  //Inicializar el input de cedula
        fechaNacimiento:"",  //Inicializar el input de fecha de nacimiento
        correoElectronico:"", //Inicializar el input de correo electrónico
      
       

      });
      if(respuesta !=null){
         //Si la respuesta a la consulta de la instituciones resulta positiva, entonces se aplica un filtro que obtiene asincronicamente
         //de los valores ingresados por teclado en institución, de lo contrario el operador ternario hace su trabajo y obtiene de filtro
         //original.
        this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
        );

        
        

        this.form.controls['nombre'].setValue(this.valor());

     
      
      
      
      

     
        
     
    }
    }else{
      //Esta condición se cumple cuando se desea editar los valores de institución
      this.stateCtrlgrado.enable(); //Habilita el poder seleccionar el grado
      this.stateCtrlmateria.enable(); //Habilita el poder seleccionar la materia
      this.btnact=true; //Activa el botón guardar
      this.spinner=true; // Habilita el cargador del spinner
      
      var re = /-/gi;  //Indica que busque el separador "-"
  
    // Use of String replace() Method
    var newstr = data.fechaNacimiento.replace(re, "/");  // Reemplaza el "/"" con el "-" 
      
     
    const [day,month, year] =newstr.split('/');  //Formato dia, mes y año

    
    const date = new Date(+year, +month - 1, +day); // creo un objeto de tipo fecha con el año, mes y dia.
   
      //this.select= new Date(Number(year),Number(month),Number(day));

      this.select= date; // En el campo input tipo date, inicializa el valor con el opbjeto creado anteriormente
      
    this.form.setValue({
      nombre: data.nombre, //inicializa con el nombre dado anteriormente
      cedula:data.cedula, //Inicializa con la cedula dada anteriormente
      fechaNacimiento:date, // Inicializa con la fecha dada anteriormente
      correoElectronico:data.correoElectronico  // Inicializa con el correo electrónico ingresado anteriormente.
    });
    
    this.setins=data.institucion;  //Almacena el valor creado anteriormente de institución
    this.setgra=data.grado;   //Almacena el valor creado anteriormente de grado
    this.setmat=data.materia; //Almacena el valor creado anteriormente de materia

    this.stateCtrl.setValue(this.setins.map(value => value.nombre)); // Ingresa el o los valores creados para institución

    this.setgra.forEach(value=>console.log("value: "+value));  //Ingresa el o los valores creados para grado.
    
    this.setgra.map(value=>console.log(value));  
    //const valor=['3','11']
    const valor=this.setgra.slice().map(value=>(value.grado)); 
    this.selectiongra= valor;  

    

    /* The above code is taking the values of the array and mapping them to a new array. */
    const valormat=this.setmat.slice().map(value=>(value.nombre)); //Ingresa los valores almacenados en el vector materias
 
    this.selectionmateria= valormat; //Coloca en el input los valores de materias.

    this.selectionins.push(this.setins[0].nombre);
    this.stateCtrl.clearValidators();
    this.stateCtrl.addValidators(Validators.required);
    /*this.stateCtrl.setValue(this.setins.map(value => value.nombre));
    //this.stateCtrlgrado.setValue(this.setgra.map(value => value.grado));
    this.stateCtrlmateria.setValue(this.setmat.map(value => value.nombre));*/

   this.varnombre=data.nombre;


   this.form.controls['nombre'].setValue(this.valor());

    this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
    );

    
   /* Getting the data from the API and storing it in the variable datosgrado. */
   //Obtiene del back los grado asociados a la institución consultada.
    this._adminService.getAll("Grado/queryname/"+this.setins.map(value => value.nombre)+"/").subscribe({next: data => {
      this.datosgrado = data.body;
      console.log(this.datosgrado);
      
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
    setTimeout(() => {

      this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
      );

    this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice())),
    );
 
    //Filtra las materias por un criterio de busqueda ingresado en el input. Este seleeciona varias materias.
    this.filtrarmateria = this.stateCtrlmateria.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarmateria(state) : this.datosmateria.slice())),
    );

    

     if(this.datosinstitucion.length>0 && this.datosgrado.length>0  && this.datosmateria.length>0 && this.stateCtrlgrado.value.length>0 && this.stateCtrlmateria.value.length>0 && this.stateCtrl.value.length>0){
      //console.log("click if de data diferente de null true");
      this.btnact=true;
    }
     
    this.datosinstitucion.length>0 ? "" : (this.showAlert=true, this.stateCtrl.disable());
    this.datosgrado.length>0 ? "" : (this.showAlertgra=true, this.stateCtrlgrado.disable());
      this.datosmateria.length>0 ? "" : (this.showAlertMat=true, this.stateCtrlmateria.disable());

     },2000);

    
  }
  }

  

  selectedgrado(event: MatAutocompleteSelectedEvent): void {
    //this.seleccionadostr=(event.option.viewValue);
    if(this.stateCtrl.value.length>0 && this.stateCtrlgrado.value.length>0 && this.stateCtrlmateria.value.length>0){
      this.btnact=true;
     }else{
      this.btnact=false;
     }
   
    

  }
    
  /**
   * A function that is called when the button is clicked.
   */
  clickedOption(){
    if(this.stateCtrl.value.length>0 && this.stateCtrlgrado.value.length>0 && this.stateCtrlmateria.value.length>0){
      this.btnact=true;
     }else{
      this.btnact=false;
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

  /**
   * 
   */
  /**
   * A function that is called when the user clicks on the option of the subject.
   */
  clickedOptionMateria(){   
    if(this.stateCtrl.value.length>0 && this.stateCtrlgrado.value.length>0 && this.stateCtrlmateria.value.length>0){
    
      this.btnact=true;
      //console.log("click materia true");
     }else{
      //console.log("click materia false");
      this.btnact=false;
     }
   }
   //Almacena la selección del input materia
  selectedMateria(event: MatAutocompleteSelectedEvent): void {
    this.seleccionadoMat=(event.option.viewValue);
    if(this.stateCtrl.value.length>0 && this.stateCtrlgrado.value.length>0 && this.stateCtrlmateria.value.length>0){
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
      console.table(data.body);
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
    
    
   
   //Espera un tiempo mientras se carga la respuesta al back, porqué la tarea es asincrona. 
    setTimeout(() => {

      this.loading=false; // Habilita la carga del spinner
      this.spinner=true;  //Muesta los campos alojados en etiquita de división del html <div ngIf>></div>
      
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
        console.table("datos materia: "+this.datosmateria.forEach(value=>console.log(value)));
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
    //console.log(this.selectionins);
    //console.log(this.selectiongra);
    //console.log(this.stateCtrlmateria.value);
    this.datosinstitucion.forEach(state=>( state.nombre.trim().toLowerCase() === this.selectionins.toString().trim().toLowerCase() ? (this.compclick=true):"") );
    this.datosgrado.forEach(state=> (state.grado.trim().toLowerCase() === this.selectiongra.toString().trim().toLowerCase() ?(this.compclickgrado=true) : ""));
    if(this.compclick){this.probarclick=true}else{this.probarclick=false};
    if(this.compclickgrado){this.probarclickgrado=true}else{this.probarclickgrado=false};
    
    this.compclick=false;
    this.compclickgrado=false;
    if(this.selectionins.length>0 && this.selectiongra.length>0 && this.stateCtrlmateria.value.length>0 && this.datosmateria.length>0 && this.datosgrado.length>0 && this.datosinstitucion.length>0 && this.probarclick){
      this.btnact=true;
      //console.log("click verificación true");
    }else{
      this.btnact=false;
      //console.log("click verificación false");
    }
   }

   
  

   Ingresar(){
   
    let filterValueArray:any[]=[];  // Se inicializa un arreglo vacio
    let filterGradoArray:any[]=[];// Se inicializa un arreglo vacio
    let filterMateriaArray:any[]=[];// Se inicializa un arreglo vacio
    let datosgrado:any[]=[]; // Se inicializa un arreglo vacio
    let filterValue: string;
    let filtervalue:any=""; //string que va a conter el valor ingresado por el usuario en institución
   

   
   
    this.datosmateriatarea.length=0; //Se reinicializa el valor global.
    this.gradovalue=[];  //El vector se pone vacio
    this.materianombre=[];//El vector se pone vacio
    const nombre = this.form.value.nombre; //Se obtiene el valor que contiene el campo nombre en el dialog.
    const cedula = this.form.value.cedula; //Se obtiene el valor que contiene el campo cedula en el dialog.
    const fechaNacimiento = this.form.value.fechaNacimiento; //Se obtiene el valor que contiene el campo fecha de nacimiento en el dialog.
    const correoElectronico = this.form.value.correoElectronico;   //Se obtiene el valor que contiene el correo electronico en el dialog.
    
    // lo anterior es igual tanto para crear un nuevo docente como para editar un docente, sea cual sea la forma se extraen de los
    //mismos inputs.
   /* Filtering the data in the table. */
    filterValueArray = this.stateCtrl.value; //Obtiene el valor ingresado por el usuario en el campo institución
    filterGradoArray = this.stateCtrlgrado.value;//Obtiene el valor ingresado por el usuario en el campo grado
    console.log(filterGradoArray);
    filterMateriaArray = this.stateCtrlmateria.value; //Obtiene el valor ingresado por el usuario en el campo materia

    

    /*for(let i=0;i<filterGradoArray.length;i++){
      filtervaluegrado=filterGradoArray[i];
    }

    for(let i=0;i<filterMateriaArray.length;i++){
      filtervaluemateria=filterMateriaArray[i];
    }*/
     
    //Obtiene un vector con los valores ingresados para institución
    
    filtervalue= filterValueArray; 
    
    if(typeof filtervalue != 'string'){
    filterValue = filtervalue[0].toLowerCase(); //Se convierte a minuscula para hacer una comparación igualitaria.
   
    }else{
      filterValue = filtervalue.toLowerCase(); 
    }
    //Se extrae el objeto que corresponde con el valor ingresado por el usuario.
    this.datosinstitucion=this.datosinstitucion.filter(state => state.nombre.toLowerCase().includes(filterValue)); //Almacena el vector
    // con los valores coincidentes de la busqueda de institución.
    
   
    /*const filterValueMat = this.seleccionadoMat;
    this.datosmateria=this.datosmateria.filter(state => state.nombre.toLowerCase().includes(filterValueMat));*/

    
  
   /* Filtering the data by the grade. */
   //Recorre el vector y va almacenando los campos que coíndicen con los grados seleccionados.
    for(let i=0;i<filterGradoArray.length;i++){
     
      datosgrado.push(this.datosgrado.filter(state => state.grado.includes(filterGradoArray[i])));
    }

    
   
//Recorre el vector y va almacenando los campos que coíndicen con las materias seleccionadas.
    for(let i=0;i<filterMateriaArray.length;i++){
      
      this.datosmateriatarea.push(this.datosmateria.filter(state => state.nombre.includes(filterMateriaArray[i])));
  
    }
    
    const ConvertedDate = this.myDatepipe.transform(fechaNacimiento, 'dd-MM-yyyy');
    
   
//Extrae los valores de id y grado del vector de datos, que es arreglo de arreglo, por esta razón se utiliza el forEach y después otro ForEach
    datosgrado.slice().forEach(value=>(value.forEach((value: { id: string; grado:string;})=>(this.gradovalue.push({id:value.id,grado:value.grado}),console.log(value.id)))));
   // this.datosgradotarea.slice().forEach(value=>(value.forEach((value: {   })=>(this.gradovalue.push(value.grado),console.log(value.grado)))));
   
   //Extrae los valores de id y nombredel vector de datos de materia, que es arreglo de arreglo, por esta razón se utiliza el forEach y después otro ForEach
   this.datosmateriatarea.slice().forEach(value=>(value.forEach((value: { id: string; nombre:string;})=>(this.materianombre.push({id:value.id,nombre:value.nombre}),console.log(value.id))))); 
   //this.datosmateria.slice().forEach(value=>(this.materiaid=value.id));

   //Extrae los valores de id y nombre del vector de datos de institución
    this.datosinstitucion.slice().forEach(value=>(this.institucionnombre=value.nombre,console.log(value.id)));
    this.datosinstitucion.slice().forEach(value=>(this.institucionid=value.id));

  //Si los datos son nulos.
   
    // Se crea el objeto tareas.
    if(this.data==null){ 
      this._adminService.getCustom("docente/querynombreandcedula",'nombre','cedula',this.form.value.nombre,this.form.value.cedula).subscribe({next: data => {
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
        console.log(this.verificar);
       if(this.verificar){
        this.activate=true;
       this._snackBar.open('El docente ya se encuentra registrado',
       '', {horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 8000});
 
        this._snackBar.open('El docente ya se encuentra registrado',
       '', {horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 8000});
 
        
        this.btnact=true;
       }
      
       if(!this.verificar){
         this.activate=false;
      const tarea:any={
        nombre:nombre,
        cedula:cedula,
        fechaNacimiento:ConvertedDate,
        correoElectronico:correoElectronico,
        institucion: [{id:this.institucionid, nombre:this.institucionnombre}],
        grado: [],  // Arrays dentro del objeto
        materia:[] // Arrays dentro del objeto
        //grado= this.datosgrado
      }
      for(let i=0;i<this.gradovalue.length;i++){
        tarea.grado.push(this.gradovalue[i]);  // Ingresa al array el valor de grado que coíncidio con el filtro de busqueda
      }

      for(let i=0;i<this.materianombre.length;i++){
        tarea.materia.push(this.materianombre[i]); // Ingresa al array el valor de grado que coíncidio con el filtro de busqueda
      }
    
      
      
      const respuesta=this._adminService.create(tarea,"Docente/addDocente/").subscribe({next: data => {
      this.datos = data;
     
  
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
        this._snackBar.open('Docente agregado con exito',
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

     //Genera un toost tanto para si el docente fue creado como sino.
    setTimeout(() => {
      
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
    
    }
    else{

      const ConvertedDate = this.myDatepipe.transform(fechaNacimiento, 'dd-MM-yyyy'); //Se utiliza el pipe para transformar
      //el valor de fecha obtenido en la base de datos en el formato dispuesto allí
      const tarea:any={
        id:this.data.id,
        nombre:nombre,
        cedula:cedula,
        fechaNacimiento:ConvertedDate,
        correoElectronico:correoElectronico,
        institucion: [{id:this.institucionid, nombre:this.institucionnombre}],
        grado: [],
        materia:[]       
      }
      for(let i=0;i<this.gradovalue.length;i++){
        tarea.grado.push(this.gradovalue[i]);
      }

      for(let i=0;i<this.materianombre.length;i++){
        tarea.materia.push(this.materianombre[i]);
      }
      
      
       /* The above code is updating the data in the database. */
       //Actualiza el valor de docente en el caso de que este editando algún valor del docente.
        const respuesta=this._adminService.update(this.data.id,tarea,"Docente/docenteUpdate/").subscribe({next: data => {
        this.datos = data;
    console.log(this.datos);
        },
        error:error => {
        this.errors = error.message;
          console.error('There was an error!', this.errors);
        }
      }
      );
   //Genera un toost tanto para si el docente fue creado como sino.
    if(this.datos.ok==true){
      this._snackBar.open('Docente actualizado con exito',
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
    this.router.navigate(['/admin/docentes']);
  
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
  
  

}
function tarea(tarea: any, arg1: string) {
  throw new Error('Function not implemented.');
}



function moment(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}

