import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AlmacenMovimiento } from "../models/almacen-movimiento";
import { AlmacenMovimientoItem } from "../models/almacen-movimiento-item";

@Injectable({
    providedIn: "root",
})
export class AlmacenMovimientoItemService extends GenericService<AlmacenMovimientoItem> {
    private almacenItemChange: Subject<AlmacenMovimientoItem[]> = new Subject<AlmacenMovimientoItem[]>();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/almacen-item`);
    }


    getAlmacenItemChange() {
        return this.almacenItemChange.asObservable();
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
