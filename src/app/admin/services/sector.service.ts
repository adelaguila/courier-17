import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sector } from '../models/sector';

@Injectable({
  providedIn: 'root'
})
export class SectorService extends GenericService<Sector> {

  private sectorChange: Subject<Sector[]> = new Subject<Sector[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ){
    super(http, `${environment.HOST}/sectores`);
  }

  getSectorChange(){
    return this.sectorChange.asObservable();
  }

  setSectorChange(data: any){
    this.sectorChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
