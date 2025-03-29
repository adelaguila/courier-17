import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoPago } from '../models/tipo-pago';

@Injectable({
    providedIn: 'root',
})
export class TipoPagoService extends GenericService<TipoPago> {
    private tipoPagoChange: Subject<TipoPago[]> = new Subject<
        TipoPago[]
    >();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/tipos-pagos`);
    }

    getTipoPagoChange() {
        return this.tipoPagoChange.asObservable();
    }

    setTipoPagoChange(data: any) {
        this.tipoPagoChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }
}
