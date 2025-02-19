import { FacturacionItem } from "./facturacion-item";
import { Tercero } from "./tercero";
import { TerceroDireccion } from "./tercero-direccion";


export class Facturacion {
    idFacturacion: number = 0;
    tercero!: Tercero;
    fecha: string;
    tipoDocumento: string;
    serie: string;
    numero: number;
    pigv: number;
    subtotal: number;
    igv: number;
    total: number;
    fechaPago!: string;
    directo: number;
    referencia: string;
    ordenCompra: string;
    linkXml: string;
    linkPdf: string;
    linkCdr: string;
    externalId: string;
    documentoAfectado: string;
    notaCodigo: string;
    notaMotivo: string;
    hash: string;
    idPago: number;
    tipoPago: string;
    fechaVencimiento: string;
    tipoMoneda: string;
    respuestaCdr: string;
    idTerceroDireccion: number;
    idAbonado: number;
    estado: string;
    externalIdResumen?:string;
    ticket?:string;

    items?: FacturacionItem[]

}
