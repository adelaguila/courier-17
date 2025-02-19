import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Moneda } from '../models/moneda';


@Injectable({
  providedIn: 'root'
})
export class MonedaService extends GenericService<Moneda> {

  private monedaChange: Subject<Moneda[]> = new Subject<Moneda[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/monedas`);
  }

  getMonedaChange(){
    return this.monedaChange.asObservable();
  }

  setMonedaChange(data: any){
    this.monedaChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
