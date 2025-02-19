import { Abonado } from "./abonado";
import { Plan } from "./plan";
import { TipoOrden } from "./tipo-orden";

export class Orden{
  idOrden: number = 0;
  abonado: Abonado;
  tipoOrden: TipoOrden;
  detalle: string = '';
  fechaRegistro: string = '';
  fechaAsignacion: string = '';
  fechaAtencion: string = '';
  estado: string = '';
  plan: Plan;
  vendedor: number;
}
