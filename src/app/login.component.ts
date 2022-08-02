import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { timeout } from 'rxjs';

interface loading {
  loadingadmin : boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  
  form: FormGroup;
  durationInSeconds =5000;
  loading = false; 
  show= true;
  spinner=true;



  horizontalPosition: MatSnackBarHorizontalPosition ='center';
  verticalPosition: MatSnackBarVerticalPosition ='bottom';
  @Output() onloginadmit: EventEmitter<loading> = new EventEmitter();

  constructor(private fb:FormBuilder, private _snackBar: MatSnackBar, private router:Router){
    this.form = this.fb.group({
      usuario: ['',Validators.required],
      password: ['',Validators.required ]
    })
  }


  Ingresar(){

    const usuario = this.form.value.usuario;
    const contraseña = this.form.value.password; 

    if(usuario == 'andres' && contraseña == 'nada12'){
      //this.fakeLoading();
      
      this.onloginadminfun();
      //this.loading=true;
      //Redirecionamos al dashboard
    }else{
      //error
      this.error();
      this.form.reset();
    }
  }

  error(){
    this._snackBar.open('Usuario o contraseña ingresados son erroneos',
    '', {horizontalPosition: this.horizontalPosition,
       verticalPosition:this.verticalPosition,
       duration:this.durationInSeconds});

    
    };


    fakeLoading(){
      /*this.loading= true;
      setTimeout(() => {
        //Redireccionamos al dashboard
        this.router.navigate(['admin']);
      },1500)*/
    }

    onloginadminfun():void{
      
      this.spinner=true;
      this.loading= true;
      
      setTimeout(() => {
        //Redireccionamos al dashboard
        //this.loading= false;
        
        this.loading= false;
        this.onloginadmit.emit({loadingadmin:this.loading }); 
        this.show=false;
               
        //this.router.navigate(['admin']);
        //this.loading=false;
      },1500)
      
      //this.show=false;
      //this.router.navigate(['admin']);
     //this.router.navigate(['admin'])
     
    
    }

  }







