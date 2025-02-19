import { AlmacenMovimiento } from "./almacen-movimiento";
import { Producto } from './producto';

export class AlmacenMovimientoItem{
  idAlmacenMovimientoItem: number = 0;
  almacenMovimiento!: AlmacenMovimiento;
  producto: Producto;
  cantidad: number = 0;
  precioUnitario: number = 0;
  series: string;
}
