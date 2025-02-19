import { Abonado } from "./abonado";
import { Cargo } from "./cargo";
import { Comprobante } from "./comprobante";
import { CuentaBancaria } from "./cuenta-bancaria";
import { Tercero } from "./tercero";

export class PagoGeneraComprobante{
  comprobante?: Comprobante;
  tercero?: Tercero;
}
