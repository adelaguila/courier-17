import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoAgencia } from '../models/tipo-agencia';

@Injectable({
  providedIn: 'root'
})
export class TipoAgenciaService extends GenericService<TipoAgencia> {

  private tipoAgenciaChange: Subject<TipoAgencia[]> = new Subject<TipoAgencia[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/tipos-agencias`);
  }


  getTipoAgenciaChange(){
    return this.tipoAgenciaChange.asObservable();
  }

  setTipoAgenciaChange(data: any){
    this.tipoAgenciaChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
