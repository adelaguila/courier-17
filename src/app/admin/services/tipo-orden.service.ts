import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoOrden } from '../models/tipo-orden';

@Injectable({
  providedIn: 'root'
})
export class TipoOrdenService extends GenericService<TipoOrden> {

  private tipoOrdenChange: Subject<TipoOrden[]> = new Subject<TipoOrden[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/tipos-ordenes`);
  }

  getUsoEstadoAbonado(usoEstadoAbonado: string): Observable<TipoOrden[]> {
    return this.http.get<TipoOrden[]>(`${environment.HOST}/tipos-ordenes/usoEstadoAbonado/${usoEstadoAbonado}`);
  }

  getTipoOrdenChange(){
    return this.tipoOrdenChange.asObservable();
  }

  setTipoOrdenChange(data: any){
    this.tipoOrdenChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
