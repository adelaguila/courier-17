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

import { TipoOrdenServicioFormComponent } from './tipo-orden-servicio-form/tipo-orden-servicio-form.component';
import { TipoOrdenServicioService } from '../../services/tipo-orden-servicio.service';
import { TipoOrdenServicio } from '../../models/tipo-orden-servicio';

@Component({
    templateUrl: './tipo-orden-servicio.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class TipoOrdenServicioComponent implements OnInit {
    @ViewChild('dt') table: Table;

    tiposOrdenServicios: TipoOrdenServicio[] = [];

    tipoOrdenServicio: TipoOrdenServicio;
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

    deleteTipoOrdenServicioDialog: boolean = false;

    constructor(
        private tipoOrdenServicioService: TipoOrdenServicioService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.tipoOrdenServicioService.getTipoOrdenServicioChange().subscribe((data) => {
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });

        this.tipoOrdenServicioService.getMessageChange().subscribe((data) => {
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

    loadTipoOrdenServicios(event: any) {

        console.log(event);

        this.rows = event.rows;
        this.sortField = event.sortField;

        if (this.sortField == undefined) {
            this.sortField = 'nombreTipoOrdenServicio';
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
        this.tipoOrdenServicioService
            .getPaginator(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.tiposOrdenServicios = res.content;
                this.totalRecords = res.totalElements;
                this.loading = false;
            });
    }
    new() {
        this.ref = this.dialogService.open(TipoOrdenServicioFormComponent, {
            header: 'Nuevo Tipo OrdenServicio',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
        });
    }

    edit(TipoOrdenServicio: TipoOrdenServicio) {
        this.tipoOrdenServicioService
            .findById(TipoOrdenServicio.idTipoOrdenServicio)
            .subscribe((data) => {
                this.ref = this.dialogService.open(TipoOrdenServicioFormComponent, {
                    header: 'Editar Tipo OrdenServicio',
                    width: '550px',
                    contentStyle: { overflow: 'auto' },
                    baseZIndex: 10000,
                    maximizable: true,
                    data: data,
                });
            });
    }

    delete(tipoOrdenServicio: TipoOrdenServicio) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Está seguro que desea eliminar el registro?',
            header: 'Confirmar',
            icon: 'pi pi-question',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            acceptIcon: 'none',
            acceptLabel: 'SI, Eliminar',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.tipoOrdenServicioService
                    .delete(tipoOrdenServicio.idTipoOrdenServicio)
                    .subscribe((resp) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Registro eliminado con éxito',
                            life: 3000,
                        });
                        this.getPage(
                            this.currentPage,
                            this.rows,
                            this.sortField,
                            this.sortOrder,
                            this._filterPage
                        );
                    });
            },
            reject: () => {},
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
