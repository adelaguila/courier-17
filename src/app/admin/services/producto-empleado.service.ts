import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductoEmpleado } from '../models/producto-empleado';

@Injectable({
  providedIn: 'root'
})
export class ProductoEmpleadoService extends GenericService<ProductoEmpleado>{

  private productoEmpleadoChange: Subject<ProductoEmpleado[]> = new Subject<ProductoEmpleado[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/productos-empleados`);
  }

  getByEmpleado(idUser: number): Observable<ProductoEmpleado[]> {
    return this.http.get<ProductoEmpleado[]>(`${environment.HOST}/productos-empleados/idUser/${idUser}`);
  }

  getByEmpleadoInsumos(idUser: number): Observable<ProductoEmpleado[]> {
    return this.http.get<ProductoEmpleado[]>(`${environment.HOST}/productos-empleados/insumos/idUser/${idUser}`);
  }


  devolver(productoEmpleado: ProductoEmpleado){
    return this.http.post(`${environment.HOST}/productos-empleados/devolver`, productoEmpleado);
  }

  getProductoEmpleadoChange(){
    return this.productoEmpleadoChange.asObservable();
  }

  setProductoEmpleadoChange(data: any){
    this.productoEmpleadoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
