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

import { TarifarioFormComponent } from './tarifario-form/tarifario-form.component';
import { Tarifario } from '../../models/tarifario';
import { TarifarioService } from '../../services/tarifario.service';
import { ClienteProveedorService } from '../../services/cliente-proveedor.service';
import { ClienteProveedor } from '../../models/cliente-proveedor';

interface Opciones {
    code: string;
    name: string;
}

@Component({
    templateUrl: './tarifario.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class TarifarioComponent implements OnInit {
    @ViewChild('dt') table: Table;

    tarifarios: Tarifario[] = [];

    tarifario: Tarifario;
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

    opciones: Opciones[];
    opcionSeleccionada: Opciones | undefined;
    clienteSeleccionado: ClienteProveedor;
    clientesFiltrados = [];

    ref: DynamicDialogRef | undefined;

    deleteTarifarioDialog: boolean = false;

    showFiltroCliente: boolean = false;

    constructor(
        private tarifarioService: TarifarioService,
        private clienteProveedorService: ClienteProveedorService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.opciones = [
            { code: 'GENERAL', name: 'GENERAL' },
            { code: 'CLIENTE', name: 'POR CLIENTE' },
        ];

        // this.tarifarioService.getTarifarioChange().subscribe((data) => {
        //     this.getPage(
        //         this.currentPage,
        //         this.rows,
        //         this.sortField,
        //         this.sortOrder,
        //         this._filterPage
        //     );
        // });

        this.tarifarioService.getMessageChange().subscribe((data) => {
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
        this.cargar();
        // this.loading = true;
    }

    cargar() {
        this.loading = true;
        if (this.opcionSeleccionada !== undefined) {
            if (this.opcionSeleccionada.code == 'GENERAL') {
                this.tarifarioService.getTarifaGeneral().subscribe((res) => {
                    this.tarifarios = res;
                    this.totalRecords = res.length;
                    this.loading = false;
                });
            }
            if (this.opcionSeleccionada.code == 'CLIENTE') {
                this.tarifarioService
                    .getTarifaCliente(
                        this.clienteSeleccionado.idClienteProveedor
                    )
                    .subscribe((res) => {
                        this.tarifarios = res;
                        this.loading = false;
                    });
            }
        } else {
            this.tarifario = null;
            this.loading = false;
        }
    }

    onOpcionChange($event) {
        console.log($event);
        this.opcionSeleccionada = $event.value;
        console.log(this.opcionSeleccionada);
        if (this.opcionSeleccionada.code == 'CLIENTE') {
            this.showFiltroCliente = true;
        } else {
            this.cargar();
            this.showFiltroCliente = false;
        }
    }

    onClienteSelect($event) {
        this.clienteSeleccionado = $event.value;
        console.log(this.clienteSeleccionado);
    }

    filtrarClientes(event: any) {
        this.clienteProveedorService
            .autocomplete(event.query)
            .subscribe((result) => {
                this.clientesFiltrados = result;
            });
    }

    loadTarifarios(event: any) {
        this.rows = event.rows;
        this.sortField = event.sortField;

        if (this.sortField == undefined) {
            this.sortField = 'destino';
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
        this.tarifarioService
            .getPaginator(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.tarifarios = res.content;
                this.totalRecords = res.totalElements;
                this.loading = false;
            });
    }
    new() {
        this.ref = this.dialogService.open(TarifarioFormComponent, {
            header: 'Nueva Tarifa',
            width: '550px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
        });
        this.ref.onClose.subscribe((tarifa: Tarifario) => {
            if (tarifa) {
                let tarifas: Tarifario[] = this.tarifarios;
                tarifas.push(tarifa);
                this.tarifarios = tarifas;

            }
        });
    }

    edit(tarifario: Tarifario) {
        this.tarifarioService
            .findById(tarifario.idTarifario)
            .subscribe((data) => {
                this.ref = this.dialogService.open(TarifarioFormComponent, {
                    header: 'Editar Tarifario',
                    width: '650px',
                    contentStyle: { overflow: 'auto' },
                    baseZIndex: 10000,
                    maximizable: true,
                    data: data,
                });
                this.ref.onClose.subscribe((tarifa: Tarifario) => {
                    if (tarifa) {
                        this.tarifarios = this.tarifarios.map((t) => {
                            if (t.idTarifario === tarifa.idTarifario) {
                                t = { ...tarifa };
                            }
                            return t;
                        });
                    }
                });
            });
    }

    // delete(tarifario: Tarifario) {
    //     this.deleteTarifarioDialog = true;
    //     this.tarifario = { ...tarifario };
    // }

    delete(tarifario: Tarifario) {
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
                    this.tarifarioService
                        .delete(tarifario.idTarifario)
                        .subscribe((resp) => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Registro eliminado con éxito',
                                life: 3000,
                            });
                            this.tarifarios = this.tarifarios.filter(t => t.idTarifario !== tarifario.idTarifario);
                        });
                },
                reject: () => {},
            });
        }



    confirmDelete() {
        this.deleteTarifarioDialog = false;
        this.tarifarioService
            .delete(this.tarifario.idTarifario)
            .subscribe((resp) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Tarifa eliminado con éxito',
                    life: 3000,
                });
                this.tarifario = new Tarifario();
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
