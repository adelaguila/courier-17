import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoEnvio } from '../models/tipo-envio';

@Injectable({
    providedIn: 'root',
})
export class TipoEnvioService extends GenericService<TipoEnvio> {
    private tipoEnvioChange: Subject<TipoEnvio[]> = new Subject<
        TipoEnvio[]
    >();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/tipos-envios`);
    }

    getTipoEnvioChange() {
        return this.tipoEnvioChange.asObservable();
    }

    setTipoEnvioChange(data: any) {
        this.tipoEnvioChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }
}
