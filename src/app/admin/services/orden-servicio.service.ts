import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrdenServicio } from '../models/orden-servicio';

@Injectable({
    providedIn: 'root',
})
export class OrdenServicioService extends GenericService<OrdenServicio> {
    private ordenServicioChange: Subject<OrdenServicio[]> = new Subject<
        OrdenServicio[]
    >();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/ordenes-servicios`);
    }

    getFechaHoraRegistroBetween(inicio: string, fin: string) {
        return this.http.get(
            `${environment.HOST}/ordenes-servicios/fecha-registro/${inicio}/${fin}`
        );
    }

    getOrdenServicioChange() {
        return this.ordenServicioChange.asObservable();
    }

    setOrdenServicioChange(data: any) {
        this.ordenServicioChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }
}
