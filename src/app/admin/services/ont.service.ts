import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Ont } from '../models/ont';
import { map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OntService extends GenericService<Ont>{

  private ontChange: Subject<Ont[]> = new Subject<Ont[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/onts`);
  }

  getByEstado(estado: string): Observable<Ont[]> {
    return this.http.get<Ont[]>(`${environment.HOST}/onts/estado/${estado}`).pipe(
            map(response => {
                return response.map(ont =>{
                    ont.serieMarca = `${ont.serie} - ${ont.producto.nombreProducto}`
                    return ont;
                });
            })
        );;
  }

  getBySerie(serie: string) {
    return this.http.get<Ont>(`${this.url}/checkSerie/${serie}`);
}

  getOntChange(){
    return this.ontChange.asObservable();
  }

  setOntChange(data: any){
    this.ontChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
