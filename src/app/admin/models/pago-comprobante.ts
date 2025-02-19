import { Abonado } from "./abonado";
import { Cargo } from "./cargo";
import { Comprobante } from "./comprobante";
import { CuentaBancaria } from "./cuenta-bancaria";
import { Pago } from "./pago";
import { PagoGeneraComprobante } from "./pago-genera-comprobante";
import { Tercero } from "./tercero";

export class PagoComprobante{
  pago: Pago;
  pagoGeneraComprobante?: PagoGeneraComprobante;

}
