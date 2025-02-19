import { TipoEgreso } from "./tipo-egreso";


export class CajaEgreso{
  idCajaEgreso: number = 0;
  fecha: string = '';
  tipoEgreso: TipoEgreso;
  documento: string = '';
  proveedor: string = '';
  glosa: string = '';
  importe: number;
  userRegistro: number;
  idCierre: number;
}
