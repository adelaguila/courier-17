import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Liquidacion } from 'src/app/admin/models/liquidacion';
import { LiquidacionService } from 'src/app/admin/services/liquidacion.service';


import { PrimengModule } from 'src/app/primeng/primeng.module';

interface Mes {
    code: string;
    name: string;
}

@Component({
    selector: 'app-liquidacion-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './liquidacion-form.component.html',
    styleUrl: './liquidacion-form.component.scss',
})
export class LiquidacionFormComponent implements OnInit {
    liquidacion: Liquidacion;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    today = new Date();
    fecha: any;
    pipe = new DatePipe("en-US");

    meses: Mes[] | undefined;

    emision: any;
    cierre: any;
    vencimiento: any;
    corte: any;

    constructor(
        private liquidacionService: LiquidacionService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR LIQUIDACION';
            this.liquidacion = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVA LIQUIDACION';
            this.liquidacion = new Liquidacion();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.fecha = this.pipe.transform(this.today, "YYYY-MM-dd");

        this.meses = [
            { code: "01", name: "ENERO" },
            { code: "02", name: "FEBRERO" },
            { code: "03", name: "MARZO" },
            { code: "04", name: "ABRIL" },
            { code: "05", name: "MAYO" },
            { code: "06", name: "JUNIO" },
            { code: "07", name: "JUNIO" },
            { code: "08", name: "AGOSTO" },
            { code: "09", name: "SETIEMBRE" },
            { code: "10", name: "OCTUBRE" },
            { code: "11", name: "NOVIEMBRE" },
            { code: "12", name: "DICIEMBRE" },
        ];

        if (this.config.data) {
            this.liquidacion = this.config.data;

        }

        this.form = new FormGroup({
            idLiquidacion: new FormControl(this.liquidacion?.idLiquidacion),
            anio: new FormControl(this.liquidacion?.anio),
            mes: new FormControl(this.liquidacion?.periodo),
            fechaEmision: new FormControl(this.liquidacion?.fechaEmision),
            fechaCierre: new FormControl(this.liquidacion?.fechaCierre),
            fechaCorte: new FormControl(this.liquidacion?.fechaCorte),
            fechaVencimiento: new FormControl(this.liquidacion?.fechaVencimiento),
        });
    }
    get f() {
        return this.form.controls;
    }

    operate() {
        if (this.form.invalid) {
            this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'El formulario es inválido',
                life: 3000,
            });

            return;
        }

        const liquidacionNew: Liquidacion = new Liquidacion();
        liquidacionNew.idLiquidacion = this.form.value["idLiquidacion"];
        liquidacionNew.periodo = +`${this.form.value["anio"]}${this.form.value["mes"]}`;
        liquidacionNew.fechaEmision = this.form.value["fechaEmision"];
        liquidacionNew.fechaCorte = this.form.value["fechaCorte"];
        liquidacionNew.fechaCierre = this.form.value["fechaCierre"];
        liquidacionNew.fechaVencimiento = this.form.value["fechaVencimiento"];
        liquidacionNew.anio = this.form.value["anio"];

        const values = this.form.value;
        const recordId = values.idLiquidacion;

        if (this.isEdit) {
            this.liquidacionService.update(recordId, liquidacionNew).subscribe((data) => {
                this.liquidacionService.setLiquidacionChange(data);
                this.liquidacionService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.liquidacionService.save(liquidacionNew).subscribe((data) => {
                this.liquidacionService.setLiquidacionChange(data);
                this.liquidacionService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos creados correctamente',
                    life: 3000,
                });
            });
        }

        this.close();
    }

    close() {
        this.ref.close();
    }
}
