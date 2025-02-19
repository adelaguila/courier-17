import { Abonado } from "./abonado";
import { Cargo } from "./cargo";
import { Comprobante } from "./comprobante";
import { CuentaBancaria } from "./cuenta-bancaria";
import { Tercero } from "./tercero";

export class Pago{
  idPago: number = 0;
  abonado: Abonado;
  fechaPago: string = '';
  referencia: string = '';
  tipoPago: string = '';
  cuentaBancaria?: CuentaBancaria;
  total: number;
  userRegistro: number;
  userCobrador: number;
  serie?: string;
  numero?: number;
}
