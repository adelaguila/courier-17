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


import { map } from 'rxjs';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { OrdenAtenderDialogComponent } from '../../ordenes/orden-atender-dialog/orden-atender-dialog.component';
import { OrdenDialogComponent } from '../../ordenes/orden-dialog/orden-dialog.component';
import { OrdenServicio } from 'src/app/admin/models/orden-servicio';
import { OrdenServicioService } from 'src/app/admin/services/orden-servicio.service';
import { AgenciaDestino } from 'src/app/admin/models/agencia-destino';
import { ClienteProveedorFormComponent } from '../../clientes-proveedores/cliente-proveedor-form/cliente-proveedor-form.component';
import { ClienteProveedor } from 'src/app/admin/models/cliente-proveedor';
import { Agencia } from 'src/app/admin/models/agencia';
import { AgenciaService } from 'src/app/admin/services/agencia.service';
import { UbigeoService } from 'src/app/admin/services/ubigeo.service';
import { ClienteProveedorService } from 'src/app/admin/services/cliente-proveedor.service';
import { ClienteProveedorArea } from 'src/app/admin/models/cliente-proveedor-area';
import { TipoPago } from 'src/app/admin/models/tipo-pago';
import { TipoServicio } from 'src/app/admin/models/tipo-servicio';
import { TipoOrdenServicio } from 'src/app/admin/models/tipo-orden-servicio';
import { TipoEnvio } from 'src/app/admin/models/tipo-envio';
import { TipoEmbalaje } from 'src/app/admin/models/tipo-embalaje';
import { TipoPagoService } from 'src/app/admin/services/tipo-pago.service';
import { TipoServicioService } from 'src/app/admin/services/tipo-servicio.service';
import { TipoEnvioService } from 'src/app/admin/services/tipo-envio.service';
import { TipoOrdenServicioService } from 'src/app/admin/services/tipo-orden-servicio.service';
import { TipoEmbalajeService } from 'src/app/admin/services/tipo-embalaje.service';



@Component({
    selector: 'app-orden-servicio-registro',
    templateUrl: './orden-servicio-registro.component.html',
    styleUrls: ['./orden-servicio-registro.component.scss'],
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
export class OrdenServicioRegistroComponent implements OnInit {
    form!: FormGroup;
    title: string = 'Nueva Orden Servicio';
    idOrdenServicio!: number;
    isEdit: boolean = false;
    submitted = false;

    origenesFiltrados = [];
    destinosFiltrados = [];
    clientesFiltrados = [];
    agencias: Agencia[] | undefined;
    areas: ClienteProveedorArea[] | undefined;
    tiposPagos: TipoPago[] | undefined;
    tiposServicios: TipoServicio[] | undefined;
    tiposOrdenesServicios: TipoOrdenServicio[] | undefined;
    tiposEnvios: TipoEnvio[] | undefined;
    tiposEmbalajes: TipoEmbalaje[] | undefined;
    // planes: Plan[] | undefined;
    // vendedores: Vendedor[] | undefined = [];

    ordenServicio: OrdenServicio;
    estado: string = 'REGISTRADO';

    deleteCargoDialog: boolean = false;
    idCargo: number = 0;

    deletePagoDialog: boolean = false;
    botonAsingarOnu: boolean = false;
    idPago: number = 0;

    // listaOrdenes: Orden[] = [];
    // listaCargos: Cargo[] = [];
    // listaPagos: Pago[] = [];
    // listaOnus: OrdenAsignacionOnt[] = [];
    // listaOnus: OrdenServicioOnt[] = [];

    // totalCargos: number = 0;
    // totalPagado: number = 0;
    // totalSaldo: number = 0;
    // totalPagos: number = 0;
    // deuda: number = 0;
    // saldoFavor: number = 0;

    ref: DynamicDialogRef | undefined;

    pdfSrc: string;

    today = new Date();
    fechaActual: any;
    pipe = new DatePipe('en-US');

    constructor(
        private ordenServicioService: OrdenServicioService,
        private agenciaService: AgenciaService,
        private ubigeoService: UbigeoService,
        private clienteProveedorService: ClienteProveedorService,
        private tipoPagoService: TipoPagoService,
        private tipoServicioService: TipoServicioService,
        private tipoEnvioService: TipoEnvioService,
        private tipoOrdenServicioService: TipoOrdenServicioService,
        private tipoEmbalajeService: TipoEmbalajeService,
        // private cargoService: CargoService,
        // private pagoService: PagoService,
        // private userService: UserService,
        // private abonadoOntService: OrdenServicioOntService,
        // private ordenAsignacionOntService: OrdenAsignacionOntService,
        // private ordenAsignacionService: OrdenAsignacionService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public dialogService: DialogService,
        private route: ActivatedRoute,
        private router: Router // private breadcrumbService: AppBreadcrumbService
    ) {
        // this.breadcrumbService.setItems([
        //     { label: "OrdenServicios" },
        //     { label: "Registro / Edición" },
        // ]);
    }
    ngOnInit(): void {
        this.fechaActual = this.pipe.transform(this.today, 'YYYY-MM-dd');

        // this.userService
        //     .findAll()
        //     .pipe(
        //         map((value) =>
        //             value.sort((a, b) => {
        //                 if (a.name < b.name) {
        //                     return -1;
        //                 } else {
        //                     return 1;
        //                 }
        //             })
        //         )
        //     )
        //     .subscribe((data) => {
        //         data.map((e) => {
        //             let vendedor: Vendedor = {
        //                 code: e.idUser,
        //                 name: e.name,
        //             };
        //             this.vendedores.push(vendedor);
        //         });
        //     });

        // console.log(this.vendedores);

        this.route.params.subscribe((data) => {

            if (data['id']) {
                console.log('Llego algo: ');
                this.isEdit = true;
            }else{
                this.ordenServicio = new OrdenServicio();
                this.ordenServicio.fechaHoraRegistro = this.fechaActual;
                this.ordenServicio.piezas = 1;
                this.ordenServicio.peso = 1;
            }

            // this.initForm(this.idOrdenServicio);
        });

        // this.ordenServicioService.getOrdenServicioChange().subscribe((data: any) => {
        //     this.initForm(data);
        // });

        // this.ordenService.getMessageChange().subscribe((data) => {
        //     this.messageService.add(data);
        // });

        this.agenciaService.findAll().subscribe((data) => (this.agencias = data));
        this.tipoPagoService.findAll().subscribe((data) => (this.tiposPagos = data));
        this.tipoServicioService.findAll().subscribe((data) => (this.tiposServicios = data));
        this.tipoEnvioService.findAll().subscribe((data) => (this.tiposEnvios = data));
        this.tipoOrdenServicioService.findAll().subscribe((data) => (this.tiposOrdenesServicios = data));
        this.tipoEmbalajeService.findAll().subscribe((data) => (this.tiposEmbalajes = data));

        // this.viaService.findAll().subscribe((data) => {
        //     this.vias = data;
        //     this.vias.map((v) => {
        //         v.nombreViaCombo = `${v.tipoVia.idTipoVia}. ${v.nombreVia}`;
        //     });
        // });
        // this.cajaNapService
        //     .findAll()
        //     .subscribe((data) => (this.cajasNaps = data));
        // this.planService.findAll().subscribe((data) => (this.planes = data));

        this.form = new FormGroup({
            idOrdenServicio: new FormControl('', Validators.required),
            fechaHoraRegistro: new FormControl(this.ordenServicio.fechaHoraRegistro, Validators.required),
            agenciaOrigen: new FormControl(this.ordenServicio.agenciaOrigen, Validators.required),
            origen: new FormControl(this.ordenServicio.origen, Validators.required),
            agenciaDestino: new FormControl(this.ordenServicio.agenciaDestino, Validators.required),
            piezas: new FormControl(this.ordenServicio.piezas, Validators.required),
            peso: new FormControl(this.ordenServicio.peso, Validators.required),
            cliente: new FormControl(this.ordenServicio.cliente, Validators.required),
            area: new FormControl(this.ordenServicio.area),
            remitente: new FormControl(this.ordenServicio.remitente),
            tipoPago: new FormControl(this.ordenServicio.tipoPago, Validators.required),
            tipoServicio: new FormControl(this.ordenServicio.tipoServicio, Validators.required),
            tipoEnvio: new FormControl(this.ordenServicio.tipoEnvio, Validators.required),
            tipoOrdenServicio: new FormControl(this.ordenServicio.tipoOrdenServicio, Validators.required),
            guia: new FormControl(this.ordenServicio.guia),
            referencia1: new FormControl(this.ordenServicio.referencia1),
            referencia2: new FormControl(this.ordenServicio.referencia2),
            referencia3: new FormControl(this.ordenServicio.referencia3),
            idConsignatario: new FormControl(this.ordenServicio.idConsignatario),
            consignatario: new FormControl(this.ordenServicio.consignatario, Validators.required),
            direccion: new FormControl(this.ordenServicio.direccion, Validators.required),
            telefono: new FormControl(this.ordenServicio.telefono),
            contenido: new FormControl(this.ordenServicio.contenido, Validators.required),
            tipoEmbalaje: new FormControl(this.ordenServicio.tipoEmbalaje, Validators.required),
            tarifaMinima: new FormControl(this.ordenServicio.tarifaMinima, Validators.required),
            tarifaExeso: new FormControl(this.ordenServicio.tarifaExeso, Validators.required),
            adicionalPod: new FormControl(this.ordenServicio.adicionalPod),
            adicionalTransferencia: new FormControl(this.ordenServicio.adicionalTransferencia),
            adicionalOtro: new FormControl(this.ordenServicio.adicionalOtro),
            total: new FormControl(this.ordenServicio.total),

        });
    }
    get f() {
        return this.form.controls;
    }

    initForm(idOrdenServicio: string) {
        // if (this.isEdit || idOrdenServicio > 0) {
        //     this.abonadoService
        //         .findById(idOrdenServicio)
        //         .subscribe((data: OrdenServicio) => {
        //             data.via.nombreViaCombo = `${data.via.tipoVia.idTipoVia}. ${data.via.nombreVia}`;
        //             this.abonado = data;
        //             this.form = new FormGroup({
        //                 idOrdenServicio: new FormControl(data.idOrdenServicio),
        //                 tercero: new FormControl(
        //                     data.tercero,
        //                     Validators.required
        //                 ),
        //                 dniruc: new FormControl(data.tercero.dniruc),
        //                 nombreTercero: new FormControl(
        //                     data.tercero.nombreTercero
        //                 ),
        //                 sector: new FormControl(
        //                     data.sector,
        //                     Validators.required
        //                 ),
        //                 via: new FormControl(data.via, Validators.required),
        //                 numero: new FormControl(
        //                     data.numero,
        //                     Validators.required
        //                 ),
        //                 referencia: new FormControl(data.referencia),
        //                 suministro: new FormControl(data.suministro),
        //                 cajaNap: new FormControl(
        //                     data.cajaNap,
        //                     Validators.required
        //                 ),
        //                 plan: new FormControl(data.plan, Validators.required),
        //                 vendedor: new FormControl(
        //                     data.vendedor,
        //                     Validators.required
        //                 ),
        //                 latitud: new FormControl(data.latitud),
        //                 longitud: new FormControl(data.longitud),
        //                 foto: new FormControl(data.foto),
        //                 estado: new FormControl(data.estado),
        //                 fechaRegistro: new FormControl(data.fechaRegistro),
        //                 fechaActivacion: new FormControl(data.fechaActivacion),
        //                 fechaUltimaLiquidacion: new FormControl(
        //                     data.fechaUltimaLiquidacion
        //                 ),
        //             });
        //             this.deuda = data.deuda;
        //             this.saldoFavor = data.saldoFavor;
        //             this.estado = data.estado;
        //             this.totalCargos = 0;
        //             this.totalPagado = 0;
        //             this.totalPagos = 0;
        //             this.totalSaldo = 0;

        //             this.ordenService
        //                 .getOrdenesIdOrdenServicio(idOrdenServicio)
        //                 .subscribe((data: Orden[]) => {
        //                     this.listaOrdenes = data;
        //                 });

        //             this.loadCargos(idOrdenServicio);

        //             this.loadPagos(idOrdenServicio);

        //             // this.ordenAsignacionOntService
        //             //     .onusAsignadasOrdenServicio(idOrdenServicio)
        //             //     .subscribe((data: OrdenAsignacionOnt[]) => {
        //             //         this.listaOnus = data;
        //             //         if(this.listaOnus.length == 0 && this.abonado.plan.usaOnu == 1){
        //             //             this.botonAsingarOnu = true;
        //             //         }else{
        //             //             this.botonAsingarOnu = false;
        //             //         }
        //             //     });

        //             this.abonadoOntService.ontAsignadasOrdenServicio(idOrdenServicio).subscribe(data =>{
        //                     this.listaOnus = data;
        //                     if(this.listaOnus.length == 0 && this.abonado.plan.usaOnu == 1){
        //                         this.botonAsingarOnu = true;
        //                     }else{
        //                         this.botonAsingarOnu = false;
        //                     }
        //             })


        //         });
        // }
    }

    // loadFormTercero(tercero: Tercero) {
    //     this.form.controls['tercero'].setValue(tercero);
    //     this.form.controls['dniruc'].setValue(tercero.dniruc);
    //     this.form.controls['nombreTercero'].setValue(tercero.nombreTercero);
    // }

    // loadCargos(idOrdenServicio: number) {
    //     this.cargoService
    //         .getCargosIdOrdenServicio(idOrdenServicio)
    //         .subscribe((data: Cargo[]) => {
    //             this.listaCargos = data;
    //             this.listaCargos.map((e) => {
    //                 this.totalCargos += e.total;
    //                 this.totalPagado += e.pagado;
    //                 this.totalSaldo += e.total - e.pagado;
    //             });
    //         });
    // }

    // loadPagos(idOrdenServicio: number) {
    //     this.pagoService
    //         .getPagosIdOrdenServicio(idOrdenServicio)
    //         .subscribe((data: Pago[]) => {
    //             this.listaPagos = data;
    //             this.listaPagos.map((e) => {
    //                 this.totalPagos += e.total;
    //             });
    //         });
    // }

    newCliente(dniruc: string) {
        this.ref = this.dialogService.open(ClienteProveedorFormComponent, {
            header: 'Nuevo Cliente',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: dniruc,
        });

        this.ref.onClose.subscribe((cliente: ClienteProveedor) => {
            // if (cliente) {
            //     this.loadFormTercero(tercero);
            // }
        });

    }

    filtrarOrigen(event: any) {
        this.ubigeoService.autocomplete(event.query).subscribe((result) => {
            this.origenesFiltrados = result;
        });
    }

    filtrarDestinos(event: any) {
        this.ubigeoService.autocomplete(event.query).subscribe((result) => {
            this.destinosFiltrados = result;
        });
    }

    filtrarClientes(event: any) {
        this.clienteProveedorService.autocomplete(event.query).subscribe((result) => {
            this.clientesFiltrados = result;
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

        // const abonadoNew: OrdenServicio = new OrdenServicio();

        // abonadoNew.idOrdenServicio = this.form.value['idOrdenServicio'];
        // abonadoNew.tercero = this.form.value['tercero'];
        // abonadoNew.sector = this.form.value['sector'];
        // abonadoNew.via = this.form.value['via'];
        // abonadoNew.numero = this.form.value['numero'];
        // abonadoNew.referencia = this.form.value['referencia'];
        // abonadoNew.suministro = this.form.value['suministro'];
        // abonadoNew.cajaNap = this.form.value['cajaNap'];
        // abonadoNew.plan = this.form.value['plan'];
        // if (this.isEdit) {
        //     abonadoNew.fechaRegistro = this.form.value['fechaRegistro'];
        //     abonadoNew.fechaActivacion = this.form.value['fechaActivacion'];
        //     abonadoNew.fechaUltimaLiquidacion =
        //         this.form.value['fechaUltimaLiquidacion'];
        // } else {
        //     abonadoNew.fechaRegistro = this.fechaActual;
        //     abonadoNew.fechaActivacion = this.fechaActual;
        //     abonadoNew.fechaUltimaLiquidacion = this.fechaActual;
        // }

        // abonadoNew.latitud = this.form.value['latitud'];
        // abonadoNew.longitud = this.form.value['longitud'];
        // abonadoNew.estado = this.form.value['estado'];
        // abonadoNew.vendedor = this.form.value['vendedor'];

        // if (this.isEdit) {
        //     this.abonadoService
        //         .update(this.idOrdenServicio, abonadoNew)
        //         .subscribe((data) => {
        //             this.abonadoService.setOrdenServicioChange(data);
        //             this.messageService.add({
        //                 key: 'tc',
        //                 severity: 'success',
        //                 summary: 'Success',
        //                 detail: 'Datos actualizados correctamente',
        //                 life: 3000,
        //             });
        //         });
        // } else {
        //     this.abonadoService.save(abonadoNew).subscribe((data: OrdenServicio) => {
        //         this.router.navigate([
        //             '/pages/abonados/detalles',
        //             data.idOrdenServicio,
        //         ]);
        //     });
        // }
    }

    // buscarMigo() {
    //     if (
    //         this.form.value['dniruc'].length == 8 ||
    //         this.form.value['dniruc'].length == 11
    //     ) {
    //         this.terceroService
    //             .getByDniRuc(this.form.value['dniruc'])
    //             .subscribe((resp: any) => {
    //                 if (resp == null) {
    //                     if (
    //                         this.form.value['dniruc'].length == 8 ||
    //                         this.form.value['dniruc'].length == 11
    //                     ) {
    //                         this.newCliente(this.form.value['dniruc']);
    //                     } else {
    //                         this.messageService.add({
    //                             key: 'tc',
    //                             severity: 'info',
    //                             summary: 'Atención',
    //                             detail: 'Dato inválido',
    //                             life: 3000,
    //                         });
    //                     }
    //                 } else {
    //                     this.loadFormTercero(resp);
    //                 }
    //             });
    //     } else {
    //         this.messageService.add({
    //             key: 'tc',
    //             severity: 'info',
    //             summary: 'Atención',
    //             detail: 'Dato inválido',
    //             life: 3000,
    //         });
    //     }
    // }

    // asignarOrden(orden: Orden) {
    //     this.ref = this.dialogService.open(OrdenAsignarDialogComponent, {
    //         header: 'Asignar Orden',
    //         width: '550px',
    //         contentStyle: { overflow: 'auto' },
    //         baseZIndex: 10000,
    //         maximizable: true,
    //         data: orden,
    //     });
    // }

    // atenderOrden(orden: Orden) {
    //     this.ref = this.dialogService.open(OrdenAtenderDialogComponent, {
    //         header: 'Atender Orden',
    //         width: '550px',
    //         contentStyle: { overflow: 'auto' },
    //         baseZIndex: 10000,
    //         maximizable: true,
    //         data: orden,
    //     });
    // }

    // nuevaOrden() {
    //     this.ref = this.dialogService.open(OrdenDialogComponent, {
    //         header: 'Nueva Orden',
    //         width: '550px',
    //         contentStyle: { overflow: 'auto' },
    //         baseZIndex: 10000,
    //         maximizable: true,
    //         data: this.abonado,
    //     });
    // }

    // nuevoPago() {
    //     this.ref = this.dialogService.open(OrdenServicioPagoComponent, {
    //         header: 'Nuevo Pago',
    //         width: '600px',
    //         contentStyle: { overflow: 'auto' },
    //         baseZIndex: 10000,
    //         maximizable: true,
    //         data: this.abonado,
    //     });
    // }

    // nuevoCargo() {
    //     this.ref = this.dialogService.open(OrdenServicioCargoComponent, {
    //         header: 'Nuevo Cargo',
    //         width: '600px',
    //         contentStyle: { overflow: 'auto' },
    //         baseZIndex: 10000,
    //         maximizable: true,
    //         data: this.abonado,
    //     });
    // }

    // asignarOnt() {
    //     this.ref = this.dialogService.open(AsignarOnuDialogComponent, {
    //         header: 'Asignar ONU',
    //         width: '600px',
    //         contentStyle: { overflow: 'auto' },
    //         baseZIndex: 10000,
    //         maximizable: true,
    //         data: this.abonado,
    //     });
    // }

    // imprimirOrden(orden: Orden) {
    //     this.ordenService.imprimirOrden(orden).subscribe((data) => {
    //         const url = window.URL.createObjectURL(data);
    //         window.open(
    //             url,
    //             'ORDEN DE SERVICIO',
    //             'width=500,height=500,menubar=no'
    //         );
    //     });
    // }

    // imprimirCuentaCorriente() {
    //     this.abonadoService
    //         .imprimirCuentaCorriente(this.abonado)
    //         .subscribe((data) => {
    //             const url = window.URL.createObjectURL(data);
    //             window.open(
    //                 url,
    //                 'CUENTA CORRIENTE',
    //                 'width=500,height=500,menubar=no'
    //             );
    //         });
    // }

    // imprimirAvisoCobranza() {
    //     let lista:OrdenServicio[] = [];
    //     lista.push(this.abonado);
    //     this.abonadoService
    //         .imprimirAvisoCobranza(lista)
    //         .subscribe((data) => {
    //             const url = window.URL.createObjectURL(data);
    //             window.open(
    //                 url,
    //                 'AVISO COBRANZA',
    //                 'width=500,height=500,menubar=no'
    //             );
    //         });
    // }

    // descargarOrden(orden: Orden) {
    //     this.ordenService.imprimirOrden(orden).subscribe((data) => {
    //         const url = window.URL.createObjectURL(data);
    //         const a = document.createElement('a');
    //         a.setAttribute('style', 'display: none');
    //         document.body.appendChild(a);
    //         a.href = url;
    //         a.download = `orden_${orden.idOrden}.pdf`;

    //         a.click();
    //     });
    // }

    // eliminarCargo(cargo: Cargo) {
    //     console.log(cargo);

    //     if (cargo.pagado > 0) {
    //         this.messageService.add({
    //             key: 'tc',
    //             severity: 'error',
    //             summary: 'Operación Denegada',
    //             detail: 'El cargo registra un pago',
    //             life: 3000,
    //         });
    //         return;
    //     }
    //     if (
    //         cargo.tipoCargo.idTipoCargo == 1 &&
    //         cargo.fechaFin != this.abonado.fechaUltimaLiquidacion
    //     ) {
    //         this.messageService.add({
    //             key: 'tc',
    //             severity: 'error',
    //             summary: 'Operación Denegada',
    //             detail: 'El cargo es por MENSUALIDAD y esta no es la última generada',
    //             life: 3000,
    //         });
    //         return;
    //     }

    //     this.idCargo = cargo.idCargo;
    //     this.deleteCargoDialog = true;
    // }

    // confirmDeleteCargo() {
    //     this.deleteCargoDialog = false;

    //     this.cargoService.delete(this.idCargo).subscribe((resp) => {
    //         if (resp === 1) {
    //             this.messageService.add({
    //                 key: 'tc',
    //                 severity: 'success',
    //                 summary: 'Successful',
    //                 detail: 'Cargo eliminado con éxito',
    //                 life: 3000,
    //             });

    //             this.initForm(this.idOrdenServicio);
    //         } else {
    //             this.messageService.add({
    //                 key: 'tc',
    //                 severity: 'error',
    //                 summary: 'Error',
    //                 detail: 'No se pudo completar la operación',
    //                 life: 3000,
    //             });
    //         }
    //     });
    // }

    // eliminarPago(pago: Pago) {
    //     console.log(pago);

    //     if (pago.numero > 0) {
    //         this.messageService.add({
    //             key: 'tc',
    //             severity: 'error',
    //             summary: 'Operación Denegada',
    //             detail: 'El pago registra un comprobante, debe anular el comprobante para continuar',
    //             life: 3000,
    //         });
    //         return;
    //     }


    //     this.confirmationService.confirm({
    //         target: event.target as EventTarget,
    //         message: '¿Está seguro que desea eliminar el pago?',
    //         header: 'Confirmar',
    //         icon: 'pi pi-question',
    //         acceptButtonStyleClass: 'p-button-danger p-button-text',
    //         acceptIcon: 'none',
    //         acceptLabel: 'SI, Eliminar',
    //         rejectIcon: 'none',
    //         rejectButtonStyleClass: 'p-button-text',
    //         accept: () => {
    //             this.pagoService.delete(pago.idPago).subscribe((data) => {
    //                 this.initForm(this.idOrdenServicio);
    //             });
    //         },
    //         reject: () => {},
    //     });
    // }


}
