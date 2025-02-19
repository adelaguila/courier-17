export class MatriculaDTO{
  idMatricula: number;
  periodoAcademico: string;
  ciclo: string;
  unidadesDidacticas: UnidadDidacticaDTO[];
}

export class UnidadDidacticaDTO {
  unidadDidactica: string;
  promedio: number;
  creditos: number;
  actividadesAprendizaje: ActividadAprendizajeDTO[];
}

export class ActividadAprendizajeDTO{
  actividadAprendizaje: string;
  nota: number;
}
