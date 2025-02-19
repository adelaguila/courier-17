import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrdenAsignacion } from '../models/orden-asignacion';


@Injectable({
  providedIn: 'root'
})
export class OrdenAsignacionService extends GenericService<OrdenAsignacion>{

  private ordenAsignacionChange: Subject<OrdenAsignacion[]> = new Subject<OrdenAsignacion[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/ordenes-asignaciones`);
  }

  findOrdenAsignacionActiva(idOrden: number){
    return this.http.get(`${environment.HOST}/ordenes-asignaciones/activa/${idOrden}`)
  }


  getOrdenAsignacionChange(){
    return this.ordenAsignacionChange.asObservable();
  }

  setOrdenAsignacionChange(data: any){
    this.ordenAsignacionChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
