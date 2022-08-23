import { NgModule } from '@angular/core';
import { BrowserModule, Meta } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { RouterModule, Router, Routes } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';

import { LoginModule } from './login.module';
import { HomeModule } from './home/home.module';
import { ControllerModule } from './controller/controller.module';
import {AutoComplete, AutoCompleteModule} from 'primeng/autocomplete'
import { ControllerComponent } from './controller/controller/controller.component';
import { ControlleradminComponent } from './controller/controlleradmin/controlleradmin.component';
import { LoginComponent } from './login.component';
import { SharedModule } from './shared/shared.module';
import { VistaEstudianteModule } from './vista-estudiante/vista-estudiante.module';
import { ToolbarPrincipalModule } from './toolbar-principal/toolbar-principal.module';




@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AdminModule,
    RouterModule,
    LoginModule,
    HomeModule,
    ControllerModule,
    SharedModule,
    VistaEstudianteModule,
    ToolbarPrincipalModule
  ],
  exports:[
    
  ],
  providers: [Meta],
  bootstrap: [AppComponent]
})
export class AppModule { }
