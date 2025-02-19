import { ClienteProveedorArea } from './cliente-proveedor-area';
import { ClienteProveedorDireccion } from './cliente-proveedor-direccion';
import { SunatTipoDocumentoIdentidad } from './sunat-tipo-documento-identidad';
import { TipoClienteProveedor } from './tipo-cliente-proveedor';

export class ClienteProveedor {
    idClienteProveedor: number = 0;
    tipoDocumentoIdentidad!: SunatTipoDocumentoIdentidad;
    numeroDocumentoIdentidad: string = '';
    nombreRazonSocial: string = '';
    telefono: string = '';
    correo: string = '';
    tipoClienteProveedor!: TipoClienteProveedor;
    activo: boolean = true;
    direcciones!: ClienteProveedorDireccion[];
    areas!: ClienteProveedorArea[];
    doiNombreClienteProveedor: string = '';
}
