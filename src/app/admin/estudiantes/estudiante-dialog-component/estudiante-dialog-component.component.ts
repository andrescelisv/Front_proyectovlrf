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
import { Body, Grado, Materia } from '../../interfaces/docentes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

interface comprobacion {
  comprobar : boolean;
}

export interface interfaceinstitucion {
  id:string;
  nombre: string;
  ubicacion: string;
}

export interface interfacegrado {
  id:string,
  grado: string;
  jornada: string;
}

export interface interfacemateria{
  id:string,
  nombre: string;
}
export interface State {
  flag: string;
  name: string;
  population: string;
}


@Component({
  selector: 'app-estudiante-dialog-component',
  templateUrl: './estudiante-dialog-component.component.html',
  styleUrls: ['./estudiante-dialog-component.component.scss']
})
export class EstudianteDialogComponentComponent{
 
  @Input() tareasEdit: any =[]; //Recibe de en event emitter procedente de tabla template
  form: FormGroup; //Contiene todos los inputs del formulario docente
  seleccionado:string=""; // valor del input institución
  seleccionadostr:string=""; //valor del input grado
  seleccionadoMat:string=""; //Valor del input matería
  stateCtrl = new FormControl('',[Validators.required]);  //Formulario de control de instituciones con validación y autocompletar 
  stateCtrlgrado = new FormControl('',[Validators.required]); //Formulario de control de grado con validación y autocompletar
  stateCtrlmateria = new FormControl('',[Validators.required]);//Formulario de control de materia con validación y autocompletar
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
  selectionmateria:any[]=[]; //Almacena la materia seleccionada
  datosgradotarea:any[]=[];  //alamcena los datos de grado que van a ser enviados al back.
  datosmateriatarea:any[]=[]; //alamcena los datos de materia que van a ser enviados al back.
  gradoid="";  //Almacena el id de grado que es de tipo string.
  gradovalue:any[]=[]; //Almacena el valor de grado, que es un vector que corresponde a la selección de los diferentes grados
  //por parte del usuario.
  materiaid="";  //id de materia
  materianombre:any[]=[]; //Nombre de materia
  btnact=false;   //boton de guardar no activo por defecto
  institucionnombre:string="";   //Nombre de institución
  institucionid:string="";      //id de institución
  showAlert:boolean=false;  //Muestra un toots de alerta para institución
  showAlertMat:boolean= false;  //Muestra un toots de alerta para materia
  
  /* Creating a variable called datos and assigning it a value of an object with the properties ok,
  message, and body. */
  datos: responseproyect={
    ok: true,
    message:" ",
    body: []
  };

/* Creating an array of objects that have the same structure. */
  datosinstitucion:interfaceinstitucion[]=[
    { id:"1",nombre: "Jardin Mafalda",
  ubicacion:"" },
    {id:"2",nombre:"Colegio Los Andes",
  ubicacion:""},
  {id:"3",nombre:"Colegio Champagnat",
  ubicacion:""},
  {id:"4",nombre:"Colegio Básico Real Popayán",
  ubicacion:""},
  {id:"5",nombre:"Colegio Liceo Bello Horizonte",
  ubicacion:""}

  ]
 /* Creating an interface for the data that will be received from the database. */
  datosgrado:interfacegrado[]=[];
  datosmateria:interfacemateria[]=[];
 
  
 /* The above code is creating a new event emitter called addUser. */
  errors:any;
  @Output() addUser: EventEmitter<comprobacion> = new EventEmitter();
  myDatepipe!: any;

 /*  */
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
   /* The above code is creating a form with the following fields:
   - nombre
   - cedula
   - fechaNacimiento
   - correoElectronico */
    /* *|CURSOR_MARCADOR|* */
    this.myDatepipe = datepipe; //Se creo para dar formato a la fecha de tipo dd-mm-yyyy
    this.stateCtrlgrado.disable();  //Desabilita el grado mientras no se vuelva true.
    this.stateCtrlmateria.disable();//Desabilita la materia mientras no se vuelva true.
    this.form = new FormGroup({
      nombre: new FormControl('',[Validators.required,Validators.minLength(10),Validators.pattern('[A-Za-z \-\_]+')]),
      cedula:new FormControl('',[Validators.required,Validators.minLength(8), Validators.pattern("^[0-9]*$")]),
      fechaNacimiento: new FormControl('',[Validators.required]),
      correoElectronico:new FormControl('',[Validators.required,Validators.email]),
     

    })
   
    
    console.log(this.data);
    //Verifica si es un usuario nuevo a ingresar
    if(data==null){
      //this.select='Admin';
    
      //Inicializa todos los inputs del html
      this.form.setValue({
        nombre:"",
        cedula:"",
        fechaNacimiento:"",
        correoElectronico:"",
      
       

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
      this.stateCtrlgrado.enable(); //Habilita la busqueda y selección de grado
      this.stateCtrlmateria.enable();  //Habilita la busqueda y selección de materia
  
      this.spinner=true;  //Muestra la información dentro del div que contiene el ngIf de spinner
     
      var re = /-/gi;  //Genera un string con la cadena de busqueda, es decir un "-" para la fecha
  
    // Use of String replace() Method
    var newstr = data.fechaNacimiento.replace(re, "/");  //Reemplaza el "/" por un "-"
      
     
    const [day,month, year] =newstr.split('/'); //Retorna con 3 valores por fila con el dia, mes y año.

 
    
    const date = new Date(+year, +month - 1, +day); //Crea un objeto con los valores obtenidos de la base de datos, relacionados 
    //a la fecha de nacimiento del estudiante.
    
      
      //this.select= new Date(Number(year),Number(month),Number(day));

      this.select= date; //Inicializa el input tipo date con los valores del objeto generador anteriormente
       
      //Inicializa los valores del estudiante.
    this.form.setValue({
      nombre: data.nombre,
      cedula:data.cedula,
      fechaNacimiento:date,
      correoElectronico:data.correoElectronico
    });
    
    this.setins=data.institucion;  //Obtiene los datos de institución de la base de datos, apartir de la consulta realizada inicialmente
    this.setgra=data.grado;  //Obtiene los datos de grado de la base de datos, apartir de la consulta realizada inicialmente
    this.setmat=data.materia;  //Obtiene los datos de matería de la base de datos, apartir de la consulta realizada inicialmente
    


    this.stateCtrl.setValue(this.setins.map(value => value.nombre)); //Inicializa el input de institución, no obstante esta parte
    //no es del todo fija, sino que se realiza con un tipo two data binding, que contiene el ngModel dentro del input
    this.stateCtrlgrado.setValue(this.setgra.map(value => value.grado));//Inicializa el input de grado, no obstante esta parte
    //no es del todo fija, sino que se realiza con un tipo two data binding, que contiene el ngModel dentro del input
    

    const valormat=this.setmat.slice().map(value=>(value.nombre));
    
    this.selectionmateria= valormat; //Coloca el vector con los valores obtenidos de la base de datos utilizando two data binding.

    //Permite filtrar la instituciones de ser necesario
    this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
    );

    //Realiza la consulta de los grados asociados a la institución seleccionada anteriormente, o que se obtuvo de la base
    //de datos.
    this._adminService.getAll("Grado/queryname/"+this.setins.map(value => value.nombre)+"/").subscribe({next: data => {
      this.datosgrado = data.body;
      
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
//Realiza la consulta de las materias asociadas a la institución seleccionada anteriormente, o que se obtuvo de la base
    //de datos.
    this._adminService.getAll("Materia/queryname/"+this.setins.map(value => value.nombre)+"/").subscribe({next: data => {
      this.datosmateria = data.body;
      
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
 
    //Realiza el filtrado del grado y la selección de un grado

    this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice())),
    );
 
    //Filtra las materias por un criterio de busqueda ingresado en el input. Este seleeciona varias materias.
    this.filtrarmateria = this.stateCtrlmateria.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarmateria(state) : this.datosmateria.slice())),
    );

    if(this.seleccionadoMat.length>0){
      //En el caso que exista mas de una materia en la base de datos se habilita el botón de guardar.
      this.btnact=true;
     }else{
      this.btnact=false;
     }
  }
  }

  

  selectedgrado(event: MatAutocompleteSelectedEvent): void { 
    //Este evento se activa cuando el usuario selecciona un grado
    this.seleccionadostr=(event.option.viewValue);
    console.log(this.seleccionadostr);

    if(this.seleccionadostr.length>0 && this.seleccionadoMat.length>0){
      this.btnact=true;
     }else{
      this.btnact=false;
     }
   

  }

  clickedOptionMateria(){
    //Este se produce cuando el usuario selecciona uno o varias materias
    this.btnact=true;
   
    
   

}

  selectedMateria(event: MatAutocompleteSelectedEvent): void {
      //Este evento se activa cuando el usuario selecciona una o varias materias
    this.seleccionadoMat=(event.option.viewValue);
   
//Si el vector obtenido de la consulta a la base de datos es mayor que cero se habilita la selección de materias
   if(this.seleccionadoMat.length>0){
    this.btnact=true;
   }else{
    this.btnact=false;
   }

  }

  selected(event: MatAutocompleteSelectedEvent): void { 
      //Este evento se activa cuando el usuario selecciona una institución. A partir de que se obtiene la institución seleccionada
      //pór el usuario se realiza la consulta a la base de datos por los grados.
    this.seleccionado=(event.option.viewValue); //Obtiene el valor del input multiple
    this.loading=true; //Carga y muestra el sppiner
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
    //Obtiene las materias asociadas a una institución
    this._adminService.getAll("Materia/queryname/"+this.seleccionado+"/").subscribe({next: data => {
      this.datosmateria = data.body;
      
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    
    
    //Espera un tiempo para obtener los grados y materias de la base de datos.
    setTimeout(() => {
      if(this.datosgrado.length>0){
        this.showAlert=false;
        this.stateCtrlgrado.enable();
        
        this.filtrargrado = this.stateCtrlgrado.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filtrargrado(state) : this.datosgrado.slice())),
        );

        
      }
      else{
        this.stateCtrlgrado.disable(); //Si no se obtiene nada de la base de datos se desabilita la opción de seleccionar un grado
        this.showAlert=true;
      
      }

      if(this.datosmateria.length>0){
        this.showAlertMat=false;
        this.stateCtrlmateria.enable();
        

       
  
     
      }
      else{
        this.stateCtrlmateria.disable(); //Si no se obtiene nada de la base de datos se desabilita la opción de seleccionar una materia
        this.showAlertMat=true;
      }
      this.loading=false; 
      this.spinner=true;

    },3000)
    
    
    
    
    
  }

  

  Ingresar(){
   //Cuando se presiona el botón ingresar
    /* Declaring variables and initializing them. */
    let filterValueArray:any[]=[];
    let filterGradoArray:any[]=[];
    let filterMateriaArray:any[]=[];
    let datosgrado:any[]=[];
    let filtervalue:any="";
    let filtervaluegrado:any="";
    this.datosmateriatarea.length=0;
    this.gradovalue=[];
    this.materianombre=[];

    //Se obtiene los valores del form group y se tratan como constantes
    const nombre = this.form.value.nombre;
    const cedula = this.form.value.cedula; 
    const fechaNacimiento = this.form.value.fechaNacimiento;
    const correoElectronico = this.form.value.correoElectronico;  
  
    //Se convierte la fecha obtenida en el formato dispuesta aquí
    const ConvertedDate = this.myDatepipe.transform(fechaNacimiento, 'dd-MM-yyyy');
    
    //Se obtiene los arreglos de selección del usuario, el de institución que corresponde con stateCtrl es un string junto congrados 
    //en el caso de materia es un arreglo.
    filterValueArray = this.stateCtrl.value;
    filterGradoArray = this.stateCtrlgrado.value;
    filterMateriaArray = this.stateCtrlmateria.value;

    
      
    /*for(let i=0;i<filterGradoArray.length;i++){
      filtervaluegrado=filterGradoArray[i];
    }

    for(let i=0;i<filterMateriaArray.length;i++){
      filtervaluemateria=filterMateriaArray[i];
    }*/
    
    filtervalue= filterValueArray; 
    const filterValue = filtervalue.toLowerCase(); //Se convierte a minuscula para hacer una comparación igualitaria.
    
    //Se extrae el objeto que corresponde con el valor ingresado por el usuario.
    this.datosinstitucion=this.datosinstitucion.filter(state => state.nombre.toLowerCase().includes(filterValue));
    
   
    /*const filterValueMat = this.seleccionadoMat;
    this.datosmateria=this.datosmateria.filter(state => state.nombre.toLowerCase().includes(filterValueMat));*/

   
  
    filtervaluegrado = filterGradoArray;
    const filterValuegrado = filtervaluegrado.toLowerCase(); //Convierte el valor de grado a minusculas
  
      
      //Realiza agregación del objeto que coincide con la busqueda del usuario.
      datosgrado.push(this.datosgrado.filter(state => state.grado.toLowerCase().includes(filterValuegrado)));

   

  
   
  //Como las materias son un arerglo realiza un recorrido para obtener todas las materias seleccionadas para el estudiante.
    for(let i=0;i<filterMateriaArray.length;i++){
      
      this.datosmateriatarea.push(this.datosmateria.filter(state => state.nombre.includes(filterMateriaArray[i])));
  
    }
    
   
    
   
    //Se obtiene el grado que seleccionaron para el estudiante.
    datosgrado.slice().forEach(value=>(value.forEach((value: { id: string; grado:string;})=>(this.gradovalue.push({id:value.id,grado:value.grado}),console.log(value.id)))));
   // this.datosgradotarea.slice().forEach(value=>(value.forEach((value: {   })=>(this.gradovalue.push(value.grado),console.log(value.grado)))));
   this.datosmateriatarea.slice().forEach(value=>(value.forEach((value: { id: string; nombre:string;})=>(this.materianombre.push({id:value.id,nombre:value.nombre}),console.log(value.id))))); 
     //Se obtiene la o las materias seleccionadas para el estudiante.
   //this.datosmateria.slice().forEach(value=>(this.materiaid=value.id));
    
   //Se obtiene la institución seleccionada para el estudiante
   this.datosinstitucion.slice().forEach(value=>(this.institucionnombre=value.nombre,console.log(value.nombre)));
    this.datosinstitucion.slice().forEach(value=>(this.institucionid=value.id));

   

   
    if(this.data==null){ 
       //En el caos que sea un usuario nuevo se crea el objeto tareas de la siguiente forma
      const tarea:any={
        nombre:nombre,
        cedula:cedula,
        fechaNacimiento:ConvertedDate,
        correoElectronico:correoElectronico,
        institucion: [{id:this.institucionid, nombre:this.institucionnombre}],
        grado: [],
        materia:[]
        //grado= this.datosgrado
      }

      for(let i=0;i<this.gradovalue.length;i++){
        tarea.grado.push(this.gradovalue[i]); //Se añaden al objeto tarea el grado seleccionado por el estudiante.
      }

      for(let i=0;i<this.materianombre.length;i++){
        tarea.materia.push(this.materianombre[i]);//Se añaden al objeto tarea la materia seleccionada por el estudiante.
      }

     
      //Se añade el objeto tarea a la petición post del servicio.
      const respuesta=this._adminService.create(tarea,"estudiante/addEstudiante/").subscribe({next: data => {
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
      console.log(this.datos);
      if(this.datos.message=="success"){
        this._snackBar.open('Docente creado con exito',
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
      }
    },2000);
    
    }
    else{
       //En el caso que se este editando un estudiante se realiza el mismo procedimiento que para un usuario nuevo con la diferencia
       // que la petición utilizada en el servicio es de tipo put.
      const ConvertedDate = this.myDatepipe.transform(fechaNacimiento, 'dd-MM-yyyy');
      const tarea:any={
        id:this.data.id,
        nombre:nombre,
        cedula:cedula,
        fechaNacimiento:ConvertedDate,
        correoElectronico:correoElectronico,
        institucion: [{id:this.institucionid, nombre:this.institucionnombre}],
        grado: [{id:this.gradoid,
          grado:this.gradovalue
        }],
        materia:[{
          id:this.materiaid,
          nombre:this.materianombre
        }]
      }
        const respuesta=this._adminService.update(this.data.id,tarea,"estudiante/estudiantesUpdate/").subscribe({next: data => {
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
    this.comprobar= true;
    this.router.navigate(['/admin/estudiantes']);
  
  }
    
  }

  //Estos metodos son invocados para realizar el filtrado del texto ingresado por el usuario en los campos input, cabe
  //recalcar que estos son solo apra institución,grado y materia, porqué se debe realizar un filtrado de la información
  //de acuerdo a la necesidad del usuario.

  private _filtrarinstitucion(value: string): interfaceinstitucion[] {
    const filterValue = value.toLowerCase();

    return this.datosinstitucion.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrargrado(value: string): interfacegrado[] {
    const filterValue = value.toLowerCase();
    
    console.log(this.datosgrado.filter(state => state.grado.toLowerCase().includes(filterValue)));
    return this.datosgrado.filter(state => state.grado.toLowerCase().includes(filterValue));
  }

  private _filtrarmateria(value: string): interfacemateria[] {
    const filterValue = value.toLowerCase();
    
    console.log(this.datosmateria.filter(state => state.nombre.toLowerCase().includes(filterValue)));
    return this.datosmateria.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }
  
  

}

//Se utilizan estos dos metodos finales para generar excepciones con el objeto tarea, si es el caso que sea necesario.
function tarea(tarea: any, arg1: string) {
  throw new Error('Function not implemented.');
}



function moment(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}

  




