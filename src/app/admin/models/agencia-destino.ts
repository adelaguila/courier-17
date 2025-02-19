import { Agencia } from "./agencia";
import { TipoAgencia } from "./tipo-agencia";
import { Ubigeo } from "./ubigeo";

export class AgenciaDestino{
  idAgenciaDestino: number;
  agencia: Agencia;
  ubigeo: Ubigeo;
  destino: string = '';
  adicionalEntrega: number = 0;
  adicionalRecojo: number = 0;
  aceptaCollec: boolean = false;
}
