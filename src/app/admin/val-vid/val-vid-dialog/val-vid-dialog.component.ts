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
import { RatingModule } from 'ngx-bootstrap/rating';

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
  selector: 'app-val-vid-dialog',
  templateUrl: './val-vid-dialog.component.html',
  styleUrls: ['./val-vid-dialog.component.scss']
})
export class ValVidDialogComponent{
  changeText!:boolean;
  max = 5;
  rate = 2;
  isReadonly = false;
  id="3aEvYn4iWSI";
  player!: YT.Player;

  verificacion:boolean=true;
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
  form!:FormGroup;
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

  selectionins:any[]=[];
  selectionest:any[]=[];
 
  amper:boolean=false;
 
  verificar:boolean=true;
  activate:boolean=false;
  varnombre:string="";
  probar:boolean=false;
  probarclick:boolean=false;
  compclick:boolean=false;
  compclickest:boolean=false;
  
  probarclickest:boolean=false;
 inicio=false;
 
  
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

    this.form = this.fb.group({
      listaVideos: ['',Validators.required]
    })

    this.myDatepipe = datepipe; //Se creo para dar formato a la fecha de tipo dd-mm-yyyy
    this.stateCtrldba.disable();  //Desabilita el grado mientras no se vuelva true.
    this.stateCtrldocentes.disable();//Desabilita la materia mientras no se vuelva true.
    
   
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
      this.verificando();
      //Inicializa todos los inputs del html
      this.form.setValue({
       listaVideos:""
      
       

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
      this.spinnerEst=true;
      this.loadingEst=false;
      this.verificando();
      this.stateCtrlestudiantes.enable(); 
    
      this.spinner=true;  //Muestra la información dentro del div que contiene el ngIf de spinner
      this.btnact=true;
    
     
 
    
//Crea un objeto con los valores obtenidos de la base de datos, relacionados 
    //a la fecha de nacimiento del estudiante.
    
      
      //this.select= new Date(Number(year),Number(month),Number(day));

      //Inicializa el input tipo date con los valores del objeto generador anteriormente
       
      //Inicializa los valores del estudiante.
    this.form.setValue({
      listaVideos: data.videourl
    });
  
    

   



   
    
   
   
    this.setest=data.estudiante;  //Obtiene los datos de matería de la base de datos, apartir de la consulta realizada inicialmente
    this.setins= data.institucion;
   this.rate=data.val;


   

    
    this.selectionins.push(this.setins[0].nombre);
            
    this.selectionest.push(this.setest[0].nombre);



    let institucion = this.setins.map(value => value.nombre).toString();
    
    
     //Coloca el vector con los valores obtenidos de la base de datos utilizando two data binding.

    //Permite filtrar la instituciones de ser necesario
    this.filtrarinstitucion = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filtrarinstitucion(state) : this.datosinstitucion.slice())),
    );

    //Realiza la consulta de los grados asociados a la institución seleccionada anteriormente, o que se obtuvo de la base
    //de datos.
    

//Realiza la consulta de las materias asociadas a la institución seleccionada anteriormente, o que se obtuvo de la base
    //de datos.
    this._adminService.getAll("Estudiante/queryname/"+this.setins.map(value => value.nombre)+"/").subscribe({next: data => {
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
      this.verificando();

      if(this.datosestudiante.length==0){
       
        this.stateCtrlestudiantes.disable();
      }else{
       
        this.stateCtrlestudiantes.enable();
      }
 

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
  

    if(this.seleccionadostr.length>0){
      this.btnact=true;
     }else{
      this.btnact=false;
     }
   

  }

  savePlayer(player:any){
    this.player=player;
  }

  playVideo(){
    this.player.playVideo()
  }

  pauseVideo(){
    this.player.pauseVideo()
  }

  selectedlv(event: MatAutocompleteSelectedEvent): void { 
    //Este evento se activa cuando el usuario selecciona un grado
    this.seleccionadostr=(event.option.viewValue);


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

    this.btnact=true;
 
 

}

ValidateVideo(control: AbstractControl): {[key: string]: any} | null  {
  if (control.value && control.value.length != 10) {
   
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
    
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    
    this._adminService.getAll("Estudiante/queryname/"+this.seleccionado+"/").subscribe({next: data => {
      this.datosestudiante = data.body;
   
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

  verificando(){
    
    let valor=" ";
      this.datosinstitucion.forEach(state=>( state.nombre.trim().toLowerCase() === this.selectionins.toString().trim().toLowerCase() ? (this.compclick=true):"") );
      this.datosestudiante.forEach(state=> (state.nombre.trim().toLowerCase() === this.selectionest.toString().trim().toLowerCase() ?(this.compclickest=true) : ( "")));
      if(this.compclick){(this.probarclick=true)}else{this.probarclick=false};
      if(this.compclickest){this.probarclickest=true}else{this.probarclickest=false};
     
      this.compclick=false;
      this.compclickest=false;
      
     
     
      this.form.value.listaVideos.indexOf('&')>0 ?this.amper=true : "";
      let ampersan:boolean;
      if(this.amper==true){ampersan=true}else{ampersan=false}
      this.amper=false;
     
      if(this.selectionins.length>0 && this.selectionest.length>0  && this.datosinstitucion.length>0 && this.datosestudiante.length>0 && 
        this.datosdba.length>0 &&
        (this.probarclick && this.probarclickest ) &&
      ampersan == false
        ){
        this.btnact=true;
        this.probar=true;
        //console.log("click verificación true");
      }else{
        this.btnact=false;
        //console.log("click verificación false");
      }
      this.inicio=true;
   
      
     }

  

  Ingresar(){

    
   //Cuando se presiona el botón ingresar
    /* Declaring variables and initializing them. */
    if(this.probar){
    let filterValueArray:String;
    let filterDBAArray:any[]=[];
    let filterMateriaArray:any[]=[];
    let filterDocentesArray:any[]=[];
    let filterEstudiantesArray:String;
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
    


    
  
    //Se convierte la fecha obtenida en el formato dispuesta aquí
    let fechaactual = new Date();
    const ConvertedDate = this.myDatepipe.transform(fechaactual, 'dd-MM-yyyy hh:mm a');
    
    //Se obtiene los arreglos de selección del usuario, el de institución que corresponde con stateCtrl es un string junto congrados 
    //en el caso de materia es un arreglo.
    filterValueArray = this.stateCtrl.value;
   
    filterEstudiantesArray = this.stateCtrlestudiantes.value;

    
      
    /*for(let i=0;i<filterGradoArray.length;i++){
      filtervaluegrado=filterGradoArray[i];
    }

    for(let i=0;i<filterMateriaArray.length;i++){
      filtervaluemateria=filterMateriaArray[i];
    }*/
    let filterValue: string;
    let filterValueestudiante: string;
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

   
  

     for(let i=0;i<videolista.listaVideos.length;i++){
      datoslistaVideo.push(videolista.listaVideos[i].listaVideos);
     }

   
     
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
  
   //Se obtiene la institución seleccionada para el estudiante
   this.datosinstitucion.slice().forEach(value=>(this.institucionnombre=value.nombre));
    this.datosinstitucion.slice().forEach(value=>(this.institucionid=value.id));

   

   
    if(this.data==null){ 

      this._adminService.getCustom("ValVideos/queryestudianteVideo",'videourl','name',this.form.value.listaVideos,this.stateCtrlestudiantes.value).subscribe({next: data => {
        this.verificacion = data.body;
        
        },
        error:error => {
        this.errors = error.message;
          console.error('There was an error!', this.errors);
        }
      }
      );
       //En el caos que sea un usuario nuevo se crea el objeto tareas de la siguiente forma

       if(this.verificacion){
      
        this._snackBar.open('Espere un momento por favor',
        '', {horizontalPosition: 'center',
         verticalPosition: 'bottom',
         duration: 8000});
         this.btnact=false;
  
       }
      
      
       
       setTimeout(() => {
        
      if(this.verificacion){
        this.activate=true;
      this._snackBar.open('El estudiante y el video ya se encuentran registrados',
      '', {horizontalPosition: 'center',
       verticalPosition: 'bottom',
       duration: 8000});

       this._snackBar.open('El estudiante y el video ya se encuentran registrados',
      '', {horizontalPosition: 'center',
       verticalPosition: 'top',
       duration: 8000});

       
       this.btnact=true;
      }
     
      if(!this.verificacion){
        this.activate=false;
       const tarea:any={
        videourl:this.form.value.listaVideos,
        val: this.rate,
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

     /* console.log(tarea);
      for(let i=0;i<datosvideovisto.length;i++){
        console.log(datosvideovisto[i]);
        tarea.dba.videovisto.push(datosvideovisto[i]);//Se añaden al objeto tarea la materia seleccionada por el estudiante.
      }*/

     //console.log(tarea);
      //Se añade el objeto tarea a la petición post del servicio.
      const respuesta=this._adminService.create(tarea,"ValVideos/addValVideos/").subscribe({next: data => {
      this.datos = data;
    
  
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    //Se espera un tiempo hasta obtener la respuesta del servidor
    setTimeout(() => {
      
      if(this.datos.message=="success"){
        this._snackBar.open('Valoración agregada con exito',
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
        videourl:this.form.value.listaVideos,
        val: this.rate,
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
      
      
        const respuesta=this._adminService.update(this.data.id,tarea,"ValVideos/ValVideosUpdate/").subscribe({next: data => {
        this.datos = data;
  
        },
        error:error => {
        this.errors = error.message;
          console.error('There was an error!', this.errors);
        }
      }
      );
  
    if(this.datos.ok==true){
      this._snackBar.open('Valoración de videos actualizada con exito',
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
    this.router.navigate(['/admin/valvideos']);
  
  }

  }
    
  }

  //Estos metodos son invocados para realizar el filtrado del texto ingresado por el usuario en los campos input, cabe
  //recalcar que estos son solo apra institución,grado y materia, porqué se debe realizar un filtrado de la información
  //de acuerdo a la necesidad del usuario.

  private _filtrarinstitucion(value: string): interfaceinstitucion[] {

    const filterValue = value.toLowerCase();

    return this.datosinstitucion.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrardba(value: string): interfacedba[] {
    

    const filterValue = value.toLowerCase();
   
  
    return this.datosdba.filter(state => state.identificador.toLowerCase().includes(filterValue));
  }

  private _filtrarmateria(value: string): interfacemateria[] {
    const filterValue = value.toLowerCase();
    
 
    return this.datosmateria.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrarestudiantes(value: string): interfacemateria[] {
    const filterValue = value[0].toLowerCase();
    
    
    return this.datosestudiante.filter(state => state.nombre.toLowerCase().includes(filterValue));
  }

  private _filtrardocentes(value: string): interfacemateria[] {
   
    const filterValue = value[0].toLowerCase();
    
    
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



