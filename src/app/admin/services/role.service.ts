import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';
import { Role } from '../models/role';


@Injectable({
  providedIn: 'root'
})
export class RoleService extends GenericService<Role> {

  private roleChange: Subject<Role[]> = new Subject<Role[]>();
  private messageChange: Subject<any> = new Subject<any>();

  constructor(
    protected override http: HttpClient
  ) {
    super(http, `${environment.HOST}/roles`);
  }

  getRole(){
    return this.roleChange.asObservable();
  }

  setRole(data: any){
    this.roleChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: any){
    this.messageChange.next(data);
  }
}
