import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CierreCaja } from '../models/cierre-caja';
import { CierreCajaDetalle } from '../models/cierre-caja-detalle';
import { CajaMovimiento } from '../models/caja-movimiento';

@Injectable({
    providedIn: 'root',
})
export class CierreCajaService extends GenericService<CierreCaja> {
    private cierreCajaChange: Subject<CierreCaja[]> = new Subject<
        CierreCaja[]
    >();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/cierre-caja`);
    }

    getCierreCajaChange() {
        return this.cierreCajaChange.asObservable();
    }

    detallesCierreAbiertosFecha(
        fecha: string
    ): Observable<CierreCajaDetalle[]> {
        return this.http.get<CierreCajaDetalle[]>(
            `${environment.HOST}/cierre-caja/abiertos/${fecha}`
        );
    }

    movimientosFecha(fecha: string): Observable<CajaMovimiento[]> {
        return this.http.get<CajaMovimiento[]>(
            `${environment.HOST}/cierre-caja/movimientos/${fecha}`
        );
    }

    exportarMovimientosPorFecha(fecha: string) {
        return this.http.get(
            `${environment.HOST}/cierre-caja/exportar-movimientos/${fecha}`,
            { responseType: 'blob' }
        );
    }
    setCierreCajaChange(data: any) {
        this.cierreCajaChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }
}
