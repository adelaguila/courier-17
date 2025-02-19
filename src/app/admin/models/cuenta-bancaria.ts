import { Banco } from "./banco";
import { Moneda } from "./moneda";

export class CuentaBancaria{
  numeroCuenta: string = '';
  banco: Banco;
  moneda: Moneda;
  descripcion: string = '';
  cci: string = '';
  saldoInicial: number = 0;
}
