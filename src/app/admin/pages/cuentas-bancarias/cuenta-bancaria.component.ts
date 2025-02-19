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
import { CuentaBancaria } from '../../models/cuenta-bancaria';
import { CuentaBancariaService } from '../../services/cuenta-bancaria.service';
import { CuentaBancariaFormComponent } from './cuenta-bancaria-form/cuenta-bancaria-form.component';

@Component({
    templateUrl: './cuenta-bancaria.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class CuentaBancariaComponent implements OnInit {
    @ViewChild('dt') table: Table;

    cuentasBancarias: CuentaBancaria[] = [];

    cuentaBancaria: CuentaBancaria;
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

    deleteCuentaBancariaDialog: boolean = false;

    constructor(
        private cuentaBancariaService: CuentaBancariaService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.cuentaBancariaService.getCuentaBancariaChange().subscribe((data) => {
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });

        this.cuentaBancariaService.getMessageChange().subscribe((data) => {
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

    loadCuentaBancarias(event: any) {
        this.rows = event.rows;
        this.sortField = event.sortField;

        if (this.sortField == undefined) {
            this.sortField = 'nombreCuentaBancaria';
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
        this.cuentaBancariaService
            .getPaginator(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.cuentasBancarias = res.content;
                this.totalRecords = res.totalElements;
                this.loading = false;
            });
    }
    new() {
        this.ref = this.dialogService.open(CuentaBancariaFormComponent, {
            header: 'Nuevo Cuenta Bancaria',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
        });
    }

    edit(cuentaBancaria: CuentaBancaria) {
        this.cuentaBancariaService.findById(cuentaBancaria.numeroCuenta).subscribe((data) => {
            this.ref = this.dialogService.open(CuentaBancariaFormComponent, {
                header: 'Editar Cuenta Bancaria',
                width: '550px',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: data,
            });
        });
    }

    delete(cuentaBancaria: CuentaBancaria) {
        this.deleteCuentaBancariaDialog = true;
        this.cuentaBancaria = { ...cuentaBancaria };
    }

    confirmDelete() {
        this.deleteCuentaBancariaDialog = false;
        this.cuentaBancariaService.delete(this.cuentaBancaria.numeroCuenta).subscribe((resp) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Cuenta Bancaria eliminado con éxito',
                life: 3000,
            });
            this.cuentaBancaria = new CuentaBancaria();
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
