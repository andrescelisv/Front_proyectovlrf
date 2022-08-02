import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationServicesService {

  static getValidatorErrorMessage(validatorName: string) {
    
    const required= 'Requerido';
    const invalid= 'Is invalid el ingreso';
    const invalidEmailAddress= 'Dirección de email invalida';
    const invalidPassword= 'Invalid password. Password must be at least 6 characters long, and contain a number.';
    const minlengthtelefono='Minima longitud es de 7 y máxima de 12. ';
    const pattern="Existe algún caracter especial no soportado, como tildes, guiones o comas";
      

    switch(validatorName){
      case "required":
        return required;
        
      
      case "invalid":
        return invalid;
      
      case "invalidEmailAddress":
        return invalidEmailAddress;

      case "invalidPassword":
        return invalidPassword;
      
      case "minlength":
        return minlengthtelefono;

      case "pattern":
        return pattern;

      default:
        return "error";
        

    }

    
  }


  static emailValidator(control: { value: string; }) {
    // RFC 2822 compliant regex
    if (
      control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static passwordValidator(control: { value: string; }) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }
}

