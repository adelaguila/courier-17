import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject, map } from 'rxjs';
import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment';
import { Ubigeo } from '../models/ubigeo';

@Injectable({
  providedIn: 'root',
})
export class UbigeoService extends GenericService<Ubigeo> {

  private ubigeoChange: Subject<Ubigeo[]> = new Subject<Ubigeo[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/ubigeos`);
  }

  autocomplete(term: string): Observable<Ubigeo[]> {
    return this.http.get<Ubigeo[]>(`${environment.HOST}/ubigeos/autocomplete/${term}`)
    .pipe(
        map(response => {
            return response.map(ubigeo =>{
                ubigeo.nombreUbigeo = `${ubigeo.distrito} - ${ubigeo.provincia} - ${ubigeo.departamento}`
                return ubigeo;
            });
        })
    );
  }

  getUbigeoChange(){
    return this.ubigeoChange.asObservable();
  }

  setUbigeoChange(data: any){
    this.ubigeoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
