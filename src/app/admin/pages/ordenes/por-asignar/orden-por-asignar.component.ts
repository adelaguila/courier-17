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
import { AsignarVariosDialogComponent } from '../asignar-varios-dialog/asignar-varios-dialog.component';




@Component({
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './orden-por-asignar.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class OrdenPorAsignarComponent implements OnInit {
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

    selectedOrdenes!: Orden[];


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
            this.loadOrdenes();
        });

        this.ordenService.getMessageChange().subscribe((data) => {
            this.messageService.add(data);
        });

        this.loadOrdenes();

        this.loading = true;
    }

    loadOrdenes() {
        this.ordenService.listaPorEstado('REGISTRADO').subscribe((data) => {
            this.ordenes = data;
            this.loading = false;
        })
    }

    asignarSeleccionados(){
        if(this.selectedOrdenes == undefined ||
            this.selectedOrdenes.length == 0){
            this.messageService.add({
                // key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'Debe seleccionar por lo menos una orden',
                life: 3000,
            });

            return;
        }else{
            this.ref = this.dialogService.open(AsignarVariosDialogComponent, {
                        header: "Asignar Ordenes",
                        width: "550px",
                        contentStyle: { overflow: "auto" },
                        baseZIndex: 10000,
                        maximizable: true,
                        data: this.selectedOrdenes,
                    });
        }

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
