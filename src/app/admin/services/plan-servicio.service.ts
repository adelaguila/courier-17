import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PlanServicio } from '../models/plan-servicio';


@Injectable({
  providedIn: 'root'
})
export class PlanServicioService extends GenericService<PlanServicio>{

  private planChange: Subject<PlanServicio[]> = new Subject<PlanServicio[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/planes-servicios`);
  }

  getPlanServicioChange(){
    return this.planChange.asObservable();
  }

  setPlanServicioChange(data: any){
    this.planChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
