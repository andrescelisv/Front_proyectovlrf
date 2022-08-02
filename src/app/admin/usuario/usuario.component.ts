import { Component, Input, NgModule, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'src/app/services/admin.service';
import { responseproyect } from '../interfaces/response';
import { url } from '../interfaces/url';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';

interface comprobacion {
  comprobar : boolean;
}


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})

export class UsuarioComponent  {
 /* tareas={
    ok:  true,
    message: "",
    body:  {
      username: " ",
    password: " ",
    rol:      " ",
    email:    " ",
          
    }

  }*/
  
 url:url={
    get:'usuarios/all',
    update: 'usuarios/usuarioUpdate',
    create: 'usuarios/addUsuarios',
    delete: 'usuarios/deleteUsuario/'
 }

 tipos:any=[
  'username',
  'rol',
  'email'
]

usuario:string="Usuario";

componentDialog:any =UsuarioDialogComponent;
  
  constructor() { }

  

 

 
  

}


