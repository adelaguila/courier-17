import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map } from 'rxjs';
import { PrimengModule } from 'src/app/primeng/primeng.module';

import { TerceroAddComponent } from '../../clientes-proveedores/cliente-proveedor-add/cliente-proveedor-add.component';
import { AutoComplete } from 'primeng/autocomplete';
import { Tercero } from 'src/app/admin/models/tercero';
import { Producto } from 'src/app/admin/models/producto';
import { AlmacenMovimientoItem } from 'src/app/admin/models/almacen-movimiento-item';
import { AlmacenMovimientoService } from 'src/app/admin/services/almacen-movimiento.service';
import { TerceroService } from 'src/app/admin/services/cliente-proveedor.service';
import { ProductoService } from 'src/app/admin/services/producto.service';
import { UserService } from 'src/app/admin/services/user.service';
import { AlmacenMovimiento } from 'src/app/admin/models/almacen-movimiento';
import { AddSeriesComponent } from '../../productos/add-series/add-series.component';
import { ProductoFormComponent } from '../../productos/producto-form/producto-form.component';
import { AlmacenMovimientoItemService } from 'src/app/admin/services/almacen-movimiento-item.service';

@Component({
    selector: 'app-almacen-ingreso',
    templateUrl: './almacen-ingreso.component.html',
    styleUrls: ['./almacen-ingreso.component.scss'],
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
export class AlmacenIngresoComponent implements OnInit {
    // @ViewChild("inputProducto", {}) inputProducto: ElementRef;
    @ViewChild('inputProducto') private autoCompleteProducto: AutoComplete;

    idAlmacenMovimiento: number = 0;
    tercero!: Tercero;
    producto!: Producto;
    form!: FormGroup;
    title: string = 'Nuevo Ingreso';
    isEdit!: boolean;
    submitted = false;

    tercerosFiltrados = [];
    productosFiltrados = [];

    almacenMovimiento: AlmacenMovimiento;

    items: AlmacenMovimientoItem[] = [];

    ref: DynamicDialogRef | undefined;

    pdfSrc: string;

    today = new Date();
    fechaActual: any;
    pipe = new DatePipe('en-US');

    readOnlyID: boolean = false;

    constructor(
        private almacenMovimientoService: AlmacenMovimientoService,
        private almacenMovimientoItemService: AlmacenMovimientoItemService,
        private terceroService: TerceroService,
        private productoService: ProductoService,
        private userService: UserService,
        private messageService: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute,
        private router: Router // private breadcrumbService: AppBreadcrumbService
    ) {
        // this.breadcrumbService.setItems([
        //     { label: "Abonados" },
        //     { label: "Registro / Edición" },
        // ]);
    }
    ngOnInit(): void {

        this.almacenMovimientoService.getMessageChange().subscribe((data) => {
            this.messageService.add(data);
        });

        this.fechaActual = this.pipe.transform(this.today, 'YYYY-MM-dd');

        this.terceroService.getTerceroChange().subscribe((data: any) => {
            this.tercero = data;
            this.loadFormTercero(this.tercero);
        });

        this.productoService.getProductoChange().subscribe((data: any) => {
            this.producto = data;
            this.loadFormProducto(this.producto);
        });

        this.userService
            .findAll()
            .pipe(
                map((value) =>
                    value.sort((a, b) => {
                        if (a.name < b.name) {
                            return -1;
                        } else {
                            return 1;
                        }
                    })
                )
            )
            .subscribe((data) => {
                data.map((e) => {
                    // let vendedor: Vendedor = {
                    //     code: e.idUser,
                    //     name: e.name,
                    // };
                    // this.vendedores.push(vendedor);
                });
            });

        this.form = new FormGroup({
            idAlmacenMovimiento: new FormControl(0),
            tercero: new FormControl(this.tercero, Validators.required),
            fecha: new FormControl(this.fechaActual),
            tipoMovimiento: new FormControl('INGRESO'),
            documento: new FormControl('', Validators.required),
            referencia: new FormControl(''),
            producto: new FormControl(''),
            cantidad: new FormControl('1'),
            precioUnitario: new FormControl('0'),
        });

        this.route.params.subscribe((data) => {
            this.idAlmacenMovimiento = data['id'];
            if (this.idAlmacenMovimiento > 0) {
                this.isEdit = true;
                this.readOnlyID = true;
                this.getAlmacenMovimiento();
            }
        });
    }

    getAlmacenMovimiento() {
        this.almacenMovimientoService
            .findById(this.idAlmacenMovimiento)
            .subscribe((data) => {
                this.almacenMovimiento = data;
                this.tercero = data.tercero;
                this.items = data.items;

                this.cargarForm();
            });
    }

    cargarForm() {
        this.form = new FormGroup({
            idAlmacenMovimiento: new FormControl(
                this.almacenMovimiento.idAlmacenMovimiento
            ),
            tercero: new FormControl(this.tercero, Validators.required),
            fecha: new FormControl(this.fechaActual),
            tipoMovimiento: new FormControl(
                this.almacenMovimiento.tipoMovimiento
            ),
            // tipoMovimiento: new FormControl("INGRESO"),
            documento: new FormControl(
                this.almacenMovimiento.documento,
                Validators.required
            ),
            referencia: new FormControl(this.almacenMovimiento.referencia),
            producto: new FormControl(''),
            cantidad: new FormControl('1'),
            precioUnitario: new FormControl('0'),
        });
    }

    get f() {
        return this.form.controls;
    }

    loadFormTercero(tercero: Tercero) {
        this.form.controls['tercero'].setValue(tercero);
    }

    loadFormProducto(producto: Producto) {
        this.form.controls['producto'].setValue(producto);
    }

    newTercero(dniruc: any) {
        this.ref = this.dialogService.open(TerceroAddComponent, {
            header: 'Nuevo Tercero',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: dniruc,
        });
    }

    newProducto(producto: any) {
        this.ref = this.dialogService.open(ProductoFormComponent, {
            header: 'Nuevo Producto',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: producto,
        });
    }

    filtrarTerceros(event: any) {
        this.terceroService.autocomplete(event.query).subscribe((result) => {
            this.tercerosFiltrados = result;
        });
    }

    filtrarProductos(event: any) {
        this.productoService.autocomplete(event.query).subscribe((result) => {
            this.productosFiltrados = result;
        });
    }

    agregarItem() {
        const item: AlmacenMovimientoItem = new AlmacenMovimientoItem();

        item.producto = this.form.value['producto'];
        item.cantidad = this.form.value['cantidad'];
        item.precioUnitario = this.form.value['precioUnitario'];

        if (!item.producto) {
            this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'Falta ingresar un producto válido',
                life: 3000,
            });

            return;
        }

        if (item.producto.controlSerie == 1) {
            this.ref = this.dialogService.open(AddSeriesComponent, {
                header: 'Ingresar Series',
                width: '450px',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: 'INGRESO',
            });
            this.ref.onClose.subscribe((series: string[]) => {
                item.series = series.join(',');
                item.cantidad = series.length;
                this.form.controls['cantidad'].setValue(item.cantidad);

                if (this.isEdit) {
                    let almacen: AlmacenMovimiento = this.almacenMovimiento;
                    almacen.items = null;
                    item.almacenMovimiento = almacen;

                    this.almacenMovimientoItemService.save(item).subscribe((data) => {
                        this.getAlmacenMovimiento();
                    });
                }else{
                    this.items.push(item);
                }
                this.form.controls['producto'].setValue('');
                this.form.controls['cantidad'].setValue('');
                this.form.controls['precioUnitario'].setValue('');
                // this.autoCompleteProducto.focusInput();

            });
        } else {
            if (this.isEdit) {
                let almacen: AlmacenMovimiento = this.almacenMovimiento;
                almacen.items = null;
                item.almacenMovimiento = almacen;

                this.almacenMovimientoItemService
                    .save(item)
                    .subscribe((data) => {
                        this.getAlmacenMovimiento();
                    });
            }else{
                item.series = null;
                this.items.push(item);
                this.form.controls['producto'].setValue('');
                this.form.controls['cantidad'].setValue('');
                this.form.controls['precioUnitario'].setValue('');
                // this.autoCompleteProducto.focusInput();
            }

        }


    }

    operate() {
        if (this.form.invalid) {
            this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'El formulario es inválido',
                life: 3000,
            });

            return;
        }

        const almacenNew: AlmacenMovimiento = new AlmacenMovimiento();

        almacenNew.idAlmacenMovimiento = this.form.value['idAlmacenMovimiento'];
        almacenNew.tercero = this.form.value['tercero'];
        almacenNew.clienteProveedor = almacenNew.tercero.nombreTercero;
        almacenNew.fecha = this.form.value['fecha'];
        almacenNew.documento = this.form.value['documento'];
        almacenNew.referencia = this.form.value['referencia'];
        almacenNew.tipoMovimiento = this.form.value['tipoMovimiento'];
        almacenNew.items = this.items;

        const recordId = this.form.value['idAlmacenMovimiento'];

        if (this.isEdit) {
            this.almacenMovimientoService
                .update(recordId, almacenNew)
                .subscribe((data) => {
                    this.almacenMovimientoService.setMessageChange({
                        key: 'tc',
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Datos actualizados correctamente',
                        life: 3000,
                    });
                });
        } else {
            this.almacenMovimientoService
                .save(almacenNew)
                .subscribe((data: AlmacenMovimiento) => {
                    this.router.navigate(['/pages/almacen/lista']);
                });
        }
    }

    deleteItem(item: AlmacenMovimientoItem) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Está seguro que desea eliminar el item?',
            header: 'Confirmar',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            acceptIcon: 'none',
            acceptLabel: 'SI, Eliminar',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                if (item.idAlmacenMovimientoItem > 0) {
                    this.almacenMovimientoItemService
                        .delete(item.idAlmacenMovimientoItem)
                        .subscribe((data) => {
                            if (data == 0) {
                                this.messageService.add({
                                    key: 'tc',
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Operación denegada',
                                    life: 3000,
                                });
                                return;
                            } else {
                                let indice = this.items.indexOf(item);
                                this.items.splice(indice, 1);
                            }
                        });
                } else {
                    let indice = this.items.indexOf(item);
                    this.items.splice(indice, 1);
                }
            },
            reject: () => {},
        });
    }

    // nuevaOrden() {
    //     this.ref = this.dialogService.open(OrdenDialogComponent, {
    //         header: "Nueva Orden",
    //         width: "550px",
    //         contentStyle: { overflow: "auto" },
    //         baseZIndex: 10000,
    //         maximizable: true,
    //         data: this.abonado,
    //     });
    // }
}
