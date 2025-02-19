import { ClienteProveedor } from "./cliente-proveedor";
import { TerceroDireccion } from "./tercero-direccion";

export class ClienteProveedorArea{
  idClienteProveedorArea: number = 0;
  clienteProveedor!: ClienteProveedor;
  area: string = '';
  contacto: string = '';
  telefonoContacto: string = '';
  emailContacto: string = '';
}
