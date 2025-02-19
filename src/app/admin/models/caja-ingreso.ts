import { TipoIngreso } from "./tipo-ingreso";

export class CajaIngreso{
  idCajaIngreso: number = 0;
  fecha: string = '';
  tipoIngreso: TipoIngreso;
  documento: string = '';
  cliente: string = '';
  glosa: string = '';
  importe: number;
  userRegistro: number;
  idCierre: number;
}
