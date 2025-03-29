import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Observable, Subject, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ClienteProveedor } from "../models/cliente-proveedor";
import { ClienteProveedorDireccion } from "../models/cliente-proveedor-direccion";
import { ClienteProveedorArea } from "../models/cliente-proveedor-area";


@Injectable({
    providedIn: "root",
})
export class ClienteProveedorService extends GenericService<ClienteProveedor> {
    private clienteProveedorChange: Subject<ClienteProveedor[]> = new Subject<ClienteProveedor[]>();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/clientes-proveedores`);
    }

    getByDniRuc(dniruc: string) {
        return this.http.get<ClienteProveedor>(`${this.url}/numero-documento-identidad/${dniruc}`);
    }

    updateDireccion(id: number, clienteProveedorDireccion: ClienteProveedorDireccion) {
        return this.http.put(`${this.url}/direccion/${id}`, clienteProveedorDireccion);
    }

    deleteDireccion(id: number) {
        return this.http.delete(`${this.url}/direccion/${id}`);
    }

    updateArea(id: number, clienteProveedorArea: ClienteProveedorArea) {
        return this.http.put(`${this.url}/area/${id}`, clienteProveedorArea);
    }

    deleteArea(id: number) {
        return this.http.delete(`${this.url}/area/${id}`);
    }

    getClienteProveedorChange() {
        return this.clienteProveedorChange.asObservable();
    }

    setClienteProveedorChange(data: any) {
        this.clienteProveedorChange.next(data);
    }

    autocomplete(term: string): Observable<ClienteProveedor[]> {
        return this.http.get<ClienteProveedor[]>(`${environment.HOST}/clientes-proveedores/autocomplete/${term}`)
        .pipe(
            map(response => {
                return response.map(clienteProveedor =>{
                    clienteProveedor.doiNombreClienteProveedor = `${clienteProveedor.numeroDocumentoIdentidad} - ${clienteProveedor.nombreRazonSocial}`
                    return clienteProveedor;
                });
            })
        );
      }

    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }
}
