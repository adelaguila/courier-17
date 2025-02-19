import {
    AsyncPipe,
    formatDate,
    getLocaleFirstDayOfWeek,
    NgFor,
    NgIf,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import {
    ConfirmationService,
    MessageService,
    PrimeNGConfig,
} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { PagoService } from '../../../services/pago.service';
import { Pago } from 'src/app/admin/models/pago';
import { UserService } from 'src/app/admin/services/user.service';
import { map } from 'rxjs';

interface Cobrador {
    code: number;
    name: string;
}

@Component({
    selector: 'app-pago-fecha-cobrador',
    templateUrl: './pago-fecha-cobrador.component.html',
    styleUrls: ['./pago-fecha-cobrador.component.scss'],
    standalone: true,
    imports: [PrimengModule, PdfViewerModule, ReactiveFormsModule],
    providers: [MessageService, ConfirmationService, DialogService],
})
export class PagoFechaCobradorComponent implements OnInit {
    form!: FormGroup;
    date: Date[] | undefined;
    rangeDates: Date[] | undefined;
    es: any;
    pagos: Pago[] = [];

    cobradores: Cobrador[] | undefined = [{ code: 0, name: "OFICINA" }];

    totalGeneral: number = 0;
    totalEfectivo: number = 0;
    totalTransferencia: number = 0;

    constructor(
        private userService: UserService,
        private pagoService: PagoService,
        public dialogService: DialogService,
        private primengConfig: PrimeNGConfig,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.primengConfig.setTranslation({
            firstDayOfWeek: 1,
            dayNames: [
                'Domingo',
                'Lunes',
                'Martes',
                'Miercoles',
                'Jueves',
                'Viernes',
                'Sabado',
            ],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            monthNames: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
            ],
            monthNamesShort: [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic',
            ],
            today: 'Hoy',
            clear: 'Borrar',
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

        this.form = new FormGroup({
            rango: new FormControl(0, Validators.required),
            userCobrador: new FormControl("", [Validators.required]),
        });
    }

    get f() {
        return this.form.controls;
    }

    cargar() {
        const values = this.form.value;

        if(values.rango == undefined || values.rango[0] == null || values.rango[1] == null) {
            this.messageService.add({

                severity: 'info',
                summary: 'Info',
                detail: 'Falta especificar las fechas',
                life: 3000,
            });

            return;
        }

        if(values.userCobrador == undefined || values.userCobrador == null || values.userCobrador == '') {
            this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Falta seleccionar un cobrador válido',
                life: 3000,
            });

            return;
        }

        const inicio = formatDate(
            new Date(values.rango[0]),
            'yyyy-MM-dd',
            'en-US'
        );
        const fin = formatDate(
            new Date(values.rango[1]),
            'yyyy-MM-dd',
            'en-US'
        );


        this.totalGeneral = 0;
        this.totalEfectivo = 0;
        this.totalTransferencia = 0;

        this.pagoService
            .getFechaPagoBetweenAndUserCobrador(inicio, fin, values.userCobrador)
            .subscribe((data: Pago[]) => {
                this.pagos = data;


                for (let item of data) {
                    this.totalGeneral += item.total;
                    if(item.tipoPago == 'EFECTIVO'){
                        this.totalEfectivo += item.total;
                    }else{
                        this.totalTransferencia += item.total;
                    }

                }
            });
    }

    exportar() {
        const values = this.form.value;
        if(values.rango == undefined || values.rango[0] == null || values.rango[1] == null) {
            this.messageService.add({

                severity: 'info',
                summary: 'Info',
                detail: 'Falta especificar las fechas',
                life: 3000,
            });

            return;
        }

        if(values.userCobrador == undefined || values.userCobrador == null || values.userCobrador == '') {
            this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Falta seleccionar un cobrador válido',
                life: 3000,
            });

            return;
        }
        const inicio = formatDate(
            new Date(values.rango[0]),
            'yyyy-MM-dd',
            'en-US'
        );
        const fin = formatDate(
            new Date(values.rango[1]),
            'yyyy-MM-dd',
            'en-US'
        );

        this.pagoService
            .exportarPorFechaCobrador(inicio, fin, values.userCobrador)
            .subscribe(data => {
                const url = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.setAttribute('style', 'display: none');
                document.body.appendChild(a);
                a.href = url;
                a.download = `pagos_por_fecha_cobrador_${inicio}_${fin}.xlsx`;
                a.click();
                console.log(data);
            });
    }
}
