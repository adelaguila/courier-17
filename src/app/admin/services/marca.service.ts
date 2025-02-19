import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Marca } from '../models/marca';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarcaService extends GenericService<Marca>{

  private marcaChange: Subject<Marca[]> = new Subject<Marca[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/marcas`);
  }

  getMarcaChange(){
    return this.marcaChange.asObservable();
  }

  setMarcaChange(data: any){
    this.marcaChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
