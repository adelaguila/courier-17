import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoServicio } from '../models/tipo-servicio';

@Injectable({
  providedIn: 'root'
})
export class TipoServicioService extends GenericService<TipoServicio> {

  private tipoServicioChange: Subject<TipoServicio[]> = new Subject<TipoServicio[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/tipos-servicios`);
  }


  getTipoServicioChange(){
    return this.tipoServicioChange.asObservable();
  }

  setTipoServicioChange(data: any){
    this.tipoServicioChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
