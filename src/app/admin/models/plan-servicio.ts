import { Plan } from "./plan";
import { Servicio } from "./servicio";

export class PlanServicio{
  idPlanServicio: number = 0;
  plan!: Plan;
  servicio!: Servicio;
  precioDia: number = 0;
  precioMes: number = 0;
}
