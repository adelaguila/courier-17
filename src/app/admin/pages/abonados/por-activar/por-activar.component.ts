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
import { Abonado } from 'src/app/admin/models/abonado';
import { AbonadoService } from 'src/app/admin/services/abonado.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-banco-form',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './por-activar.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class PorActivarComponent implements OnInit {
    @ViewChild('dt') table: Table;

    abonados: Abonado[] = [];

    abonado: Abonado;
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

    deleteAbonadoDialog: boolean = false;

    constructor(
        private abonadoService: AbonadoService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.abonadoService.getAbonadoChange().subscribe((data) => {});

        this.abonadoService.getMessageChange().subscribe((data) => {
            this.messageService.add(data);
        });

        // this.abonadoService.listaPorEstado('REGISTRADO').subscribe((data) => {
        //     this.abonados = data;
        //     this.loading = false;
        // });

        this.getPage();

        // this.loading = true;
    }

    getPage() {
        this.abonadoService.listaPorEstado('REGISTRADO').subscribe((data) => {
            this.abonados = data;
            this.loading = false;
        });
    }
    new() {
        // this.ref = this.dialogService.open(AbonadoFormComponent, {
        //     header: 'Nuevo Abonado',
        //     width: '550px',
        //     contentStyle: { overflow: 'auto' },
        //     baseZIndex: 10000,
        //     maximizable: true,
        // });
    }

    edit(abonado: Abonado) {
        // this.abonadoService.findById(abonado.idAbonado).subscribe((data) => {
        //     this.ref = this.dialogService.open(AbonadoFormComponent, {
        //         header: 'Editar Abonado',
        //         width: '550px',
        //         contentStyle: { overflow: 'auto' },
        //         baseZIndex: 10000,
        //         maximizable: true,
        //         data: data,
        //     });
        // });
    }

    delete(abonado: Abonado) {
        this.deleteAbonadoDialog = true;
        this.abonado = { ...abonado };
    }

    confirmDelete() {
        this.deleteAbonadoDialog = false;
        this.abonadoService.delete(this.abonado.idAbonado).subscribe((resp) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Abonado eliminado con éxito',
                life: 3000,
            });
            this.abonado = new Abonado();
            this.getPage();
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
