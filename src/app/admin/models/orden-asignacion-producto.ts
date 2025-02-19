import { OrdenAsignacion } from "./orden-asignacion";
import { Producto } from "./producto";

export class OrdenAsignacionProducto{
  idOrdenAsignacionProducto: number = 0;
  ordenAsignacion: OrdenAsignacion;
  producto: Producto;
  cantidad: number;
}
