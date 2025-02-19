import { Orden } from "../models/orden";
import { User } from "../models/user";

export class OrdenAsignarVariosDTO{
    user: User;
    fecha: string;
    ordenes: Orden[];
  }
