import { Facturacion } from "./facturacion";

export class FacturacionItem {

    idFacturacionItem: number = 0;
    facturacion?: Facturacion;
    glosa: string;
    cantidad: number = 0;
    precio: number = 0;
    subtotal: number = 0;
    igv: number = 0;
    total: number = 0;
    referencia!: string;
    idProducto!: number;
    series: string;
}
