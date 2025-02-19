import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoCargo } from '../models/tipo-cargo';

@Injectable({
  providedIn: 'root'
})
export class TipoCargoService extends GenericService<TipoCargo> {

  private tipoCargoChange: Subject<TipoCargo[]> = new Subject<TipoCargo[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/tipos-cargos`);
  }

  getTipoCargoChange(){
    return this.tipoCargoChange.asObservable();
  }

  setTipoCargoChange(data: any){
    this.tipoCargoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
