import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Orden } from '../models/orden';
import { OrdenAsignacion } from '../models/orden-asignacion';
import { OrdenAsignarVariosDTO } from '../dto/orden-asignar-varios';


@Injectable({
  providedIn: 'root'
})
export class OrdenService extends GenericService<Orden>{

  private ordenChange: Subject<Orden[]> = new Subject<Orden[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/ordenes`);
  }

  getOrdenesIdAbonado(idAbonado: number){
    return this.http.get(`${environment.HOST}/ordenes/abonado/${idAbonado}`)
  }

  porAtender(){
    return this.http.get<OrdenAsignacion[]>(`${environment.HOST}/ordenes-asignaciones/por-atender`)
  }

  imprimirOrden(orden: Orden){
    return this.http.get(`${environment.HOST}/ordenes/imprimirOrden/${orden.idOrden}`, {responseType: 'blob'})
  }

  asignarOrden(ordenAsignacion: OrdenAsignacion){
    return this.http.post(`${environment.HOST}/ordenes/asignacion`, ordenAsignacion)
  }

  asignarVarios(data: OrdenAsignarVariosDTO){
    return this.http.post(`${environment.HOST}/ordenes/asignacion-masiva`, data)
  }



  atenderOrden(ordenAsignacion: OrdenAsignacion){
    return this.http.post(`${environment.HOST}/ordenes/atencion`, ordenAsignacion)
  }

  listaPorEstado(estado: string): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${environment.HOST}/ordenes/estado/${estado}`)
    .pipe(
        map(response => {
            return response.map(orden =>{
                return orden;
            });
        })
    );
  }

  getOrdenChange(){
    return this.ordenChange.asObservable();
  }

  setOrdenChange(data: any){
    this.ordenChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
