export class DSFacturacion {
    serie_documento: string;
    numero_documento: string;
    fecha_de_emision: string;
    hora_de_emision: string;
    codigo_tipo_operacion: string;
    codigo_tipo_documento: string;
    codigo_tipo_moneda: string;
    fecha_de_vencimiento: string;
    numero_orden_de_compra: string;
    informacion_adicional: string;
    documento_afectado: string[];

    codigo_tipo_nota: string;
    motivo_o_sustento_de_nota: string;
    datos_del_cliente_o_receptor: DataClienteReceptor;

    codigo_condicion_de_pago: string;

    cuotas: DataCuota[];
    totales: DataTotales;
    items: DataItem[];

}

export class DataClienteReceptor {
    codigo_tipo_documento_identidad: string;
    numero_documento: string;
    apellidos_y_nombres_o_razon_social: string;
    codigo_pais: string;
    direccion: string;
    ubigeo: string;
    correo_electronico:string;
    telefono: string;
}

export class DataCuota{
    fecha: string;
    codigo_tipo_moneda:string;
    monto:number;
}

export class DataTotales{
    total_exportacion: number;
    total_operaciones_gravadas: number;
    total_operaciones_inafectas: number;
    total_operaciones_exoneradas: number;
    total_operaciones_gratuitas: number;
    total_igv: number;
    total_impuestos: number;
    total_valor: number;
    total_venta: number;
}

export class DataItem{
    codigo_interno:string;
    descripcion:string;
    codigo_producto_sunat:string;
    codigo_producto_gsl:string;
    unidad_de_medida:string;
    cantidad:number;
    valor_unitario:number;
    codigo_tipo_precio:string;
    precio_unitario:number;
    codigo_tipo_afectacion_igv:string;
    total_base_igv:number;
    porcentaje_igv:number;
    total_igv:number;
    total_impuestos:number;
    total_valor_item:number;
    total_item:number;
}
