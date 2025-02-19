import { TipoIngreso } from "./tipo-ingreso";

export class CajaMovimiento{
  id: number = 0;
  fecha: string = '';
  tipoMovimiento: string = '';
  tipoPago: string = '';
  documento: string = '';
  clienteProveedor: string = '';
  glosa: string = '';
  partida: string = '';
  importe: number;
  userRegistro: number;
  idCierre: number;
}
