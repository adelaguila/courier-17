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
import { SectorService } from 'src/app/admin/services/sector.service';
import { AbonadoPagoComponent } from '../abonado-pago/abonado-pago.component';

interface Parametro {
    code: string;
    name: string;
}

@Component({
    selector: 'app-banco-form',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './morosos.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class MorososComponent implements OnInit {
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
    parametros: Parametro[] | undefined;
    ref: DynamicDialogRef | undefined;

    deleteAbonadoDialog: boolean = false;

    totalGeneral: number = 0;

    // sectores: any[] | undefined;

    selectedSector: any;
    selectedParametro: any;

    constructor(
        private abonadoService: AbonadoService,
        private messageService: MessageService,
        private sectorService: SectorService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.abonadoService.getAbonadoChange().subscribe((data) => {});

        this.abonadoService.getAbonadoChange().subscribe((data) => {
            this.getPage();
        });


        this.abonadoService.getMessageChange().subscribe((data) => {
            this.messageService.add(data);
        });

        // this.sectorService.findAll().subscribe((data) => {
        //     this.sectores = data;
        // });

        this.parametros = [
            { code: '01mes', name: '01 MES' },
            { code: '02meses', name: '02 MESES' },
            { code: '03meses', name: '03 MESES' },
            { code: 'mayor03meses', name: 'MAYOR 03 MESES' },
        ];

    }

    getPage() {
        this.loading = true;
        this.abonadoService.porCobrar(this.selectedParametro.code).subscribe((data) => {
            this.abonados = data;
            this.loading = false;

            for (let item of data) {
                this.totalGeneral += item.deuda;
            }
        });
    }
    cargar() {
        console.log(this.selectedParametro);
        this.totalGeneral = 0;
        if(this.selectedParametro == null) {
            this.messageService.add({
                // key: "tc",
                severity: "info",
                summary: "Info",
                detail: "Debe seleccionar un parametro para continuar",
                life: 3000,
            });

            return;
        }

       this.getPage();

    }

    delete(abonado: Abonado) {
        this.deleteAbonadoDialog = true;
        this.abonado = { ...abonado };
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    nuevoPago(idAbonado: number) {
        this.abonadoService.findById(idAbonado).subscribe(data => {
            this.ref = this.dialogService.open(AbonadoPagoComponent, {
                header: "Nuevo Pago",
                width: "600px",
                contentStyle: { overflow: "auto" },
                baseZIndex: 10000,
                maximizable: true,
                data: data,
            });
        })

    }

    exportar() {
        if(this.selectedParametro == null) {
            this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: "Debe seleccionar un parametro para continuar",
                life: 3000,
            });

            return;
        }


        this.abonadoService.reportePorCobrar('EXCEL', this.selectedParametro.code).subscribe(data => {
                const url = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.setAttribute('style', 'display: none');
                document.body.appendChild(a);
                a.href = url;
                a.download = `por_cobrar${this.selectedParametro.code}.xlsx`;
                a.click();
                console.log(data);
            });
    }

    imprimir(){

        if(this.selectedParametro == null) {
            this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: "Debe seleccionar un parametro para continuar",
                life: 3000,
            });

            return;
        }

        this.abonadoService.reportePorCobrar('PDF', this.selectedParametro.code).subscribe((data) => {
            const url = window.URL.createObjectURL(data);
            window.open(
                url,
                "CUENTA CORRIENTE",
                "width=500,height=500,menubar=no"
            );
        });
    }

}
