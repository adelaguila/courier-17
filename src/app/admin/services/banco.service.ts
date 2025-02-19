import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Banco } from '../models/banco';


@Injectable({
  providedIn: 'root'
})
export class BancoService extends GenericService<Banco>{

  private bancoChange: Subject<Banco[]> = new Subject<Banco[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/bancos`);
  }

  getBancoChange(){
    return this.bancoChange.asObservable();
  }

  setBancoChange(data: any){
    this.bancoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
