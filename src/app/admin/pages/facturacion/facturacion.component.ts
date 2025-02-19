import { Component, OnInit, ViewChild } from '@angular/core';
import {
    ConfirmationService,
    FilterMatchMode,
    LazyLoadEvent,
    MessageService,
    SelectItem,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

import { UtilsService } from 'src/app/helpers/service/utils.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Facturacion } from '../../models/facturacion';
import { FacturacionService } from '../../services/facturacion.service';
import { DatePipe } from '@angular/common';
import { FacturacionNotaCreditoComponent } from './facturacion-nota-credito/facturacion-nota-credito.component';
import { FacturacionOpcionesComponent } from './facturacion-opciones/facturacion-opciones.component';
import { DSFacturacion } from '../../models/dsfacturacion';
import { DSFacturacionService } from '../../services/dsfacturacion.service';





@Component({
    templateUrl: './facturacion.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class FacturacionComponent implements OnInit {
    @ViewChild('dt') table: Table;

    facturaciones: Facturacion[] = [];

    facturacion: Facturacion;
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [10, 20, 30, 40, 50];
    loading: boolean = false;
    totalRecords!: number;
    rows = 10;
    currentPage = 1;
    _filterPage: any = '';
    sortField: string;
    sortOrder: string;

    matchModeOptionsText: SelectItem[];
    matchModeOptionsNumber: SelectItem[];

    ref: DynamicDialogRef | undefined;

    today = new Date();
    fechaActual: any;
    pipe = new DatePipe("en-US");

    motivoAnulacion: string | undefined;
    anularFacturacionDialog: boolean = false;
    deleteFacturacionDialog: boolean = false;

    constructor(
        private facturacionService: FacturacionService,
        private dsfacturacionService: DSFacturacionService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.facturacionService.getFacturacionChange().subscribe((data) => {
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });

        this.facturacionService.getMessageChange().subscribe((data) => {
            this.messageService.add(data);
        });

        this.matchModeOptionsText = [
            { label: 'Comienza con', value: FilterMatchMode.STARTS_WITH },
            { label: 'Termina con', value: FilterMatchMode.ENDS_WITH },
            { label: 'Contiene', value: FilterMatchMode.CONTAINS },
            { label: 'No contiene', value: FilterMatchMode.NOT_CONTAINS },
            { label: 'Es igual', value: FilterMatchMode.EQUALS },
            { label: 'No es igual', value: FilterMatchMode.NOT_EQUALS },
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
        this.loading = true;
    }

    loadFacturaciones(event: any) {
        this.rows = event.rows;
        this.sortField = event.sortField;

        if (this.sortField == undefined) {
            this.sortField = 'fecha';
        }

        if (event.sortOrder == 1) {
            this.sortOrder = 'ASC';
        } else {
            this.sortOrder = 'DESC';
        }

        this.currentPage = event.first / event.rows;

        this._filterPage = this.util.NestJsonFilter(event.filters);

        this.loading = true;

        this.getPage(
            this.currentPage,
            this.rows,
            this.sortField,
            this.sortOrder,
            this._filterPage
        );
    }

    getPage(
        page?: number,
        rows?: number,
        sortField?: string,
        sortOrder?: string,
        filter?: any
    ) {
        this.facturacionService
            .getPaginator(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.facturaciones = res.content;
                this.totalRecords = res.totalElements;
                this.loading = false;
            });
    }
    new() {
        // this.ref = this.dialogService.open(FacturacionFormComponent, {
        //     header: 'Nueva Facturacion',
        //     width: '550px',
        //     contentStyle: { overflow: 'auto' },
        //     baseZIndex: 10000,
        //     maximizable: true,
        // });
    }

    generarJsonComprobante(facturacion: Facturacion) {
        this.dsfacturacionService.generarJsonComprobante(facturacion.idFacturacion).subscribe((data) => {
            console.log(data);
        });
    }

    anular(facturacion: Facturacion) {
        this.fechaActual = this.pipe.transform(this.today, "YYYY-MM-dd");
        let days =
            new Date(this.fechaActual).getDay() -
            new Date(facturacion.fecha).getDay();

        // console.log("Fecha Actual", this.fechaActual);
        // console.log("FechaComprobante", facturacion.fecha);
        // console.log("Dias de diferencia", days);

        if (facturacion.estado == "ANULADA") {
            this.messageService.add({
                key: "tc",
                severity: "error",
                summary: "Operación Denegada",
                detail: "El comprobante ya está ANULADO",
                life: 3000,
            });

            return;
        }

        if (days > 7) {
            this.messageService.add({
                key: "tc",
                severity: "error",
                summary: "Operación Denegada",
                detail: "Ya pasaron más de 07 dias de la emisión del comprobante, debe generar una Nota de Crédito",
                life: 3000,
            });

            return;
        }

        this.anularFacturacionDialog = true;

        this.facturacion = { ...facturacion };
        console.log(this.facturacion);
    }

    notaCredito(facturacion: Facturacion) {
        this.ref = this.dialogService.open(FacturacionNotaCreditoComponent, {
            header: "Nota de Crédito",
            width: "550px",
            contentStyle: { overflow: "auto" },
            baseZIndex: 10000,
            maximizable: true,
            data: facturacion,
        });
    }

    reenviarSunat(facturacion: Facturacion) {
        if(facturacion.externalId == null){
            this.facturacionService.reenviarSunat(facturacion.idFacturacion).subscribe((resp) => {
                console.log(resp);
            });
        }else{
            this.messageService.add({
                key: "tc",
                severity: "error",
                summary: "Operación Denegada",
                detail: "El comprobante ya fue enviado",
                life: 3000,
            });

            return;

        }
    }

    confirmarAnulacion() {
        this.anularFacturacionDialog = false;

        const data = {
            idFacturacion: this.facturacion.idFacturacion,
            motivoAnulacion: this.motivoAnulacion,
            ticket: this.facturacion.ticket,
        };

        this.facturacionService.anularComprobante(data).subscribe((resp) => {
            if (resp == 0) {
                this.messageService.add({
                    key: "tc",
                    severity: "info",
                    summary: "Atención",
                    detail: "No se guardaron los cambios",
                    life: 3000,
                });
                return;
            }
            this.facturacion = new Facturacion();
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
            this.messageService.add({
                key: "tc",
                severity: "success",
                summary: "Atención",
                detail: "Comprobante anulado satisfactoriamente",
                life: 3000,
            });

            console.log(resp);
        });
    }



    imprimir(facturacion: Facturacion) {
        const url = facturacion.linkPdf + "/a4";
        // const url = window.URL.createObjectURL(facturacion.linkPdf + "/a4");
        var mywindow = window.open(
            url,
            "AVISO COBRANZA",
            "width=500,height=500,menubar=no"
        );

        // var mywindow = window.open('../../../app/view/Recibo/pdf-recibo-new.php?recibos=' + idrecibo, "RECIBO", "width=800,height=500,menubar=no");
        mywindow.focus(); // necessary for IE >= 10*/
        mywindow.print();
    }

    imprimirA4(facturacion: Facturacion) {
        // this.facturacionService.imprimirA4(facturacion.idFacturacion).subscribe((data) => {
        //     const url = window.URL.createObjectURL(data);
        //     window.open(
        //         url,
        //         "COMPROBANTE ELECTRONICO",
        //         "width=500,height=500,menubar=no"
        //     );
        // });
        this.ref = this.dialogService.open(FacturacionOpcionesComponent, {
            header: "Opciones",
            width: "600px",
            contentStyle: { overflow: "auto" },
            baseZIndex: 10000,
            maximizable: false,
            data: facturacion
        });
    }

    delete(facturacion: Facturacion) {
        this.deleteFacturacionDialog = true;
        this.facturacion = { ...facturacion };
    }

    confirmDelete() {
        this.deleteFacturacionDialog = false;
        this.facturacionService.delete(this.facturacion.idFacturacion).subscribe((resp) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Facturacion eliminado con éxito',
                life: 3000,
            });
            this.facturacion = new Facturacion();
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
