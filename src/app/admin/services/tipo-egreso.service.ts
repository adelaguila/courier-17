import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoEgreso } from '../models/tipo-egreso';

@Injectable({
  providedIn: 'root'
})
export class TipoEgresoService extends GenericService<TipoEgreso> {

  private tipoEgresoChange: Subject<TipoEgreso[]> = new Subject<TipoEgreso[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/tipos-egresos`);
  }


  getTipoEgresoChange(){
    return this.tipoEgresoChange.asObservable();
  }

  setTipoEgresoChange(data: any){
    this.tipoEgresoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
