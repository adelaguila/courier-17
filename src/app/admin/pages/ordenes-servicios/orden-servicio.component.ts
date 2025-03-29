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
import { OrdenServicio } from '../../models/orden-servicio';
import { OrdenServicioService } from '../../services/orden-servicio.service';
import { formatDate } from '@angular/common';

@Component({
    templateUrl: './orden-servicio.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class OrdenServicioComponent implements OnInit {
    @ViewChild('dt') table: Table;

    ordenes: OrdenServicio[] = [];

    ordenServicio: OrdenServicio;
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
    matchModeOptionsDate: SelectItem[];

    ref: DynamicDialogRef | undefined;

    deleteOrdenServicioDialog: boolean = false;

    constructor(
        private ordenServicioService: OrdenServicioService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.ordenServicioService.getOrdenServicioChange().subscribe((data) => {
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });

        this.ordenServicioService.getMessageChange().subscribe((data) => {
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
        this.loading = true;
    }

    loadOrdenServicios(event: any) {
        this.rows = event.rows;
        this.sortField = event.sortField;

        if (this.sortField == undefined) {
            this.sortField = 'fechaHoraRegistro';
        }

        if (event.sortOrder == 1) {
            this.sortOrder = 'ASC';
        } else {
            this.sortOrder = 'DESC';
        }

        this.currentPage = event.first / event.rows;

        console.log(event.filters);

        if (event.filters.fechaHoraRegistro != undefined) {
            if (event.filters.fechaHoraRegistro.value != null) {
                event.filters.fechaHoraRegistro.value = formatDate(
                    new Date(event.filters.fechaHoraRegistro.value),
                    'yyyy-MM-dd HH:mm:ss',
                    'en-US'
                );
            }

        }

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
        this.ordenServicioService
            .getPaginator(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.ordenes = res.content;
                this.totalRecords = res.totalElements;
                this.loading = false;
            });
    }
    new() {
        // this.ref = this.dialogService.open(OrdenServicioFormComponent, {
        //     header: "Nuevo Cliente/Proveedor",
        //     width: "550px",
        //     contentStyle: { overflow: "auto" },
        //     baseZIndex: 10000,
        //     maximizable: true,
        // });
    }

    edit(ordenServicio: OrdenServicio) {
        // this.ref = this.dialogService.open(OrdenServicioFormComponent, {
        //     header: "Editar OrdenServicio",
        //     width: "650px",
        //     contentStyle: { overflow: "auto" },
        //     baseZIndex: 10000,
        //     maximizable: true,
        //     data: ordenServicio,
        // });
    }

    delete(ordenServicio: OrdenServicio) {
        this.deleteOrdenServicioDialog = true;
        this.ordenServicio = { ...ordenServicio };
    }

    confirmDelete() {
        this.deleteOrdenServicioDialog = false;
        this.ordenServicioService
            .delete(this.ordenServicio.idOrdenServicio)
            .subscribe((resp) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'OrdenServicio eliminado con éxito',
                    life: 3000,
                });
                this.ordenServicio = new OrdenServicio();
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
