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
import { TipoOrden } from '../../models/tipo-orden';
import { TipoOrdenService } from '../../services/tipo-orden.service';
import { TipoOrdenFormComponent } from './tipo-orden-form/tipo-orden-form.component';




@Component({
    templateUrl: './tipo-orden.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class TipoOrdenComponent implements OnInit {
    @ViewChild('dt') table: Table;

    tipoOrdenes: TipoOrden[] = [];

    tipoOrden: TipoOrden;
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

    deleteTipoOrdenDialog: boolean = false;

    constructor(
        private tipoOrdenService: TipoOrdenService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.tipoOrdenService.getTipoOrdenChange().subscribe((data) => {
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });

        this.tipoOrdenService.getMessageChange().subscribe((data) => {
            this.messageService.add(data);
        });

        this.cols = [
            { field: "idTipoOrden", header: "ID" },
            { field: "nombreTipoOrden", header: "Nombre Tipo Cargo" },
            { field: "comision", header: "Comisión" },
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

    loadTipoOrdenes(event: any) {

        console.log(event);

        this.rows = event.rows;
        this.sortField = event.sortField;

        if (this.sortField == undefined) {
            this.sortField = 'nombreTipoOrden';
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
        this.tipoOrdenService
            .getPaginator(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.tipoOrdenes = res.content;
                this.totalRecords = res.totalElements;
                this.loading = false;
            });
    }
    new() {
        this.ref = this.dialogService.open(TipoOrdenFormComponent, {
            header: 'Nuevo TipoOrden',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
        });
    }

    edit(TipoOrden: TipoOrden) {
        this.tipoOrdenService.findById(TipoOrden.idTipoOrden).subscribe((data) => {
            this.ref = this.dialogService.open(TipoOrdenFormComponent, {
                header: 'Editar TipoOrden',
                width: '550px',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: data,
            });
        });
    }

    delete(tipoOrden: TipoOrden) {
        this.deleteTipoOrdenDialog = true;
        this.tipoOrden = { ...tipoOrden };
    }

    confirmDelete() {
        this.deleteTipoOrdenDialog = false;
        this.tipoOrdenService.delete(this.tipoOrden.idTipoOrden).subscribe((resp) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'TipoOrden eliminado con éxito',
                life: 3000,
            });
            this.tipoOrden = new TipoOrden();
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
