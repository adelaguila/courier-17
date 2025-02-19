import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Abonado } from '../models/abonado';
import { Orden } from '../models/orden';
import { AbonadoOnt } from '../models/abonado-ont';

@Injectable({
    providedIn: 'root',
})
export class AbonadoOntService extends GenericService<AbonadoOnt> {
    private abonadoOntChange: Subject<AbonadoOnt[]> = new Subject<
        AbonadoOnt[]
    >();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/abonados-onts`);
    }

    getAbonadoOntChange() {
        return this.abonadoOntChange.asObservable();
    }

    setAbonadoOntChange(data: any) {
        this.abonadoOntChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }

    ontAsignadasAbonado(idAbonado: number): Observable<AbonadoOnt[]> {
        return this.http.get<AbonadoOnt[]>(
            `${environment.HOST}/abonados-onts/abonado/${idAbonado}`
        );
    }
}
