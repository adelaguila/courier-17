import { ClienteProveedor } from "./cliente-proveedor";
import { Ubigeo } from "./ubigeo";

export class ClienteProveedorDireccion{
  idClienteProveedorDireccion: number;
  clienteProveedor!: ClienteProveedor;
  direccion: string = '';
  ubigeo!: Ubigeo;
}
