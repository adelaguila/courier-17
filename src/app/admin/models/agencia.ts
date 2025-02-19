import { TipoAgencia } from "./tipo-agencia";
import { Ubigeo } from "./ubigeo";

export class Agencia{
  idAgencia: number;
  codigo: string = '';
  nombreAgencia: string = '';
  nombreAgente: string = '';
  dniAgente: string = '';
  direccion: string = '';
  telefono: string = '';
  correo: string = '';
  latitud: string = '';
  longitud: string = '';
  mapa: string = '';
  ubigeo: Ubigeo;
  tipoAgencia: TipoAgencia;
  activo: boolean = true;
}
