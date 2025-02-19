import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Servicio } from '../models/servicio';


@Injectable({
  providedIn: 'root'
})
export class ServicioService extends GenericService<Servicio>{

  private servicioChange: Subject<Servicio[]> = new Subject<Servicio[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/servicios`);
  }

  getServicioChange(){
    return this.servicioChange.asObservable();
  }

  setServicioChange(data: any){
    this.servicioChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
