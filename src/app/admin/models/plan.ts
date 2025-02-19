import { PlanServicio } from "./plan-servicio";

export class Plan{
  idPlan: number = 0;
  nombrePlan: string = '';
  precioDia: number = 0;
  precioMes: number = 0;
  estado: string = '';
  usaOnu: number = 0;
  servicios!: PlanServicio[]
}
