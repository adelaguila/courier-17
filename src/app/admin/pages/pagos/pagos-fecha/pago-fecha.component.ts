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

@Component({
    selector: 'app-pago-fecha',
    templateUrl: './pago-fecha.component.html',
    styleUrls: ['./pago-fecha.component.scss'],
    standalone: true,
    imports: [PrimengModule, PdfViewerModule, ReactiveFormsModule],
    providers: [MessageService, ConfirmationService, DialogService],
})
export class PagoFechaComponent implements OnInit {
    form!: FormGroup;
    date: Date[] | undefined;
    rangeDates: Date[] | undefined;
    es: any;
    pagos: Pago[] = [];

    totalGeneral: number = 0;
    totalEfectivo: number = 0;
    totalTransferencia: number = 0;

    constructor(
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

        this.form = new FormGroup({
            rango: new FormControl(0, Validators.required),
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
            .getFechaPagoBetween(inicio, fin)
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
            .exportarPorFecha(inicio, fin)
            .subscribe(data => {
                const url = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.setAttribute('style', 'display: none');
                document.body.appendChild(a);
                a.href = url;
                a.download = `pagos_por_fecha_${inicio}_${fin}.xlsx`;
                a.click();

            });
    }
}
