import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';

import { PrimengModule } from 'src/app/primeng/primeng.module';

import { TerceroAddComponent } from '../../clientes-proveedores/cliente-proveedor-add/cliente-proveedor-add.component';

import { map } from 'rxjs';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Tercero } from 'src/app/admin/models/tercero';
import { Sector } from 'src/app/admin/models/sector';
import { Via } from 'src/app/admin/models/via';
import { CajaNap } from 'src/app/admin/models/cajaNap';
import { Plan } from 'src/app/admin/models/plan';
import { Vendedor } from 'src/app/shared/interfaces/vendedor';
import { Abonado } from 'src/app/admin/models/abonado';
import { Orden } from 'src/app/admin/models/orden';
import { Cargo } from 'src/app/admin/models/cargo';
import { Pago } from 'src/app/admin/models/pago';
import { OrdenAsignacionOnt } from 'src/app/admin/models/orden-asignacion-ont';
import { AbonadoService } from 'src/app/admin/services/abonado.service';
import { TerceroService } from 'src/app/admin/services/cliente-proveedor.service';
import { UbigeoService } from 'src/app/admin/services/ubigeo.service';
import { SectorService } from 'src/app/admin/services/sector.service';
import { ViaService } from 'src/app/admin/services/via.service';
import { CajaNapService } from 'src/app/admin/services/caja-nap.service';
import { PlanService } from 'src/app/admin/services/plan.service';
import { OrdenService } from 'src/app/admin/services/orden.service';
import { CargoService } from 'src/app/admin/services/cargo.service';
import { PagoService } from 'src/app/admin/services/pago.service';
import { UserService } from 'src/app/admin/services/user.service';
import { OrdenAsignacionOntService } from 'src/app/admin/services/orden-asignacion-ont.service';
import { OrdenAsignacionService } from 'src/app/admin/services/orden-asignacion.service';
import { OrdenAtenderDialogComponent } from '../../ordenes/orden-atender-dialog/orden-atender-dialog.component';
import { OrdenDialogComponent } from '../../ordenes/orden-dialog/orden-dialog.component';
import { AbonadoCargoComponent } from '../abonado-cargo/abonado-cargo.component';
import { AbonadoPagoComponent } from '../abonado-pago/abonado-pago.component';
import { OrdenAsignarDialogComponent } from '../../ordenes/orden-asignar-dialog/orden-asignar-dialog.component';
import { AsignarOnuDialogComponent } from '../asignar-onu-dialog/asignar-onu-dialog.component';
import { AbonadoOntService } from 'src/app/admin/services/abonado-ont.service';
import { AbonadoOnt } from 'src/app/admin/models/abonado-ont';

@Component({
    selector: 'app-abonado-registro',
    templateUrl: './abonado-registro.component.html',
    styleUrls: ['./abonado-registro.component.scss'],
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
export class AbonadoRegistroComponent implements OnInit {
    tercero!: Tercero;
    form!: FormGroup;
    title: string = 'Nuevo Abonado';
    idAbonado!: number;
    isEdit: boolean = false;
    submitted = false;

    ubigeosFiltrados = [];
    sectores: Sector[] | undefined;
    vias: Via[] | undefined;
    cajasNaps: CajaNap[] | undefined;
    planes: Plan[] | undefined;
    vendedores: Vendedor[] | undefined = [];

    abonado: Abonado;
    estado: string = 'REGISTRADO';

    deleteCargoDialog: boolean = false;
    idCargo: number = 0;

    deletePagoDialog: boolean = false;
    botonAsingarOnu: boolean = false;
    idPago: number = 0;

    listaOrdenes: Orden[] = [];
    listaCargos: Cargo[] = [];
    listaPagos: Pago[] = [];
    // listaOnus: OrdenAsignacionOnt[] = [];
    listaOnus: AbonadoOnt[] = [];

    totalCargos: number = 0;
    totalPagado: number = 0;
    totalSaldo: number = 0;
    totalPagos: number = 0;
    deuda: number = 0;
    saldoFavor: number = 0;

    ref: DynamicDialogRef | undefined;

    pdfSrc: string;

    today = new Date();
    fechaActual: any;
    pipe = new DatePipe('en-US');

    constructor(
        private abonadoService: AbonadoService,
        private terceroService: TerceroService,
        private ubigeoService: UbigeoService,
        private sectorService: SectorService,
        private viaService: ViaService,
        private cajaNapService: CajaNapService,
        private planService: PlanService,
        private ordenService: OrdenService,
        private cargoService: CargoService,
        private pagoService: PagoService,
        private userService: UserService,
        private abonadoOntService: AbonadoOntService,
        private ordenAsignacionOntService: OrdenAsignacionOntService,
        private ordenAsignacionService: OrdenAsignacionService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public dialogService: DialogService,
        private route: ActivatedRoute,
        private router: Router // private breadcrumbService: AppBreadcrumbService
    ) {
        // this.breadcrumbService.setItems([
        //     { label: "Abonados" },
        //     { label: "Registro / Edición" },
        // ]);
    }
    ngOnInit(): void {
        this.fechaActual = this.pipe.transform(this.today, 'YYYY-MM-dd');

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
                    let vendedor: Vendedor = {
                        code: e.idUser,
                        name: e.name,
                    };
                    this.vendedores.push(vendedor);
                });
            });

        console.log(this.vendedores);

        this.route.params.subscribe((data) => {
            this.idAbonado = data['id'];
            if (this.idAbonado > 0) {
                this.isEdit = true;
            }

            this.initForm(this.idAbonado);
        });

        this.abonadoService.getOrdenChange().subscribe((data: any) => {
            this.initForm(data);
        });

        this.ordenService.getMessageChange().subscribe((data) => {
            this.messageService.add(data);
        });

        this.sectorService
            .findAll()
            .subscribe((data) => (this.sectores = data));

        this.viaService.findAll().subscribe((data) => {
            this.vias = data;
            this.vias.map((v) => {
                v.nombreViaCombo = `${v.tipoVia.idTipoVia}. ${v.nombreVia}`;
            });
        });
        this.cajaNapService
            .findAll()
            .subscribe((data) => (this.cajasNaps = data));
        this.planService.findAll().subscribe((data) => (this.planes = data));

        this.form = new FormGroup({
            idAbonado: new FormControl(0),
            tercero: new FormControl(this.tercero, Validators.required),
            dniruc: new FormControl(''),
            nombreTercero: new FormControl(''),
            sector: new FormControl('', Validators.required),
            via: new FormControl('', Validators.required),
            numero: new FormControl('', Validators.required),
            referencia: new FormControl(''),
            suministro: new FormControl('', Validators.required),
            cajaNap: new FormControl('', Validators.required),
            plan: new FormControl('', Validators.required),
            vendedor: new FormControl(0, Validators.required),
            latitud: new FormControl(''),
            longitud: new FormControl(''),
            foto: new FormControl(''),
            estado: new FormControl(this.estado),
            fechaRegistro: new FormControl(this.fechaActual),
            fechaActivacion: new FormControl(this.fechaActual),
            fechaUltimaLiquidacion: new FormControl(this.fechaActual),
        });
    }
    get f() {
        return this.form.controls;
    }

    initForm(idAbonado: number) {
        if (this.isEdit || idAbonado > 0) {
            this.abonadoService
                .findById(idAbonado)
                .subscribe((data: Abonado) => {
                    data.via.nombreViaCombo = `${data.via.tipoVia.idTipoVia}. ${data.via.nombreVia}`;
                    this.abonado = data;
                    this.form = new FormGroup({
                        idAbonado: new FormControl(data.idAbonado),
                        tercero: new FormControl(
                            data.tercero,
                            Validators.required
                        ),
                        dniruc: new FormControl(data.tercero.dniruc),
                        nombreTercero: new FormControl(
                            data.tercero.nombreTercero
                        ),
                        sector: new FormControl(
                            data.sector,
                            Validators.required
                        ),
                        via: new FormControl(data.via, Validators.required),
                        numero: new FormControl(
                            data.numero,
                            Validators.required
                        ),
                        referencia: new FormControl(data.referencia),
                        suministro: new FormControl(data.suministro),
                        cajaNap: new FormControl(
                            data.cajaNap,
                            Validators.required
                        ),
                        plan: new FormControl(data.plan, Validators.required),
                        vendedor: new FormControl(
                            data.vendedor,
                            Validators.required
                        ),
                        latitud: new FormControl(data.latitud),
                        longitud: new FormControl(data.longitud),
                        foto: new FormControl(data.foto),
                        estado: new FormControl(data.estado),
                        fechaRegistro: new FormControl(data.fechaRegistro),
                        fechaActivacion: new FormControl(data.fechaActivacion),
                        fechaUltimaLiquidacion: new FormControl(
                            data.fechaUltimaLiquidacion
                        ),
                    });
                    this.deuda = data.deuda;
                    this.saldoFavor = data.saldoFavor;
                    this.estado = data.estado;
                    this.totalCargos = 0;
                    this.totalPagado = 0;
                    this.totalPagos = 0;
                    this.totalSaldo = 0;

                    this.ordenService
                        .getOrdenesIdAbonado(idAbonado)
                        .subscribe((data: Orden[]) => {
                            this.listaOrdenes = data;
                        });

                    this.loadCargos(idAbonado);

                    this.loadPagos(idAbonado);

                    // this.ordenAsignacionOntService
                    //     .onusAsignadasAbonado(idAbonado)
                    //     .subscribe((data: OrdenAsignacionOnt[]) => {
                    //         this.listaOnus = data;
                    //         if(this.listaOnus.length == 0 && this.abonado.plan.usaOnu == 1){
                    //             this.botonAsingarOnu = true;
                    //         }else{
                    //             this.botonAsingarOnu = false;
                    //         }
                    //     });

                    this.abonadoOntService.ontAsignadasAbonado(idAbonado).subscribe(data =>{
                            this.listaOnus = data;
                            if(this.listaOnus.length == 0 && this.abonado.plan.usaOnu == 1){
                                this.botonAsingarOnu = true;
                            }else{
                                this.botonAsingarOnu = false;
                            }
                    })


                });
        }
    }

    loadFormTercero(tercero: Tercero) {
        this.form.controls['tercero'].setValue(tercero);
        this.form.controls['dniruc'].setValue(tercero.dniruc);
        this.form.controls['nombreTercero'].setValue(tercero.nombreTercero);
    }

    loadCargos(idAbonado: number) {
        this.cargoService
            .getCargosIdAbonado(idAbonado)
            .subscribe((data: Cargo[]) => {
                this.listaCargos = data;
                this.listaCargos.map((e) => {
                    this.totalCargos += e.total;
                    this.totalPagado += e.pagado;
                    this.totalSaldo += e.total - e.pagado;
                });
            });
    }

    loadPagos(idAbonado: number) {
        this.pagoService
            .getPagosIdAbonado(idAbonado)
            .subscribe((data: Pago[]) => {
                this.listaPagos = data;
                this.listaPagos.map((e) => {
                    this.totalPagos += e.total;
                });
            });
    }

    newCliente(dniruc: string) {
        this.ref = this.dialogService.open(TerceroAddComponent, {
            header: 'Nuevo Cliente',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: dniruc,
        });

        this.ref.onClose.subscribe((tercero: Tercero) => {
            if (tercero) {
                this.loadFormTercero(tercero);
            }
        });

    }

    filtrarUbigeos(event: any) {
        this.ubigeoService.autocomplete(event.query).subscribe((result) => {
            this.ubigeosFiltrados = result;
        });
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

        const abonadoNew: Abonado = new Abonado();

        abonadoNew.idAbonado = this.form.value['idAbonado'];
        abonadoNew.tercero = this.form.value['tercero'];
        abonadoNew.sector = this.form.value['sector'];
        abonadoNew.via = this.form.value['via'];
        abonadoNew.numero = this.form.value['numero'];
        abonadoNew.referencia = this.form.value['referencia'];
        abonadoNew.suministro = this.form.value['suministro'];
        abonadoNew.cajaNap = this.form.value['cajaNap'];
        abonadoNew.plan = this.form.value['plan'];
        if (this.isEdit) {
            abonadoNew.fechaRegistro = this.form.value['fechaRegistro'];
            abonadoNew.fechaActivacion = this.form.value['fechaActivacion'];
            abonadoNew.fechaUltimaLiquidacion =
                this.form.value['fechaUltimaLiquidacion'];
        } else {
            abonadoNew.fechaRegistro = this.fechaActual;
            abonadoNew.fechaActivacion = this.fechaActual;
            abonadoNew.fechaUltimaLiquidacion = this.fechaActual;
        }

        abonadoNew.latitud = this.form.value['latitud'];
        abonadoNew.longitud = this.form.value['longitud'];
        abonadoNew.estado = this.form.value['estado'];
        abonadoNew.vendedor = this.form.value['vendedor'];

        if (this.isEdit) {
            this.abonadoService
                .update(this.idAbonado, abonadoNew)
                .subscribe((data) => {
                    this.abonadoService.setAbonadoChange(data);
                    this.messageService.add({
                        key: 'tc',
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Datos actualizados correctamente',
                        life: 3000,
                    });
                });
        } else {
            this.abonadoService.save(abonadoNew).subscribe((data: Abonado) => {
                this.router.navigate([
                    '/pages/abonados/detalles',
                    data.idAbonado,
                ]);
            });
        }
    }

    buscarMigo() {
        if (
            this.form.value['dniruc'].length == 8 ||
            this.form.value['dniruc'].length == 11
        ) {
            this.terceroService
                .getByDniRuc(this.form.value['dniruc'])
                .subscribe((resp: any) => {
                    if (resp == null) {
                        if (
                            this.form.value['dniruc'].length == 8 ||
                            this.form.value['dniruc'].length == 11
                        ) {
                            this.newCliente(this.form.value['dniruc']);
                        } else {
                            this.messageService.add({
                                key: 'tc',
                                severity: 'info',
                                summary: 'Atención',
                                detail: 'Dato inválido',
                                life: 3000,
                            });
                        }
                    } else {
                        this.loadFormTercero(resp);
                    }
                });
        } else {
            this.messageService.add({
                key: 'tc',
                severity: 'info',
                summary: 'Atención',
                detail: 'Dato inválido',
                life: 3000,
            });
        }
    }

    asignarOrden(orden: Orden) {
        this.ref = this.dialogService.open(OrdenAsignarDialogComponent, {
            header: 'Asignar Orden',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: orden,
        });
    }

    atenderOrden(orden: Orden) {
        this.ref = this.dialogService.open(OrdenAtenderDialogComponent, {
            header: 'Atender Orden',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: orden,
        });
    }

    nuevaOrden() {
        this.ref = this.dialogService.open(OrdenDialogComponent, {
            header: 'Nueva Orden',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: this.abonado,
        });
    }

    nuevoPago() {
        this.ref = this.dialogService.open(AbonadoPagoComponent, {
            header: 'Nuevo Pago',
            width: '600px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: this.abonado,
        });
    }

    nuevoCargo() {
        this.ref = this.dialogService.open(AbonadoCargoComponent, {
            header: 'Nuevo Cargo',
            width: '600px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: this.abonado,
        });
    }

    asignarOnt() {
        this.ref = this.dialogService.open(AsignarOnuDialogComponent, {
            header: 'Asignar ONU',
            width: '600px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: this.abonado,
        });
    }

    imprimirOrden(orden: Orden) {
        this.ordenService.imprimirOrden(orden).subscribe((data) => {
            const url = window.URL.createObjectURL(data);
            window.open(
                url,
                'ORDEN DE SERVICIO',
                'width=500,height=500,menubar=no'
            );
        });
    }

    imprimirCuentaCorriente() {
        this.abonadoService
            .imprimirCuentaCorriente(this.abonado)
            .subscribe((data) => {
                const url = window.URL.createObjectURL(data);
                window.open(
                    url,
                    'CUENTA CORRIENTE',
                    'width=500,height=500,menubar=no'
                );
            });
    }

    imprimirAvisoCobranza() {
        let lista:Abonado[] = [];
        lista.push(this.abonado);
        this.abonadoService
            .imprimirAvisoCobranza(lista)
            .subscribe((data) => {
                const url = window.URL.createObjectURL(data);
                window.open(
                    url,
                    'AVISO COBRANZA',
                    'width=500,height=500,menubar=no'
                );
            });
    }

    descargarOrden(orden: Orden) {
        this.ordenService.imprimirOrden(orden).subscribe((data) => {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.setAttribute('style', 'display: none');
            document.body.appendChild(a);
            a.href = url;
            a.download = `orden_${orden.idOrden}.pdf`;

            a.click();
        });
    }

    eliminarCargo(cargo: Cargo) {
        console.log(cargo);

        if (cargo.pagado > 0) {
            this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Operación Denegada',
                detail: 'El cargo registra un pago',
                life: 3000,
            });
            return;
        }
        if (
            cargo.tipoCargo.idTipoCargo == 1 &&
            cargo.fechaFin != this.abonado.fechaUltimaLiquidacion
        ) {
            this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Operación Denegada',
                detail: 'El cargo es por MENSUALIDAD y esta no es la última generada',
                life: 3000,
            });
            return;
        }

        this.idCargo = cargo.idCargo;
        this.deleteCargoDialog = true;
    }

    confirmDeleteCargo() {
        this.deleteCargoDialog = false;

        this.cargoService.delete(this.idCargo).subscribe((resp) => {
            if (resp === 1) {
                this.messageService.add({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Cargo eliminado con éxito',
                    life: 3000,
                });

                this.initForm(this.idAbonado);
            } else {
                this.messageService.add({
                    key: 'tc',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo completar la operación',
                    life: 3000,
                });
            }
        });
    }

    eliminarPago(pago: Pago) {
        console.log(pago);

        if (pago.numero > 0) {
            this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Operación Denegada',
                detail: 'El pago registra un comprobante, debe anular el comprobante para continuar',
                life: 3000,
            });
            return;
        }


        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Está seguro que desea eliminar el pago?',
            header: 'Confirmar',
            icon: 'pi pi-question',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            acceptIcon: 'none',
            acceptLabel: 'SI, Eliminar',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.pagoService.delete(pago.idPago).subscribe((data) => {
                    this.initForm(this.idAbonado);
                });
            },
            reject: () => {},
        });
    }


}
