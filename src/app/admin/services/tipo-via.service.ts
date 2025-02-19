import { Injectable } from '@angular/core';

import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoVia } from '../models/tipo-via';

@Injectable({
  providedIn: 'root'
})
export class TipoViaService extends GenericService<TipoVia> {

  private tipoViaChange: Subject<TipoVia[]> = new Subject<TipoVia[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/tipos-vias`);
  }

  getTipoViaChange(){
    return this.tipoViaChange.asObservable();
  }

  setTipoViaChange(data: any){
    this.tipoViaChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
