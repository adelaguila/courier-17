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
    FilterMatchMode,
    MessageService,
    PrimeNGConfig,
    SelectItem,
} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { PagoService } from '../../../services/pago.service';
import { Pago } from 'src/app/admin/models/pago';
import { OrdenServicioService } from 'src/app/admin/services/orden-servicio.service';
import { OrdenService } from 'src/app/admin/services/orden.service';
import { OrdenServicio } from 'src/app/admin/models/orden-servicio';

@Component({
    selector: 'app-orden-servicio-fecha-registro',
    templateUrl: './orden-servicio-fecha-registro.component.html',
    styleUrls: ['./orden-servicio-fecha-registro.component.scss'],
    standalone: true,
    imports: [PrimengModule, PdfViewerModule, ReactiveFormsModule],
    providers: [MessageService, ConfirmationService, DialogService],
})
export class OrdenServicioFechaRegistroComponent implements OnInit {
    form!: FormGroup;
    date: Date[] | undefined;
    rangeDates: Date[] | undefined;
    es: any;
    ordenesServicios: OrdenServicio[] = [];

    rowsPerPageOptions = [10, 20, 30, 40, 50, 100, 500];
    loading: boolean = false;

    totalGeneral: number = 0;
    totalEfectivo: number = 0;
    totalTransferencia: number = 0;

    matchModeOptionsText: SelectItem[];
    matchModeOptionsNumber: SelectItem[];
    matchModeOptionsDate: SelectItem[];

    constructor(
        private ordenServicioService: OrdenServicioService,
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

        this.matchModeOptionsText = [
            { label: 'Comienza con', value: FilterMatchMode.STARTS_WITH },
            { label: 'Termina con', value: FilterMatchMode.ENDS_WITH },
            { label: 'Contiene', value: FilterMatchMode.CONTAINS },
            { label: 'No contiene', value: FilterMatchMode.NOT_CONTAINS },
            { label: 'Es igual', value: FilterMatchMode.EQUALS },
            { label: 'No es igual', value: FilterMatchMode.NOT_EQUALS },
        ];
        this.matchModeOptionsDate = [
            { label: 'Es igual', value: FilterMatchMode.DATE_IS },
            { label: 'No es igual', value: FilterMatchMode.DATE_IS_NOT },
        ];
        this.matchModeOptionsNumber = [
            { label: 'Es igual', value: FilterMatchMode.EQUALS },
            { label: 'No es igual', value: FilterMatchMode.NOT_EQUALS },
            { label: 'Menor que', value: FilterMatchMode.LESS_THAN },
            {
                label: 'Menor o igual que',
                value: FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
            },
            { label: 'Mayor que', value: FilterMatchMode.GREATER_THAN },
            {
                label: 'Mayor o igual que',
                value: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
            },
        ];

        this.form = new FormGroup({
            rango: new FormControl(0, Validators.required),
        });
    }

    get f() {
        return this.form.controls;
    }

    cargar() {
        const values = this.form.value;

        if (
            values.rango == undefined ||
            values.rango[0] == null ||
            values.rango[1] == null
        ) {
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
        this.loading = true;
        this.ordenServicioService
            .getFechaHoraRegistroBetween(inicio, fin)
            .subscribe((data: OrdenServicio[]) => {
                this.ordenesServicios = data;
                this.loading = false;
                // for (let item of data) {
                //     this.totalGeneral += item.total;
                //     if(item.tipoPago == 'EFECTIVO'){
                //         this.totalEfectivo += item.total;
                //     }else{
                //         this.totalTransferencia += item.total;
                //     }

                // }
            });
    }

    exportar() {
        // const values = this.form.value;
        // if(values.rango == undefined || values.rango[0] == null || values.rango[1] == null) {
        //     this.messageService.add({
        //         severity: 'info',
        //         summary: 'Info',
        //         detail: 'Falta especificar las fechas',
        //         life: 3000,
        //     });
        //     return;
        // }
        // const inicio = formatDate(
        //     new Date(values.rango[0]),
        //     'yyyy-MM-dd',
        //     'en-US'
        // );
        // const fin = formatDate(
        //     new Date(values.rango[1]),
        //     'yyyy-MM-dd',
        //     'en-US'
        // );
        // this.pagoService
        //     .exportarPorFecha(inicio, fin)
        //     .subscribe(data => {
        //         const url = window.URL.createObjectURL(data);
        //         const a = document.createElement('a');
        //         a.setAttribute('style', 'display: none');
        //         document.body.appendChild(a);
        //         a.href = url;
        //         a.download = `pagos_por_fecha_${inicio}_${fin}.xlsx`;
        //         a.click();
        //     });
    }
}
