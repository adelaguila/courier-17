import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Agencia } from '../models/agencia';


@Injectable({
  providedIn: 'root'
})
export class AgenciaService extends GenericService<Agencia>{

  private bancoChange: Subject<Agencia[]> = new Subject<Agencia[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/agencias`);
  }

  getAgenciaChange(){
    return this.bancoChange.asObservable();
  }

  setAgenciaChange(data: any){
    this.bancoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
