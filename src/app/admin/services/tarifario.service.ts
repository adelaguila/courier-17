import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tarifario } from '../models/tarifario';

@Injectable({
    providedIn: 'root',
})
export class TarifarioService extends GenericService<Tarifario> {
    private tarifarioChange: Subject<Tarifario[]> = new Subject<
        Tarifario[]
    >();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/tarifarios`);
    }

    getTarifaGeneral(): Observable<Tarifario[]> {
        return this.http.get<Tarifario[]>(`${environment.HOST}/tarifarios/general`);
    }

    getTarifaCliente(id: number): Observable<Tarifario[]> {
        return this.http.get<Tarifario[]>(`${environment.HOST}/tarifarios/cliente/${id}`);
    }

    getTarifarioChange() {
        return this.tarifarioChange.asObservable();
    }

    setTarifarioChange(data: any) {
        this.tarifarioChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }
}
