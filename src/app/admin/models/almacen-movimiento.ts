import { AlmacenMovimientoItem } from "./almacen-movimiento-item";
import { Tercero } from "./tercero";
import { User } from "./user";

export class AlmacenMovimiento{
  idAlmacenMovimiento: number = 0;
  fecha: string = '';
  tipoMovimiento: string = '';
  documento: string = '';
  referencia: string = '';
  tercero!: Tercero;
  tecnico!: User;
  clienteProveedor: string = '';
  items!: AlmacenMovimientoItem[]
}
