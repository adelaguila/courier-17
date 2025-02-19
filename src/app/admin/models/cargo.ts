import { Abonado } from "./abonado";
import { Liquidacion } from "./liquidacion";
import { Plan } from "./plan";
import { TipoCargo } from "./tipo-cargo";

export class Cargo{
  idCargo: number = 0;
  abonado: Abonado;
  tipoCargo: TipoCargo;
  liquidacion!: Liquidacion;
  fechaEmision: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  fechaVencimiento: string = '';
  anio: number;
  periodo: string;
  tipo: number;
  plan: Plan;
  glosa: string;
  cantidad: number;
  precio: number;
  total: number;
  pagado: number;
}
