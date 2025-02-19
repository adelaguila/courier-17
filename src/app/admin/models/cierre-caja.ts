import { CierreCajaDetalle } from "./cierre-caja-detalle";
import { User } from "./user";

export class CierreCaja{
  idCierreCaja: number = 0;
  fecha: string = '';
  user!: User;
  detalles!: CierreCajaDetalle[]
}
