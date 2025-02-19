import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Observable, Subject, map } from "rxjs";
import { Tercero } from "../models/tercero";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { TerceroDireccion } from "../models/tercero-direccion";
import { AlmacenMovimiento } from "../models/almacen-movimiento";
import { AlmacenMovimientoItem } from "../models/almacen-movimiento-item";

@Injectable({
    providedIn: "root",
})
export class AlmacenMovimientoService extends GenericService<AlmacenMovimiento> {
    private almacenChange: Subject<AlmacenMovimiento[]> = new Subject<AlmacenMovimiento[]>();
    private almacenItemChange: Subject<AlmacenMovimientoItem[]> = new Subject<AlmacenMovimientoItem[]>();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/almacen`);
    }

    asignadasOntDirecta(almacen: AlmacenMovimiento, idAbonado: number){
        return this.http.post(`${environment.HOST}/almacen/asignacionDirectaOnt/${idAbonado}`, almacen)
      }

    getAlmacenChange() {
        return this.almacenChange.asObservable();
    }

    setAlmacenChange(data: any) {
        this.almacenChange.next(data);
    }

    getAlmacenItemChange() {
        return this.almacenChange.asObservable();
    }

    setAlmacenItemChange(data: any) {
        this.almacenItemChange.next(data);
    }


    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }
}
