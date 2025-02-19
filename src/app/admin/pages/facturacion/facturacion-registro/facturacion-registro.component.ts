import { AsyncPipe, DatePipe, formatDate, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';

import { AddSeriesComponent } from '../../productos/add-series/add-series.component';
import { FacturacionOpcionesComponent } from '../facturacion-opciones/facturacion-opciones.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { Comprobante } from 'src/app/admin/models/comprobante';
import { TerceroDireccion } from 'src/app/admin/models/tercero-direccion';
import { Tercero } from 'src/app/admin/models/tercero';
import { FacturacionItem } from 'src/app/admin/models/facturacion-item';
import { FacturacionService } from 'src/app/admin/services/facturacion.service';
import { TerceroService } from 'src/app/admin/services/cliente-proveedor.service';
import { ComprobanteService } from 'src/app/admin/services/comprobante.service';
import { ProductoService } from 'src/app/admin/services/producto.service';
import { ConfiguracionService } from 'src/app/admin/services/configuracion.service';
import { Facturacion } from 'src/app/admin/models/facturacion';
import { Producto } from 'src/app/admin/models/producto';

interface TipoComprobante {
    code: string;
    name: string;
}

interface TipoVenta {
    code: string;
    name: string;
}

interface TipoPago {
    code: string;
    name: string;
}

interface Moneda {
    code: string;
    name: string;
}

@Component({
    selector: 'app-facturacion-registro',
    templateUrl: './facturacion-registro.component.html',
    styleUrls: ['./facturacion-registro.component.scss'],
    standalone: true,
    imports: [
        PrimengModule,
        PdfViewerModule,
        ReactiveFormsModule,
        RouterLink,
        NgIf,
        AsyncPipe,
        NgFor,
    ],
    providers: [MessageService, ConfirmationService, DialogService],
})
export class FacturacionRegistroComponent implements OnInit {
    @ViewChild('inputProducto') private autoCompleteProducto: AutoComplete;

    ref: DynamicDialogRef | undefined;

    form!: FormGroup;
    tiposComprobantes: TipoComprobante[] | undefined = [];
    tiposVentas: TipoVenta[] | undefined = [];
    tiposPagos: TipoPago[] | undefined = [];
    monedas: Moneda[] | undefined = [];
    series: Comprobante[] | undefined = [];
    seriesFiltrados: Comprobante[] | undefined = [];
    direcciones: TerceroDireccion[] | undefined = [];
    today = new Date();

    pigv: number = 0;

    fechaActual: any;
    pipe = new DatePipe('es-PE');

    productosFiltrados = [];
    tercerosFiltrados = [];

    tercero!: Tercero;

    tipoVenta: string = 'BIENES';

    items: FacturacionItem[] = [];

    constructor(
        private facturacionService: FacturacionService,
        private terceroService: TerceroService,
        private comprobanteService: ComprobanteService,
        private productoService: ProductoService,
        private configuracionService: ConfiguracionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public dialogService: DialogService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        // this.fechaActual = this.today;
        this.fechaActual = this.pipe.transform(this.today, 'YYYY-MM-dd');
        console.log(this.fechaActual);

        this.tiposComprobantes = [
            { code: '01', name: 'FACTURA ELECTRÓNICA' },
            { code: '03', name: 'BOLETA DE VENTA ELECTRÓNICA' },
        ];

        this.tiposVentas = [
            { code: 'BIENES', name: 'BIENES' },
            { code: 'SERVICIOS', name: 'SERVICIOS' },
        ];

        this.tiposPagos = [
            { code: 'CONTADO', name: 'CONTADO' },
            { code: 'CREDITO', name: 'CREDITO' },
        ];

        this.monedas = [
            { code: 'PEN', name: 'SOLES' },
            { code: 'USD', name: 'DOLARES' },
        ];

        this.comprobanteService.findAll().subscribe((data: Comprobante[]) => {
            this.series = data;
            this.onChange();
        });

        this.configuracionService.obtenerPigv().subscribe((data: number) => {
            this.pigv = data;
        });

        this.form = new FormGroup({
            idFacturacion: new FormControl(0),
            nombreTercero: new FormControl(''),
            tercero: new FormControl(''),
            serie: new FormControl('', Validators.required),
            tipoComprobante: new FormControl('01', Validators.required),
            tipoVenta: new FormControl('BIENES', Validators.required),
            tipoPago: new FormControl('CONTADO', Validators.required),
            moneda: new FormControl('PEN', Validators.required),
            tipoCambio: new FormControl('1', Validators.required),
            direccion: new FormControl('', Validators.required),
            referencia: new FormControl(''),
            ordenCompra: new FormControl(''),
            fechaEmision: new FormControl(this.today),
            fechaVencimiento: new FormControl(this.today),
            producto: new FormControl(''),
            glosa: new FormControl(''),
            cantidad: new FormControl('1'),
            precio: new FormControl('1'),
        });
    }

    get f() {
        return this.form.controls;
    }

    operate() {
        const facturacion: Facturacion = new Facturacion();
        facturacion.tipoDocumento = this.form.value['tipoComprobante'];
        facturacion.serie = this.form.value['serie'];
        facturacion.tipoPago = this.form.value['tipoPago'];
        facturacion.fecha = formatDate(
            new Date(this.form.value['fechaEmision']),
            'yyyy-MM-dd',
            'en-US'
        );
        facturacion.fechaVencimiento = formatDate(
            new Date(this.form.value['fechaVencimiento']),
            'yyyy-MM-dd',
            'en-US'
        );;
        facturacion.referencia = this.form.value['referencia'];
        facturacion.ordenCompra = this.form.value['ordenCompra'];
        facturacion.tercero = this.form.value['tercero'];
        let terceroDireccion: TerceroDireccion = this.form.value['direccion'];
        facturacion.idTerceroDireccion = terceroDireccion.idTerceroDireccion;
        facturacion.tipoMoneda = this.form.value['moneda'];
        facturacion.pigv = this.pigv;

        facturacion.subtotal = this.items.reduce(
            (acumulador, item) => acumulador + item.subtotal,
            0
        );
        facturacion.igv = this.items.reduce(
            (acumulador, item) => acumulador + item.igv,
            0
        );
        facturacion.total = this.items.reduce(
            (acumulador, item) => acumulador + item.total,
            0
        );

        facturacion.items = this.items;

        console.log(facturacion);

        this.facturacionService
            .save(facturacion)
            .subscribe((data: Facturacion) => {
                if (data.idFacturacion > 0) {
                    this.router.navigate(['/pages/facturacion/lista'])
                    this.dialogOpciones(data);
                } else {
                    this.messageService.add({
                        key: "tc",
                        severity: "error",
                        summary: "Error",
                        detail: "Algo salió mal, no se guardaron los cambios",
                        life: 3000,
                    });
                }
            });
    }

    agregarItem() {
        const item: FacturacionItem = new FacturacionItem();

        if (this.form.value['tipoVenta'] == 'BIENES') {
            let producto: Producto = this.form.value['producto'];

            if (!producto) {
                this.messageService.add({
                    key: 'tc',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Falta ingresar un producto válido',
                    life: 3000,
                });

                return;
            }

            item.glosa = producto.nombreProducto;
            item.idProducto = producto.idProducto;

            if (producto.controlSerie == 1) {
                this.ref = this.dialogService.open(AddSeriesComponent, {
                    header: 'Ingresar Series',
                    width: '450px',
                    contentStyle: { overflow: 'auto' },
                    baseZIndex: 10000,
                    maximizable: true,
                    data: 'SALIDA',
                });
                this.ref.onClose.subscribe((series: string[]) => {
                    item.series = series.join(',');
                    item.cantidad = series.length;
                    this.form.controls['cantidad'].setValue(item.cantidad);

                    if (item.cantidad > producto.stock) {
                        this.messageService.add({
                            key: 'tc',
                            severity: 'error',
                            summary: 'Error',
                            detail: 'La cantidad ingresada es mayor al stock disponible',
                            life: 3000,
                        });

                        return;
                    }
                });
            }
        } else {
            item.glosa = this.form.value['glosa'];
            item.idProducto = 0;
        }

        item.cantidad = this.form.value['cantidad'];
        item.precio = this.form.value['precio'];

        if (this.pigv > 0) {
            let pigv = this.pigv / 100 + 1;
            item.subtotal = +((item.cantidad * item.precio) / pigv).toFixed(2);
            item.igv = +(item.cantidad * item.precio - item.subtotal).toFixed(
                2
            );
            item.total = +(item.cantidad * item.precio).toFixed(2);
        } else {
            item.subtotal = +(item.cantidad * item.precio).toFixed(2);
            item.igv = 0;
            item.total = +(item.cantidad * item.precio).toFixed(2);
        }

        this.items.push(item);

        this.form.controls['producto'].setValue('');
        this.form.controls['glosa'].setValue('');
        this.form.controls['cantidad'].setValue('');
        this.form.controls['precio'].setValue('');
        // this.autoCompleteProducto.focusInput();
    }

    filtrarProductos(event: any) {
        this.productoService.autocomplete(event.query).subscribe((result) => {
            this.productosFiltrados = result;
        });
    }

    filtrarTerceros(event: any) {
        this.terceroService.autocomplete(event.query).subscribe((result) => {
            this.tercerosFiltrados = result;
        });
    }

    dialogOpciones(facturacion: Facturacion) {
        this.ref = this.dialogService.open(FacturacionOpcionesComponent, {
            header: 'Opciones',
            width: '600px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: false,
            data: facturacion,
        });
    }

    onChange() {
        console.log(this.form.value['tipoComprobante']);

        this.seriesFiltrados = this.series.filter(
            (serie) => serie.tipo === this.form.value['tipoComprobante']
        );
        console.log(this.seriesFiltrados);
    }

    onChangeTipoVenta() {
        this.tipoVenta = this.form.value['tipoVenta'];
    }

    onChangeTercero() {
        console.log(this.form.value['tercero']);
        this.tercero = this.form.value['tercero'];

        this.direcciones = this.tercero.direcciones;
        console.log(this.direcciones);

        // this.seriesFiltrados = this.series.filter(serie => serie.tipo === this.form.value["tipoComprobante"]);
        // console.log(this.seriesFiltrados);
    }
}
