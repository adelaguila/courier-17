import { AgenciaDestino } from './agencia-destino';
import { ClienteProveedor } from './cliente-proveedor';
import { ClienteProveedorArea } from './cliente-proveedor-area';
import { TipoEnvio } from './tipo-envio';
import { TipoServicio } from './tipo-servicio';
import { Ubigeo } from './ubigeo';
export class Tarifario{
  idTarifario: number;
  clienteProveedor!: ClienteProveedor;
  clienteProveedorArea!: ClienteProveedorArea;
  origen: Ubigeo;
  destino: AgenciaDestino;
  tipoServicio: TipoServicio;
  tipoEnvio: TipoEnvio;
  pesoCondicional: number = 0;
  tarifaMinima: number  = 0;
  tarifaExeso: number = 0;
  pesoMinimo: number = 1;
  collect: boolean = false;
}
