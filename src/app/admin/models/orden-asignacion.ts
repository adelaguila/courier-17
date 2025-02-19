import { Orden } from "./orden";
import { OrdenAsignacionOnt } from "./orden-asignacion-ont";
import { OrdenAsignacionProducto } from "./orden-asignacion-producto";
import { User } from "./user";

export class OrdenAsignacion{
  idOrdenAsignacion: number = 0;
  orden: Orden;
  user: User;
  fechaAsignacion: string = '';
  fechaAtencion: string = '';
  reporte: string = '';
  productosUtilizados!: OrdenAsignacionProducto[]
  onts!: OrdenAsignacionOnt[]
}
