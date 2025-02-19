import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CajaEgreso } from '../models/caja-egreso';


@Injectable({
  providedIn: 'root'
})
export class CajaEgresoService extends GenericService<CajaEgreso> {

  private cajaEgresoChange: Subject<CajaEgreso[]> = new Subject<CajaEgreso[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/caja-egresos`);
  }


  getCajaEgresoChange(){
    return this.cajaEgresoChange.asObservable();
  }

  setCajaEgresoChange(data: any){
    this.cajaEgresoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
