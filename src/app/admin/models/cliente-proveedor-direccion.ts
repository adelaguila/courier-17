import { ClienteProveedor } from "./cliente-proveedor";
import { Ubigeo } from "./ubigeo";

export class ClienteProveedorDireccion{
  idClienteProveedorDireccion: number = 0;
  clienteProveedor!: ClienteProveedor;
  direccion: string = '';
  ubigeo!: Ubigeo;
}
