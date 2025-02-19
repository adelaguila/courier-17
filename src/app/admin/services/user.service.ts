import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { User } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService<User>{

  private userChange: Subject<User[]> = new Subject<User[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/users`);
  }

  autocomplete(term: string): Observable<User[]> {
    return this.http.get<User[]>(`${environment.HOST}/users/autocomplete/${term}`);
  }

  actualizarRoles(user: User) {
    return this.http.post(`${environment.HOST}/users/actualizar-roles`, user);
  }

  cambiarEstado(data: any) {
    return this.http.post(`${environment.HOST}/users/cambiar-estado`, data);
  }

  findByUsername(username: string) {
    return this.http.get<User>(`${environment.HOST}/users/findOneByUsername/${username}`);
  }

  findOneByUsername(username: string) {
    return this.http.get<User>(`${this.url}/findOneByUsername/${username}`);
  }

  importarUsersFromExcel(data: File){

    const formdata: FormData = new FormData();
    formdata.append('file', data);

    return this.http.post(`${environment.HOST}/users/importar-users`, formdata);
  }

  getUserChange(){
    return this.userChange.asObservable();
  }

  setUserChange(data: any){
    this.userChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }

  getUserAuthenticate(): string{
    const helper = new JwtHelperService();
    const decodeToken =  helper.decodeToken(localStorage.getItem(environment.TOKEN_NAME));
    return decodeToken.sub;
  }

  esDocente(): boolean{
    const helper = new JwtHelperService();
    const decodeToken =  helper.decodeToken(localStorage.getItem(environment.TOKEN_NAME));
    const roles = decodeToken.role.split(',');

    for(let r of roles){
      if(r === 'DOCENTE'){
        return true;
        break;
      }
    }
    return false;
  }

  esCoordinador(): boolean{
    const helper = new JwtHelperService();
    const decodeToken =  helper.decodeToken(localStorage.getItem(environment.TOKEN_NAME));
    const roles = decodeToken.role.split(',');

    for(let r of roles){
      if(r === 'CORDINADORACADEMICO'){
        return true;
        break;
      }
    }
    return false;
  }

  esAlumno(): boolean{
    const helper = new JwtHelperService();
    const decodeToken =  helper.decodeToken(localStorage.getItem(environment.TOKEN_NAME));
    const roles = decodeToken.role.split(',');

    for(let r of roles){
      if(r === 'ALUMNO'){
        return true;
        break;
      }
    }
    return false;
  }
}
