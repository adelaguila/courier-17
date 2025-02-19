import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Via } from '../models/via';

@Injectable({
  providedIn: 'root'
})
export class ViaService extends GenericService<Via>{

  private viaChange: Subject<Via[]> = new Subject<Via[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient,
  ){
    super(http, `${environment.HOST}/vias`);
  }

  getViaChange(){
    return this.viaChange.asObservable();
  }

  setViaChange(data: any){
    this.viaChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
