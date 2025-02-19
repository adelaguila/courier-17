import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';

import { PrimengModule } from 'src/app/primeng/primeng.module';

import { map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Abonado } from 'src/app/admin/models/abonado';
import { Cargo } from 'src/app/admin/models/cargo';
import { CuentaBancaria } from 'src/app/admin/models/cuenta-bancaria';
import { Comprobante } from 'src/app/admin/models/comprobante';
import { User } from 'src/app/admin/models/user';
import { AbonadoService } from 'src/app/admin/services/abonado.service';
import { TerceroService } from 'src/app/admin/services/cliente-proveedor.service';
import { CargoService } from 'src/app/admin/services/cargo.service';
import { PagoService } from 'src/app/admin/services/pago.service';
import { UserService } from 'src/app/admin/services/user.service';
import { CuentaBancariaService } from 'src/app/admin/services/cuenta-bancaria.service';
import { ComprobanteService } from 'src/app/admin/services/comprobante.service';
import { PagoGeneraComprobante } from 'src/app/admin/models/pago-genera-comprobante';
import { PagoComprobante } from 'src/app/admin/models/pago-comprobante';
import { Pago } from 'src/app/admin/models/pago';
import { Facturacion } from 'src/app/admin/models/facturacion';
import { FacturacionOpcionesComponent } from '../../facturacion/facturacion-opciones/facturacion-opciones.component';
import { FacturacionService } from 'src/app/admin/services/facturacion.service';

interface TipoPago {
    code: string;
    name: string;
}

interface Cobrador {
    code: number;
    name: string;
}

@Component({
    selector: 'app-abonado-pago',
    templateUrl: './abonado-pago.component.html',
    styleUrls: ['./abonado-pago.component.scss'],
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule, RouterLink, NgIf],
    providers: [DialogService, MessageService],
})
export class AbonadoPagoComponent implements OnInit {
    abonado!: Abonado;
    facturacion!: number;
    form!: FormGroup;
    title: string = 'Registrar Pago';
    submitted = false;
    tiposPagos: TipoPago[] | undefined;
    cobradores: Cobrador[] | undefined = [{ code: 0, name: 'OFICINA' }];
    cargosPendientes: Cargo[] | undefined = [];
    cuentasBancarias: CuentaBancaria[] | undefined;
    comprobantes: Comprobante[] | undefined = [];
    today = new Date();
    fechaPago: any;
    pipe = new DatePipe('en-US');
    userRegistro: User;
    tercerosFiltrados = [];

    isEdit!: boolean;

    constructor(
        private abonadoService: AbonadoService,
        private terceroService: TerceroService,
        private cargoService: CargoService,
        private pagoService: PagoService,
        private userService: UserService,
        private cuentaBancariaService: CuentaBancariaService,
        private comprobanteService: ComprobanteService,
        private facturacionService: FacturacionService,
        public ref: DynamicDialogRef,
        private cd: ChangeDetectorRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService,
        public dialogService: DialogService
    ) {}

    ngOnInit(): void {
        const helper = new JwtHelperService();
        const decodeToken = helper.decodeToken(
            localStorage.getItem(environment.TOKEN_NAME)
        );
        this.userService
            .findOneByUsername(decodeToken.sub)
            .subscribe((user) => {
                this.userRegistro = user;
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
                    let vendedor: Cobrador = {
                        code: e.idUser,
                        name: e.name,
                    };
                    this.cobradores.push(vendedor);
                });
            });

        this.tiposPagos = [
            { code: 'EFECTIVO', name: 'EFECTIVO' },
            { code: 'TARJETA', name: 'TARJETA' },
            { code: 'TRANSFERENCIA', name: 'TRANSFERENCIA' },
            { code: 'PLIN', name: 'PLIN' },
            { code: 'YAPE', name: 'YAPE' },
        ];

        this.abonado = this.config.data;
        this.abonado.tercero.dnirucNombreTercero = `${this.abonado.tercero.dniruc} - ${this.abonado.tercero.nombreTercero}`;

        this.cargoService
            .getCargosIdAbonado(this.abonado.idAbonado)
            .subscribe((data: Cargo[]) => {
                data.map((cargo) => {
                    if (cargo.total > cargo.pagado) {
                        this.cargosPendientes.push(cargo);
                    }
                });
            });

        this.cuentaBancariaService
            .findAll()
            .subscribe(
                (data: CuentaBancaria[]) => (this.cuentasBancarias = data)
            );

        this.comprobanteService.findAll().subscribe((data: Comprobante[]) => {
            data.map((comprobante) => {
                if (comprobante.tipo == '01' || comprobante.tipo == '03') {
                    this.comprobantes.push(comprobante);
                }
            });
        });

        this.fechaPago = this.pipe.transform(this.today, 'YYYY-MM-dd');

        this.form = new FormGroup({
            idPago: new FormControl(0),
            tipoPago: new FormControl('', [Validators.required]),
            fechaPago: new FormControl(this.fechaPago, [Validators.required]),
            referencia: new FormControl('', [Validators.required]),
            cuentaBancaria: new FormControl(''),
            comprobante: new FormControl(''),
            userCobrador: new FormControl('', [Validators.required]),
            total: new FormControl(this.abonado.deuda, [
                Validators.required,
                Validators.min(0.5),
            ]),
            tercero: new FormControl(this.abonado.tercero),
        });
    }

    get f() {
        return this.form.controls;
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

        const pagoNew: Pago = new Pago();
        pagoNew.idPago = this.form.value['idPago'];
        this.abonado.tercero.direcciones = null;
        pagoNew.abonado = this.abonado;
        pagoNew.tipoPago = this.form.value['tipoPago'];
        pagoNew.fechaPago = this.form.value['fechaPago'];
        pagoNew.referencia = this.form.value['referencia'];
        if (this.form.value['cuentaBancaria'] instanceof CuentaBancaria) {
            pagoNew.cuentaBancaria = this.form.value['cuentaBancaria'];
        } else {
            pagoNew.cuentaBancaria = null;
        }
        pagoNew.total = this.form.value['total'];
        pagoNew.userRegistro = this.userRegistro.idUser;
        pagoNew.userCobrador = this.form.value['userCobrador'];

        const pagoGeneraComprobante: PagoGeneraComprobante =
            new PagoGeneraComprobante();

        pagoGeneraComprobante.tercero = this.form.value['tercero'];

        if (this.form.value['comprobante'] == '') {
            pagoGeneraComprobante.comprobante = new Comprobante();
        } else {
            pagoGeneraComprobante.comprobante = this.form.value['comprobante'];
        }
        if (pagoGeneraComprobante.comprobante) {
            if (
                pagoGeneraComprobante.comprobante.tipo == '01' &&
                pagoGeneraComprobante.tercero.dniruc.length != 11
            ) {
                this.messageService.add({
                    key: 'tc',
                    severity: 'error',
                    summary: 'RUC Inválido',
                    detail: 'El RUC es inválido',
                    life: 3000,
                });
                return;
            }
            if (
                pagoGeneraComprobante.comprobante.tipo == '03' &&
                pagoGeneraComprobante.tercero.dniruc.length != 8
            ) {
                this.messageService.add({
                    key: 'tc',
                    severity: 'error',
                    summary: 'DNI Inválido',
                    detail: 'El DNI es inválido',
                    life: 3000,
                });
                return;
            }
        }

        if (pagoNew.total > 0) {
            const pagoComprobante: PagoComprobante = new PagoComprobante();
            pagoComprobante.pago = pagoNew;
            pagoComprobante.pagoGeneraComprobante = pagoGeneraComprobante;
            console.log(pagoComprobante);
            this.pagoService
                .savePagoComprobante(pagoComprobante)
                .subscribe((data: any) => {
                    console.log('DATOS PAGOS: ', data);
                    if (data.facturacion != null) {
                        this.facturacion = data.facturacion;
                        this.facturacionService
                            .findById(data.facturacion)
                            .subscribe((data: Facturacion) => {
                                this.imprimirComprobante(data);
                            });
                    } else {
                        this.facturacion = 0;
                        this.imprimirPago(data.pago);
                    }

                    this.pagoService.setPagoChange(data);
                    this.abonadoService.setAbonadoChange(data);
                    this.abonadoService.setOrdenChange(this.abonado.idAbonado);
                    this.pagoService.setMessageChange({
                        key: 'tc',
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Datos registrados correctamente',
                        life: 3000,
                    });

                    this.close();
                });
        } else {
            this.messageService.add({
                key: 'tc',
                severity: 'info',
                summary: 'Total Inválido',
                detail: 'El total pagado debe ser mayo a 0',
                life: 3000,
            });
            return;
        }
    }

    // dialogOpciones(idFacturacion: number) {
    //     this.ref = this.dialogService.open(FacturacionOpcionesComponent, {
    //         header: "Opciones",
    //         width: "600px",
    //         contentStyle: { overflow: "auto" },
    //         baseZIndex: 10000,
    //         maximizable: false,
    //         data: idFacturacion
    //     });
    // }

    buscarMigo() {
        if (
            this.form.value['dniruc'].length == 8 ||
            this.form.value['dniruc'].length == 11
        ) {
            this.terceroService
                .getByDniRuc(this.form.value['dniruc'])
                .subscribe((resp: any) => {
                    if (resp == null) {
                        this.messageService.add({
                            key: 'tc',
                            severity: 'info',
                            summary: 'Atención',
                            detail: 'Dato inválido',
                            life: 3000,
                        });
                    } else {
                        console.log(resp);
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

    filtrarTerceros(event: any) {
        this.terceroService.autocomplete(event.query).subscribe((result) => {
            this.tercerosFiltrados = result;
        });
    }

    close() {
        let data = {
            abonado: this.abonado,
            facturacion: this.facturacion,
        };
        this.ref.close(data);
    }

    imprimirComprobante(facturacion: Facturacion) {
        this.ref = this.dialogService.open(FacturacionOpcionesComponent, {
            header: 'Opciones',
            width: '600px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: false,
            data: facturacion,
        });
    }

    imprimirPago(idPago: number) {
        this.pagoService
            .imprimirPago(idPago)
            .subscribe((data) => {
                const url = window.URL.createObjectURL(data);
                window.open(
                    url,
                    'VOUCHER PAGO',
                    'width=500,height=500,menubar=no'
                );
                this.close();
            });
    }
}
