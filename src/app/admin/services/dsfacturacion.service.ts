import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DSFacturacion } from '../models/dsfacturacion';

// const token_apimigo = environment.token_apimigo;

@Injectable({
    providedIn: 'root',
})
export class DSFacturacionService {
    constructor(protected http: HttpClient) {}

    generarJsonComprobante(idComprobante: number): Observable<DSFacturacion> {
        return this.http.get<DSFacturacion>(
            `${environment.HOST}/dsfacturacion/${idComprobante}`
        );
    }

    //   async consultarRUC(ruc: string) {
    //     try {
    //       const options = {
    //         method: 'POST',
    //         headers: {
    //           accept: 'application/json',
    //           'content-type': 'application/json',
    //         },
    //         body: JSON.stringify({ token: token_apimigo, ruc: ruc }),
    //       };

    //       const resp = await fetch('https://api.migo.pe/api/v1/ruc', options);
    //       const datos = await resp.json();
    //       return datos;

    //     } catch (error) {
    //       console.log('Servicio ', error);
    //       return false;
    //     }
    //   }

    //   async consultarDNI(dni: string) {
    //     try {
    //       const options = {
    //         method: 'POST',
    //         headers: {
    //           accept: 'application/json',
    //           'content-type': 'application/json',
    //         },
    //         body: JSON.stringify({ token: token_apimigo, dni: dni }),
    //       };

    //       const resp = await fetch('https://api.migo.pe/api/v1/dni', options);
    //       const datos = await resp.json();
    //       return datos;

    //     } catch (error) {
    //       console.log('Servicio ', error);
    //       return false;
    //     }
    //   }
}
