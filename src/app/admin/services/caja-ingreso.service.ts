import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CajaIngreso } from '../models/caja-ingreso';

@Injectable({
  providedIn: 'root'
})
export class CajaIngresoService extends GenericService<CajaIngreso> {

  private cajaIngresoChange: Subject<CajaIngreso[]> = new Subject<CajaIngreso[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/caja-ingresos`);
  }


  getCajaIngresoChange(){
    return this.cajaIngresoChange.asObservable();
  }

  setCajaIngresoChange(data: any){
    this.cajaIngresoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
