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

import { OrdenFormComponent } from './orden-form/orden-form.component';
import { Orden } from '../../models/orden';
import { OrdenService } from '../../services/orden.service';
import { OrdenAsignarDialogComponent } from './orden-asignar-dialog/orden-asignar-dialog.component';
import { OrdenAtenderDialogComponent } from './orden-atender-dialog/orden-atender-dialog.component';


@Component({
    templateUrl: './orden.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class OrdenComponent implements OnInit {
    @ViewChild('dt') table: Table;

    ordenes: Orden[] = [];

    orden: Orden;
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

    deleteOrdenDialog: boolean = false;

    constructor(
        private ordenService: OrdenService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.ordenService.getOrdenChange().subscribe((data) => {
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });

        this.ordenService.getMessageChange().subscribe((data) => {
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

    loadOrdenes(event: any) {
        this.rows = event.rows;
        this.sortField = event.sortField;

        if (this.sortField == undefined) {
            this.sortField = 'nombreOrden';
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
        this.ordenService
            .getPaginator(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.ordenes = res.content;
                this.totalRecords = res.totalElements;
                this.loading = false;
            });
    }
    new() {
        this.ref = this.dialogService.open(OrdenFormComponent, {
            header: 'Nueva Orden',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
        });
    }

    edit(orden: Orden) {
        this.ordenService.findById(orden.idOrden).subscribe((data) => {
            this.ref = this.dialogService.open(OrdenFormComponent, {
                header: 'Editar Orden',
                width: '550px',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: data,
            });
        });
    }

    asignarOrden(orden: Orden) {
        this.ordenService.findById(orden.idOrden).subscribe((data) => {
            this.ref = this.dialogService.open(OrdenAsignarDialogComponent, {
                header: "Asignar Orden",
                width: "550px",
                contentStyle: { overflow: "auto" },
                baseZIndex: 10000,
                maximizable: true,
                data: data,
            });
        });
    }

    atenderOrden(orden: Orden) {
        this.ref = this.dialogService.open(OrdenAtenderDialogComponent, {
            header: "Atender Orden",
            width: "550px",
            contentStyle: { overflow: "auto" },
            baseZIndex: 10000,
            maximizable: true,
            data: orden,
        });
    }

    imprimirOrden(orden: Orden) {
        this.ordenService.imprimirOrden(orden).subscribe((data) => {
            const url = window.URL.createObjectURL(data);
            window.open(
                url,
                "ORDEN DE SERVICIO",
                "width=500,height=500,menubar=no"
            );
        });
    }


    delete(orden: Orden) {
        this.deleteOrdenDialog = true;
        this.orden = { ...orden };
    }

    confirmDelete() {
        this.deleteOrdenDialog = false;
        this.ordenService.delete(this.orden.idOrden).subscribe((resp) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Orden eliminado con éxito',
                life: 3000,
            });
            this.orden = new Orden();
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
