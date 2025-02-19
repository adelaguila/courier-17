import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Abonado } from '../models/abonado';
import { Orden } from '../models/orden';

@Injectable({
    providedIn: 'root',
})
export class AbonadoService extends GenericService<Abonado> {
    private abonadoChange: Subject<Abonado[]> = new Subject<Abonado[]>();
    private ordenChange: Subject<Orden[]> = new Subject<Orden[]>();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/abonados`);
    }

    getAbonadoChange() {
        return this.abonadoChange.asObservable();
    }

    setAbonadoChange(data: any) {
        this.abonadoChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }

    getOrdenChange() {
        return this.ordenChange.asObservable();
    }

    setOrdenChange(data: any) {
        this.ordenChange.next(data);
    }

    imprimirCuentaCorriente(abonado: Abonado) {
        return this.http.get(
            `${environment.HOST}/abonados/imprimirCuentaCorriente/${abonado.idAbonado}`,
            { responseType: 'blob' }
        );
    }

    imprimirAvisoCobranza(abonados: Abonado[]) {
        let lista: number[] = [];
        abonados.map((e) => {
            lista.push(e.idAbonado);
        });
        return this.http.get(
            `${environment.HOST}/abonados/imprimirAvisoCobranza/${lista}`,
            { responseType: 'blob' }
        );
    }

    autocomplete(term: string): Observable<Abonado[]> {
        return this.http
            .get<Abonado[]>(`${environment.HOST}/abonados/autocomplete/${term}`)
            .pipe(
                map((response) => {
                    return response.map((abonado) => {
                        return abonado;
                    });
                })
            );
    }

    listaPorEstado(estado: string): Observable<Abonado[]> {
        return this.http
            .get<Abonado[]>(`${environment.HOST}/abonados/estado/${estado}`)
            .pipe(
                map((response) => {
                    return response.map((abonado) => {
                        return abonado;
                    });
                })
            );
    }

    morosos(idSector: number): Observable<Abonado[]> {
        return this.http
            .get<Abonado[]>(`${environment.HOST}/abonados/morosos/${idSector}`)
            .pipe(
                map((response) => {
                    return response.map((abonado) => {
                        return abonado;
                    });
                })
            );
    }

    porCobrar(meses: string): Observable<Abonado[]> {
        return this.http
            .get<Abonado[]>(`${environment.HOST}/abonados/porCobrar/${meses}`)
            .pipe(
                map((response) => {
                    return response.map((abonado) => {
                        return abonado;
                    });
                })
            );
    }

    listaImprimirAvisosCobranzas(): Observable<Abonado[]> {
        return this.http
            .get<Abonado[]>(
                `${environment.HOST}/abonados/listaImprimirAvisoCobranza`
            )
            .pipe(
                map((response) => {
                    return response.map((abonado) => {
                        return abonado;
                    });
                })
            );
    }

    reporteMorososTipoSector(tipo: string, idSector: number) {
        if (tipo == 'PDF') {
            return this.http.get(
                `${environment.HOST}/abonados/reporteAbonadosMorososSectorPdf/${idSector}`,
                { responseType: 'blob' }
            );
        } else {
            return this.http.get(
                `${environment.HOST}/abonados/reporteAbonadosMorososSectorExcel/${idSector}`,
                { responseType: 'blob' }
            );
        }
    }

    reportePorCobrar(tipo: string, meses: string) {
        if (tipo == 'PDF') {
            return this.http.get(
                `${environment.HOST}/abonados/reportePorCobrarPdf/${meses}`,
                { responseType: 'blob' }
            );
        } else {
            return this.http.get(
                `${environment.HOST}/abonados/reportePorCobrarExcel/${meses}`,
                { responseType: 'blob' }
            );
        }
    }

    reporteAbonadosEstadoTodos() {
        return this.http.get(
            `${environment.HOST}/abonados/reporteAbonadosTodos`,
            { responseType: 'blob' }
        );
    }
}
