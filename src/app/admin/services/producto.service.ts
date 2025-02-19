import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Plan } from '../models/plan';
import { Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends GenericService<Producto>{

  private productoChange: Subject<Producto[]> = new Subject<Producto[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/productos`);
  }

  autocomplete(term: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.HOST}/productos/autocomplete/${term}`);
  }

  getProductosControlSerie(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.HOST}/productos/controlSerie`)
  }

  getProductoChange(){
    return this.productoChange.asObservable();
  }

  setProductoChange(data: any){
    this.productoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
