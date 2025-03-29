import { ClienteProveedor } from "./cliente-proveedor";

export class ClienteProveedorArea{
  idClienteProveedorArea: number;
  clienteProveedor!: ClienteProveedor;
  area: string = '';
  contacto: string = '';
  telefonoContacto: string = '';
  emailContacto: string = '';
}
