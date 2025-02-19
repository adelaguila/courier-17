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
import { Abonado } from '../../models/abonado';
import { AbonadoService } from '../../services/abonado.service';
import { AbonadoPagoComponent } from './abonado-pago/abonado-pago.component';



@Component({
    templateUrl: './abonado.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class AbonadoComponent implements OnInit {
    @ViewChild('dt') table: Table;

    abonados: Abonado[] = [];

    abonado: Abonado;
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

    deleteAbonadoDialog: boolean = false;

    estados: any[];

    constructor(
        private abonadoService: AbonadoService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.abonadoService.getAbonadoChange().subscribe((data) => {
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });

        this.abonadoService.getMessageChange().subscribe((data) => {
            this.messageService.add(data);
        });

        this.estados = [
            { label: "REGISTRADO", value: "REGISTRADO" },
            { label: "ACTIVADO", value: "ACTIVADO" },
            { label: "CORTADO", value: "CORTADO" },
        ];

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

    getSeverity(estado: string) {
        switch (estado) {
            case "REGISTRADO":
                return "success";
            case "CORTADO":
                return "danger";
            default:
                return null;
        }
    }

    loadAbonados(event: any) {
        this.rows = event.rows;
        this.sortField = event.sortField;

        if (this.sortField == undefined) {
            this.sortField = 'nombreAbonado';
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
        this.abonadoService
            .getPaginator(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.abonados = res.content;
                this.totalRecords = res.totalElements;
                this.loading = false;
            });
    }
    new() {
        // this.ref = this.dialogService.open(AbonadoFormComponent, {
        //     header: 'Nuevo Abonado',
        //     width: '550px',
        //     contentStyle: { overflow: 'auto' },
        //     baseZIndex: 10000,
        //     maximizable: true,
        // });
    }

    edit(abonado: Abonado) {
        // this.abonadoService.findById(abonado.idAbonado).subscribe((data) => {
        //     this.ref = this.dialogService.open(AbonadoFormComponent, {
        //         header: 'Editar Abonado',
        //         width: '550px',
        //         contentStyle: { overflow: 'auto' },
        //         baseZIndex: 10000,
        //         maximizable: true,
        //         data: data,
        //     });
        // });
    }

    delete(abonado: Abonado) {
        this.deleteAbonadoDialog = true;
        this.abonado = { ...abonado };
    }

    confirmDelete() {
        this.deleteAbonadoDialog = false;
        this.abonadoService.delete(this.abonado.idAbonado).subscribe((resp) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Abonado eliminado con éxito',
                life: 3000,
            });
            this.abonado = new Abonado();
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

    nuevoPago(idAbonado: number) {
        this.abonadoService.findById(idAbonado).subscribe(data => {
            this.ref = this.dialogService.open(AbonadoPagoComponent, {
                header: "Nuevo Pago",
                width: "600px",
                contentStyle: { overflow: "auto" },
                baseZIndex: 10000,
                maximizable: true,
                data: data,
            });
        })

    }
}
