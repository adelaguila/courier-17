import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrdenAsignacionOnt } from '../models/orden-asignacion-ont';


@Injectable({
  providedIn: 'root'
})
export class OrdenAsignacionOntService extends GenericService<OrdenAsignacionOnt>{

  private ordenAsignacionOntChange: Subject<OrdenAsignacionOnt[]> = new Subject<OrdenAsignacionOnt[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/ordenes-asignaciones-onts`);
  }

  onusAsignadasAbonado(idAbonado: number){
    return this.http.get(`${environment.HOST}/ordenes-asignaciones-onts/abonado/${idAbonado}`)
  }


  getOrdenAsignacionOntChange(){
    return this.ordenAsignacionOntChange.asObservable();
  }

  setOrdenAsignacionOntChange(data: any){
    this.ordenAsignacionOntChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
