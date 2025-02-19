import { Tercero } from "./tercero";
import { Ubigeo } from "./ubigeo";

export class TerceroDireccion{
  idTerceroDireccion: number = 0;
  tercero!: Tercero;
  direccion: string = '';
  ubigeo!: Ubigeo;
}
