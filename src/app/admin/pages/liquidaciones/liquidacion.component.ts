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

import { LiquidacionFormComponent } from './liquidacion-form/liquidacion-form.component';
import { LiquidacionService } from '../../services/liquidacion.service';
import { Liquidacion } from '../../models/liquidacion';

@Component({
    templateUrl: './liquidacion.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class LiquidacionComponent implements OnInit {
    @ViewChild('dt') table: Table;

    liquidaciones: Liquidacion[] = [];

    liquidacion: Liquidacion;
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [10, 20, 30, 40, 50, 100, 500];
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

    deleteLiquidacionDialog: boolean = false;

    granTotal: number = 0;

    constructor(
        private liquidacionService: LiquidacionService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.liquidacionService.getLiquidacionChange().subscribe((data) => {
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });

        this.liquidacionService.getMessageChange().subscribe((data) => {
            this.messageService.add(data);
        });

        this.cols = [
            { field: 'idLiquidacion', header: 'ID' },
            { field: 'fechaLiquidacion', header: 'Nombre' },
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

    loadLiquidaciones(event: any) {
        this.rows = event.rows;
        this.sortField = event.sortField;

        if (this.sortField == undefined) {
            this.sortField = 'fechaLiquidacion';
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
        this.liquidacionService
            .getPaginator(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.liquidaciones = res.content;
                this.totalRecords = res.totalElements;
                this.loading = false;

                // let total = 0;
                // for (let item of this.liquidaciones) {
                //     total += item.total;
                // }

                // this.granTotal = total;
            });
    }
    new() {
        this.ref = this.dialogService.open(LiquidacionFormComponent, {
            header: 'Nueva Liquidacion',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
        });
    }

    edit(liquidacion: Liquidacion) {
        this.liquidacionService.findById(liquidacion.idLiquidacion).subscribe((data) => {
            this.ref = this.dialogService.open(LiquidacionFormComponent, {
                header: 'Editar Liquidacion',
                width: '550px',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: data,
            });
        });
    }

    delete(liquidacion: Liquidacion) {
        this.deleteLiquidacionDialog = true;
        this.liquidacion = { ...liquidacion };
    }

    confirmDelete() {
        this.deleteLiquidacionDialog = false;
        this.liquidacionService.delete(this.liquidacion.idLiquidacion).subscribe((resp) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Liquidacion eliminado con éxito',
                life: 3000,
            });
            this.liquidacion = new Liquidacion();
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

    calcularTotal() {
        // let total = 0;
        // for (let item of this.liquidaciones) {
        //     total += item.total;
        // }

        // this.granTotal = total;
    }
}
