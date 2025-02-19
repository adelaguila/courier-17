import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Cargo } from '../models/cargo';

@Injectable({
  providedIn: 'root'
})
export class CargoService extends GenericService<Cargo>{

  private cargoChange: Subject<Cargo[]> = new Subject<Cargo[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/cargos`);
  }

  getCargosIdAbonado(idAbonado: number){
    return this.http.get(`${environment.HOST}/cargos/abonado/${idAbonado}`)
  }

  getCargosPendientesIdAbonado(idAbonado: number){
    return this.http.get(`${environment.HOST}/cargos/pendientesAbonado/${idAbonado}`)
  }

  getOrdenChange(){
    return this.cargoChange.asObservable();
  }

  setOrdenChange(data: any){
    this.cargoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
