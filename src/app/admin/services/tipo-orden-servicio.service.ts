import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoOrdenServicio } from '../models/tipo-orden-servicio';

@Injectable({
    providedIn: 'root',
})
export class TipoOrdenServicioService extends GenericService<TipoOrdenServicio> {
    private tipoOrdenServicioChange: Subject<TipoOrdenServicio[]> = new Subject<
        TipoOrdenServicio[]
    >();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/tipos-ordenes-servicios`);
    }

    getTipoOrdenServicioChange() {
        return this.tipoOrdenServicioChange.asObservable();
    }

    setTipoOrdenServicioChange(data: any) {
        this.tipoOrdenServicioChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }
}
