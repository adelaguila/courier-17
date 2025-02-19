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

import { CajaNapFormComponent } from './caja-nap-form/caja-nap-form.component';
import { CajaNap } from '../../models/cajaNap';
import { CajaNapService } from '../../services/caja-nap.service';


@Component({
    templateUrl: './caja-nap.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class CajaNapComponent implements OnInit {
    @ViewChild('dt') table: Table;

    cajasNap: CajaNap[] = [];

    cajaNap: CajaNap;
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

    deleteCajaNapDialog: boolean = false;

    constructor(
        private cajaNapService: CajaNapService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.cajaNapService.getCajaNapChange().subscribe((data) => {
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });

        this.cajaNapService.getMessageChange().subscribe((data) => {
            this.messageService.add(data);
        });

        this.cols = [
            { field: "idCajaNap", header: "ID" },
            { field: "nombreCajaNap", header: "Nombre Caja Nap" },
            { field: "ubicacion", header: "Ubicación" },
            { field: "puertos", header: "Puertos" },
            { field: "estado", header: "Estado" },
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

    loadCajasNaps(event: any) {
        this.rows = event.rows;
        this.sortField = event.sortField;

        if (this.sortField == undefined) {
            this.sortField = 'nombreCajaNap';
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
        this.cajaNapService
            .getPaginator(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.cajasNap = res.content;
                this.totalRecords = res.totalElements;
                this.loading = false;
            });
    }
    new() {
        this.ref = this.dialogService.open(CajaNapFormComponent, {
            header: 'Nueva Caja Nap',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
        });
    }

    edit(cajaNap: CajaNap) {
        this.cajaNapService.findById(cajaNap.idCajaNap).subscribe((data) => {
            this.ref = this.dialogService.open(CajaNapFormComponent, {
                header: 'Editar Caja Nap',
                width: '550px',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: data,
            });
        });
    }

    delete(cajaNap: CajaNap) {
        this.deleteCajaNapDialog = true;
        this.cajaNap = { ...cajaNap };
    }

    confirmDelete() {
        this.deleteCajaNapDialog = false;
        this.cajaNapService.delete(this.cajaNap.idCajaNap).subscribe((resp) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Caja Nap eliminado con éxito',
                life: 3000,
            });
            this.cajaNap = new CajaNap();
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
