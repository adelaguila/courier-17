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
import { Orden } from 'src/app/admin/models/orden';
import { OrdenService } from 'src/app/admin/services/orden.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { OrdenAtenderDialogComponent } from '../orden-atender-dialog/orden-atender-dialog.component';
import { OrdenAsignacionService } from 'src/app/admin/services/orden-asignacion.service';
import { OrdenAsignacion } from 'src/app/admin/models/orden-asignacion';




@Component({
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './orden-por-atender.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class OrdenPorAtenderComponent implements OnInit {
    @ViewChild('dt') table: Table;

    ordenes: OrdenAsignacion[] = [];

    ordenAsignacion: OrdenAsignacion;
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

    selectedOrdenes!: Orden[];


    constructor(
        private ordenService: OrdenService,
        private ordenAsignacionService: OrdenAsignacionService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.ordenService.getOrdenChange().subscribe((data) => {
            this.loadOrdenes();
        });

        this.ordenService.getMessageChange().subscribe((data) => {
            this.messageService.add(data);
        });

        this.loadOrdenes();

        this.loading = true;

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
    }

    loadOrdenes() {
        this.ordenService.porAtender().subscribe((data) => {
            this.ordenes = data;
            this.loading = false;
        })
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


    delete(ordenAsignacion: OrdenAsignacion) {
        this.deleteOrdenDialog = true;
        this.ordenAsignacion = { ...ordenAsignacion };
    }

    confirmDelete() {
        this.deleteOrdenDialog = false;
        this.ordenAsignacionService.delete(this.ordenAsignacion.idOrdenAsignacion).subscribe((resp) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Asignación eliminada con éxito',
                life: 3000,
            });
            this.loadOrdenes();
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
