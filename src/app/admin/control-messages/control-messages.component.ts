/* This class is a component that takes a FormControl as an input and displays an error message if the
FormControl is invalid */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationServicesService } from '../validation-services.service';

@Component({
  selector: 'app-control-messages',
  template:`
  <div class="textoerrorinput" *ngIf="errorMessage !== null">
   
   <h2 class="textoerrorinput">{{errorMessage}}</h2>
   

  </div>
`,
styleUrls: ['./control-messages.component.scss']
})
export class ControlMessagesComponent{

  errorMessagestr!: string;
  @Input() control!: any;
  constructor() {}

  get errorMessage() {
    //console.log(this.control);  
    for (let propertyName in this.control.errors) {  //Recibe el formControl de cada uno de los componentes de angular material, que se tienen en cada uno de los componentes en el html.
      //Realiza el for sobre el oneDataWay del input llamado control, de este objeto obtiene el atributo errors que contiene el validador empleado, cuando se creo el objeto formControl
      
      if (
        this.control.errors.hasOwnProperty(propertyName)  // Verifica si se tiene la propiedad
      ) {
        
        this.errorMessagestr= ValidationServicesService.getValidatorErrorMessage(
          propertyName
        );  //Se creo un servicio de vlaidación, el cual es singleton, ya que como todos los servicios se utiliza una sola vez.
        //además mediante el metodo de validación retorna el message dado en propertyName.
        //console.log("si tiene propiedad"+this.errorMessagestr);
        return ValidationServicesService.getValidatorErrorMessage(
          propertyName
        );  //Retorna el string que contiene el servicio en el validador del mensaje de error.
      }
    }

    return null;
  }

}
