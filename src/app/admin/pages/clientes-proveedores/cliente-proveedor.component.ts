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
import { ClienteProveedor } from '../../models/cliente-proveedor';
import { ClienteProveedorService } from '../../services/cliente-proveedor.service';
import { ClienteProveedorFormComponent } from './cliente-proveedor-form/cliente-proveedor-form.component';



@Component({
    templateUrl: './cliente-proveedor.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class ClienteProveedorComponent implements OnInit {
    @ViewChild('dt') table: Table;

    clientesProveedores: ClienteProveedor[] = [];

    clienteProveedor: ClienteProveedor;
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

    deleteClienteProveedorDialog: boolean = false;

    constructor(
        private clienteProveedorService: ClienteProveedorService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.clienteProveedorService.getClienteProveedorChange().subscribe((data) => {
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });

        this.clienteProveedorService.getMessageChange().subscribe((data) => {
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

    loadClientesProveedores(event: any) {
        this.rows = event.rows;
        this.sortField = event.sortField;

        if (this.sortField == undefined) {
            this.sortField = 'nombreRazonSocial';
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
        this.clienteProveedorService
            .getPaginator(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.clientesProveedores = res.content;
                this.totalRecords = res.totalElements;
                this.loading = false;
            });
    }
    new() {
        this.ref = this.dialogService.open(ClienteProveedorFormComponent, {
            header: "Nuevo Cliente/Proveedor",
            width: "70%",
            contentStyle: { overflow: "auto" },
            baseZIndex: 10000,
            maximizable: true,
        });
    }

    edit(clienteProveedor: ClienteProveedor) {
        this.clienteProveedorService.findById(clienteProveedor.idClienteProveedor).subscribe((data) => {
            this.ref = this.dialogService.open(ClienteProveedorFormComponent, {
                header: "Editar ClienteProveedor",
                width: "70%",
                contentStyle: { overflow: "auto" },
                baseZIndex: 10000,
                maximizable: true,
                data: data,
            });
        });

    }

     delete(clienteProveedor: ClienteProveedor) {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: '¿Está seguro que desea eliminar el Cliente/Proveedor?',
                header: 'Confirmar',
                icon: 'pi pi-question',
                acceptButtonStyleClass: 'p-button-danger p-button-text',
                acceptIcon: 'none',
                acceptLabel: 'SI, Eliminar',
                rejectIcon: 'none',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    this.clienteProveedorService.delete(clienteProveedor.idClienteProveedor).subscribe((resp) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'ClienteProveedor eliminado con éxito',
                            life: 3000,
                        });
                        this.clienteProveedor = new ClienteProveedor();
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
