import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoClienteProveedor } from '../models/tipo-cliente-proveedor';

@Injectable({
  providedIn: 'root'
})
export class TipoClienteProveedorService extends GenericService<TipoClienteProveedor> {

  private tipoClienteProveedorChange: Subject<TipoClienteProveedor[]> = new Subject<TipoClienteProveedor[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/tipos-clientes-proveedores`);
  }


  getTipoClienteProveedorChange(){
    return this.tipoClienteProveedorChange.asObservable();
  }

  setTipoClienteProveedorChange(data: any){
    this.tipoClienteProveedorChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
