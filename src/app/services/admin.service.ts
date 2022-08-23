import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { responseproyect } from '../admin/interfaces/response';
import { Movies } from '../vista-estudiante/movies';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';

const API_BASE= 'http://localhost:8010';


const enum endpoint {
  latest = '/movie/latest',
  now_playing = '/movie/now_playing',
  popular = '/movie/popular',
  top_rated = '/movie/top_rated',
  upcoming = '/movie/upcoming',
  trending = '/trending/all/week',
  originals = '/discover/tv'
}


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private URL = 'https://api.themoviedb.org/3';
  // tslint:disable-next-line:variable-name
  private api_key = environment.api;

  
  
  get httpParams(){
    return new HttpParams().set('videourl','estudiante');
  }

  constructor(
    private http: HttpClient

  ) {} 
    
    getAll(cadena:string):Observable<any>{
     
      const url = `${API_BASE}/admin/${cadena}`;
      console.log(url);
    return this.http.get<any>(url);
    }
    getCustom(cadena:string,cadena1:string,cadena2:string, videourl:string, name:string):Observable<any>{
     
      
      const url = `${API_BASE}/admin/${cadena}`;
      console.log(url);
      const params = new HttpParams()
	    .set(`${cadena1}`, `${videourl}`)
	    .set(`${cadena2}`,`${name}`);
      
    let queryParams = {"videourl":`'"www.youtube.com"'`,"name":`'"andres celis"'`}; 
    const urlfull= `${url}?`+cadena1+'='+`"${videourl}"`+cadena2+'='+`"${name}"`;
    console.log(urlfull);
    
    return this.http.get<any>(url,{params:params });
    }

    getCustomRA(cadena:string,cadena1:string,cadena2:string,cadena3:string,cadena4:string, estudiante:string, materia:string, grado:String,docente:string):Observable<any>{
     
      
      const url = `${API_BASE}/admin/${cadena}`;
      console.log(url);
      const params = new HttpParams()
	.set(`${cadena1}`, `${estudiante}`)
	.set(`${cadena2}`,`${materia}`)
  .set(`${cadena3}`,`${grado}`)
  .set(`${cadena4}`,`${docente}`);
    const urlfull= `${url}?`+'nombrestudiante='+`"${estudiante}"`+'&nombremateria='+`"${materia}"`+'&grado='+`"${grado}"'`+`&nombredocente='+"${docente}"`;
    console.log(urlfull);
    
    return this.http.get<any>(url,{params:params });
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


    getLatestMovie(): Observable<Movies> {
      return this.http.get<Movies>(`${this.URL}${endpoint.latest}`, {
        params: {
          api_key: this.api_key
        }
      });
    }
  
    getNowPlaying(): Observable<Movies> {
      return this.http.get<Movies>(`${this.URL}${endpoint.now_playing}`, {
        params: {
          api_key: this.api_key
        }
      });
    }
  
    getOriginals(): Observable<Movies> {
      return this.http.get<Movies>(`${this.URL}${endpoint.originals}`, {
        params: {
          api_key: this.api_key
        }
      });
    }
  
    getPopularMovies(): Observable<Movies> {
      return this.http.get<Movies>(`${this.URL}${endpoint.popular}`, {
        params: {
          api_key: this.api_key
        }
      });
    }
  
    getTopRated(): Observable<Movies> {
      return this.http.get<Movies>(`${this.URL}${endpoint.top_rated}`, {
        params: {
          api_key: this.api_key
        }
      });
    }
  
    getTrending(): Observable<Movies> {
      return this.http.get<Movies>(`${this.URL}${endpoint.trending}`, {
        params: {
          api_key: this.api_key
        }
      });
    }
}
