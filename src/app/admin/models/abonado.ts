import { CajaNap } from "./cajaNap";
import { Orden } from "./orden";
import { Plan } from "./plan";
import { Sector } from "./sector";
import { Tercero } from "./tercero";
import { Via } from "./via";

export class Abonado {
    idAbonado: number = 0;
    tercero!: Tercero;
    sector!: Sector;
    via!: Via;
    numero: string = "";
    referencia: string = "";
    suministro: string = "";
    cajaNap!: CajaNap;
    plan!: Plan;
    fechaRegistro!: string;
    fechaActivacion!: string;
    fechaUltimaLiquidacion!: string;
    latitud!: number;
    longitud!: number;
    idUsuarioRegistro!: number;
    idUsuarioModificacion!: number;
    foto!: string;
    estado!: string;
    deuda!: number;
    saldoFavor!: number;
    vendedor!: number;
    ordenes!: Orden[];
}
