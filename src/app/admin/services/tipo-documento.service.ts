import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';
import { TipoDocumento } from '../models/TipoDocumento';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService extends GenericService<TipoDocumento>{

  private tipoDocumentoChange: Subject<TipoDocumento[]> = new Subject<TipoDocumento[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ) {
    super(http, `${environment.HOST}/tipos-documentos`);
  }

  getTipoDocumento(){
    return this.tipoDocumentoChange.asObservable();
  }

  setTipoDocumento(data: any){
    this.tipoDocumentoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
