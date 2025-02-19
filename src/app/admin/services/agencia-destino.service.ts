import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AgenciaDestino } from '../models/agencia-destino';


@Injectable({
  providedIn: 'root'
})
export class AgenciaDestinoService extends GenericService<AgenciaDestino>{

  private bancoChange: Subject<AgenciaDestino[]> = new Subject<AgenciaDestino[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/agencias-destinos`);
  }

  getAgenciaDestinoChange(){
    return this.bancoChange.asObservable();
  }

  setAgenciaDestinoChange(data: any){
    this.bancoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
