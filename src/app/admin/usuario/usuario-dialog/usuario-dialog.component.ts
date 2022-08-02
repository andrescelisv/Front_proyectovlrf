import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { responseproyect } from '../../interfaces/response';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


interface comprobacion {
  comprobar : boolean;
}


@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.scss']
})
export class UsuarioDialogComponent {
  @Input() tareasEdit: any =[];
  form: FormGroup;
  select:string="";
  comprobar=false;
  datos: responseproyect={
    ok: true,
    message:" ",
    body: []
  };

  
  errors:any;
  @Output() addUser: EventEmitter<comprobacion> = new EventEmitter();
  constructor(private fb:FormBuilder,private _adminService: AdminService,private _snackBar: MatSnackBar, private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
    this.form = this.fb.group({
      usuario: ['',Validators.required],
      contraseña: ['',Validators.required ],
      rol: ['',Validators.required],
      email: ['',Validators.required ]
    })
    console.log(this.data);
    if(data==null){
      this.select='Admin';
     
      this.form.setValue({
        usuario:"",
        contraseña:"",
        rol:"",
        email:""
      });
    }else{
      console.log(data.rol);
      data.rol = data.rol[0].toUpperCase() + data.rol.slice(1);
      this.select="data.rol";
      console.log(data.rol);
      this.select=data.rol;
    this.form.setValue({
      usuario: data.username,
      contraseña:data.password,
      rol:data.rol,
      email:data.email
    });
  }
  }

  

  Ingresar(){
   
    const usuario = this.form.value.usuario;
    const contraseña = this.form.value.contraseña; 
    const rol = this.form.value.rol;
    const email = this.form.value.email;  
    
    
    
  
    if(this.data==null){ 
      const tarea={
        username:usuario,
        password:contraseña,
        rol:rol,
        email:email
      } 
      const respuesta=this._adminService.create(tarea,"usuarios/addUsuarios/").subscribe({next: data => {
      this.datos = data;
  
      },
      error:error => {
      this.errors = error.message;
        console.error('There was an error!', this.errors);
      }
    }
    );
    if(this.datos.ok==true){
      this._snackBar.open('Usuario creado con exito',
      '', {horizontalPosition: 'center',
       verticalPosition: 'bottom',
       duration: 5000});
    }else{
      this._snackBar.open('Datos erroneos',
      '', {horizontalPosition: 'center',
       verticalPosition: 'bottom',
       duration: 5000});
    }
    }
    else{
      const tarea={
        id:this.data.id,
        username:usuario,
        password:contraseña,
        rol:rol,
        email:email
      }
        const respuesta=this._adminService.update(this.data.id,tarea,"usuarios/usuarioUpdate/").subscribe({next: data => {
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
    this.router.navigate(['/admin/usuario']);
  
  }
    
  }


  

}
function tarea(tarea: any, arg1: string) {
  throw new Error('Function not implemented.');
}

