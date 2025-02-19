import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

import { Facturacion } from "../models/facturacion";

@Injectable({
    providedIn: "root",
})
export class FacturacionService extends GenericService<Facturacion> {
    private facturacionChange: Subject<Facturacion[]> = new Subject<Facturacion[]>();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/facturacion`);
    }

    anularComprobante(data: any) {
        return this.http.post(`${environment.HOST}/facturacion/anular-comprobante`, data);
    }

    notaCredito(data: any) {
        return this.http.post(`${environment.HOST}/facturacion/nota-credito`, data);
    }

    reenviarSunat(idFacturacion: number) {
        return this.http.post(`${environment.HOST}/facturacion/reenviar-sunat/${idFacturacion}`,null);
    }

    imprimir(idFacturacion: number, formato: string) {
        return this.http.get(
            `${environment.HOST}/facturacion/imprimirComprobante/${idFacturacion}/${formato}`,
            { responseType: "blob" }
        );
    }

    getFacturacionChange() {
        return this.facturacionChange.asObservable();
    }

    setFacturacionChange(data: any) {
        this.facturacionChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }
}
