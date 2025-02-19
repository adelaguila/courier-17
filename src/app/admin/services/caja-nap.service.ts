import { Injectable } from '@angular/core';
import { CajaNap } from '../models/cajaNap';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CajaNapService extends GenericService<CajaNap> {

  private cajaNapChange: Subject<CajaNap[]> = new Subject<CajaNap[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/cajas-nap`);
  }

  getCajaNapChange(){
    return this.cajaNapChange.asObservable();
  }

  setCajaNapChange(data: any){
    this.cajaNapChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
