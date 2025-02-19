import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';

import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Liquidacion } from '../models/liquidacion';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionService extends GenericService<Liquidacion>{

  private marcaChange: Subject<Liquidacion[]> = new Subject<Liquidacion[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/liquidaciones`);
  }

  getLiquidacionChange(){
    return this.marcaChange.asObservable();
  }

  setLiquidacionChange(data: any){
    this.marcaChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
