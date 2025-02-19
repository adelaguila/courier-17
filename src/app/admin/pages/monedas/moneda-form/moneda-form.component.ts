import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Moneda } from 'src/app/admin/models/moneda';
import { MonedaService } from 'src/app/admin/services/moneda.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

interface UsaONU {
    code: number;
    name: string;
}

interface Estado {
    name: string;
    code: string;
}

@Component({
    selector: 'app-moneda-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './moneda-form.component.html',
    styleUrl: './moneda-form.component.scss',
})
export class MonedaFormComponent implements OnInit {
    moneda: Moneda;
    form: FormGroup;
    title: string = '';
    idEdit!: boolean;
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private monedaService: MonedaService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {
        if (this.config.data) {
            this.title = 'EDITAR SECTOR';
            this.moneda = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;
        } else {
            this.title = 'NUEVO SECTOR';
            this.moneda = new Moneda();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            codigo: new FormControl(this.moneda.codigo, [Validators.required]),
            nombreMoneda: new FormControl(this.moneda.nombreMoneda, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            simbolo: new FormControl(this.moneda.simbolo, [
                Validators.required,
            ]),
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

        const values = this.form.value;
        const recordId = values.codigo;

        if (this.idEdit) {
            this.monedaService.update(recordId, values).subscribe((data) => {
                this.monedaService.setMonedaChange(data);
                this.monedaService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.monedaService.save(values).subscribe((data) => {
                this.monedaService.setMonedaChange(data);
                this.monedaService.setMessageChange({
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
