import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoIngreso } from '../models/tipo-ingreso';

@Injectable({
  providedIn: 'root'
})
export class TipoIngresoService extends GenericService<TipoIngreso> {

  private tipoIngresoChange: Subject<TipoIngreso[]> = new Subject<TipoIngreso[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/tipos-ingresos`);
  }


  getTipoIngresoChange(){
    return this.tipoIngresoChange.asObservable();
  }

  setTipoIngresoChange(data: any){
    this.tipoIngresoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
