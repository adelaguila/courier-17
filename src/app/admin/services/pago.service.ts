import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Pago } from "../models/pago";
import { PagoComprobante } from "../models/pago-comprobante";
import { NotfoundModule } from "../notfound/notfound.module";

@Injectable({
    providedIn: "root",
})
export class PagoService extends GenericService<Pago> {
    private cargoChange: Subject<Pago[]> = new Subject<Pago[]>();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/pagos`);
    }

    getPagosIdAbonado(idAbonado: number) {
        return this.http.get(`${environment.HOST}/pagos/abonado/${idAbonado}`);
    }

    getFechaPagoBetween(inicio: string, fin: string) {
        return this.http.get(`${environment.HOST}/pagos/rango/${inicio}/${fin}`);
    }

    getFechaPagoBetweenAndUserCobrador(inicio: string, fin: string, idCobrador: number){
        return this.http.get(`${environment.HOST}/pagos/por-cobrador/${inicio}/${fin}/${idCobrador}`);
    }

    exportarPorFecha(inicio: string, fin: string) {
        return this.http.get(`${environment.HOST}/pagos/exportar-pagos-por-fecha/${inicio}/${fin}`, {responseType: "blob"});

    }

    exportarPorFechaCobrador(inicio: string, fin: string, idCobrador: number) {
        return this.http.get(`${environment.HOST}/pagos/exportar-por-fecha-cobrador/${inicio}/${fin}/${idCobrador}`, {responseType: "blob"});

    }

    imprimirPago(idPago: number) {
        return this.http.get(
            `${environment.HOST}/pagos/imprimirPago/${idPago}`,
            { responseType: "blob" }
        );
    }

    savePagoComprobante(pagoComprobante: PagoComprobante) {
        return this.http.post(`${environment.HOST}/pagos`, pagoComprobante);
    }

    getPagoChange() {
        return this.cargoChange.asObservable();
    }

    setPagoChange(data: any) {
        this.cargoChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }
}
