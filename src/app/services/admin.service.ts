import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { responseproyect } from '../admin/interfaces/response';



const API_BASE= 'http://localhost:8010';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
 
  constructor(
    private http: HttpClient

  ) {} 
    
    getAll(cadena:string):Observable<any>{
      console.log((`${API_BASE}/admin/`+cadena));
      
    return this.http.get<any>(`${API_BASE}/admin/`+cadena);
    }
    create(tarea: any,cadena:string):Observable<any>{
      console.log("tarea: "+tarea);
      console.log("cadena: "+cadena);
      return this.http.post(`${API_BASE}/admin/`+cadena,tarea);
    }
    update(id:string,tarea:any,cadena:string):Observable<any>{
      return this.http.put(`${API_BASE}/admin/`+cadena+`${id}`,tarea);
    }
    delete(id:string,cadena:string){
      return this.http.delete(`${API_BASE}/admin/`+cadena+`${id}`);
    }
}
