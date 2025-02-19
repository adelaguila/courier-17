import {
    formatDate,

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

import { CierreCajaService } from '../../services/cierre-caja.service';
import { CajaMovimiento } from '../../models/caja-movimiento';

@Component({
    selector: 'app-caja-movimiento-fecha',
    templateUrl: './caja-movimiento-fecha.component.html',
    styleUrls: ['./caja-movimiento-fecha.component.scss'],
    providers: [MessageService, ConfirmationService, DialogService],
})
export class CajaMovimientoFechaComponent implements OnInit {
    form!: FormGroup;
    date: Date[] | undefined;
    rangeDates: Date[] | undefined;
    es: any;
    datos: CajaMovimiento[] = [];

    ingresosEfectivo: number = 0;
    egresosEfectivo: number = 0;
    ingresosTransferencias: number = 0;
    loading: boolean = false;

    constructor(
        private cierreCajaService: CierreCajaService,
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

        this.form = new FormGroup({
            fecha: new FormControl(0, Validators.required),
        });
    }

    get f() {
        return this.form.controls;
    }

    cargar() {
        const values = this.form.value;
        this.loading = true;
        if(values.fecha == undefined || values.fecha == 0) {
            this.messageService.add({

                severity: 'info',
                summary: 'Info',
                detail: 'Falta especificar la fecha',
                life: 3000,
            });

            return;
        }

        const fecha = formatDate(
            new Date(values.fecha),
            'yyyy-MM-dd',
            'en-US'
        );

        this.ingresosEfectivo = 0;
        this.egresosEfectivo = 0;
        this.ingresosTransferencias = 0;

        this.cierreCajaService
            .movimientosFecha(fecha)
            .subscribe((data: CajaMovimiento[]) => {
                this.datos = data;


                for (let item of data) {
                    if(item.tipoMovimiento == 'INGRESO'){
                        if(item.tipoPago == 'EFECTIVO' || item.tipoPago == 'CONTADO'){
                            this.ingresosEfectivo += item.importe;
                        }else{
                            this.ingresosTransferencias += item.importe;
                        }

                    }else{
                        this.egresosEfectivo += item.importe;
                    }

                }
                this.loading = false;

            });
    }

    exportar() {
        const values = this.form.value;

        if(values.fecha == undefined || values.fecha == 0) {
            this.messageService.add({

                severity: 'info',
                summary: 'Info',
                detail: 'Falta especificar la fecha',
                life: 3000,
            });

            return;
        }

        const fecha = formatDate(
            new Date(values.fecha),
            'yyyy-MM-dd',
            'en-US'
        );

        this.cierreCajaService
            .exportarMovimientosPorFecha(fecha)
            .subscribe(data => {
                const url = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.setAttribute('style', 'display: none');
                document.body.appendChild(a);
                a.href = url;
                a.download = `movimientos_caja_por_fecha_${fecha}.xlsx`;
                a.click();

            });
    }
}
