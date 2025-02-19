import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Comprobante } from '../models/comprobante';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService extends GenericService<Comprobante>{

  private ontChange: Subject<Comprobante[]> = new Subject<Comprobante[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/comprobantes`);
  }

  getComprobanteChange(){
    return this.ontChange.asObservable();
  }

  setComprobanteChange(data: any){
    this.ontChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
