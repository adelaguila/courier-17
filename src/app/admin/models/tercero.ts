import { TerceroDireccion } from "./tercero-direccion";

export class Tercero{
  idTercero: number = 0;
  dniruc: string = '';
  nombreTercero: string = '';
  telefono1: string = '';
  telefono2: string = '';
  correoElectronico: string = '';
  direcciones!: TerceroDireccion[]
  dnirucNombreTercero?: string = '';
}
