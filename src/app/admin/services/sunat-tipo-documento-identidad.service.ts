import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';
import { SunatTipoDocumentoIdentidad } from '../models/sunat-tipo-documento-identidad';


@Injectable({
  providedIn: 'root'
})
export class SunatTipoDocumentoIdentidadService extends GenericService<SunatTipoDocumentoIdentidad>{

  private sunatTipoDocumentoIdentidadChange: Subject<SunatTipoDocumentoIdentidad[]> = new Subject<SunatTipoDocumentoIdentidad[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ) {
    super(http, `${environment.HOST}/sunat-tipos-documentos-identidad`);
  }

  getSunatTipoDocumentoIdentidadChange(){
    return this.sunatTipoDocumentoIdentidadChange.asObservable();
  }

  setSunatTipoDocumentoIdentidadChange(data: any){
    this.sunatTipoDocumentoIdentidadChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
