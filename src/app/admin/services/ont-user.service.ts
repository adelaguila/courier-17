import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Ont } from '../models/ont';
import { Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OntUser } from '../models/ont-user';

@Injectable({
  providedIn: 'root'
})
export class OntUserService extends GenericService<OntUser>{

  private ontUserChange: Subject<OntUser[]> = new Subject<OntUser[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/onts-users`);
  }

  getByEstadoUser(estado: string, idUser: number): Observable<OntUser[]> {
    return this.http.get<OntUser[]>(`${environment.HOST}/onts-users/estado/${estado}/idUser/${idUser}`)
    .pipe(
        map(response => {
            return response.map(untUser =>{
                untUser.serieMarca = `${untUser.ont.serie} - ${untUser.ont.producto.nombreProducto}`
                return untUser;
            });
        })
    );;
  }

  devolver(onuUser: OntUser){
    return this.http.post(`${environment.HOST}/onts-users/devolver`, onuUser);
  }

  getOntUserChange(){
    return this.ontUserChange.asObservable();
  }

  setOntUserChange(data: any){
    this.ontUserChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
