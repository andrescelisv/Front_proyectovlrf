import { NgModule } from '@angular/core';
import { BrowserModule, Meta } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { RouterModule } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';

import { LoginModule } from './login.module';


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
    LoginModule
  ],
  exports:[
    
  ],
  providers: [Meta],
  bootstrap: [AppComponent]
})
export class AppModule { }
