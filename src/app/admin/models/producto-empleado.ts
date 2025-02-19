import { Ont } from "./ont";
import { Producto } from "./producto";
import { User } from "./user";

export class ProductoEmpleado{
  idProductoEmpleado: number;
  producto: Producto;
  empledado: User;
  stock: number;
}
