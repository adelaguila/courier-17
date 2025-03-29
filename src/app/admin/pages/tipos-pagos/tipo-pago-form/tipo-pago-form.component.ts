import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoPago } from 'src/app/admin/models/tipo-pago';
import { TipoPagoService } from 'src/app/admin/services/tipo-pago.service';

import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tipo-cliente-proveedor-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-pago-form.component.html',
    styleUrl: './tipo-pago-form.component.scss',
})
export class TipoPagoFormComponent implements OnInit {
    tipoPago: TipoPago;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private tipoPagoService: TipoPagoService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {


        if (this.config.data) {
            this.title = 'EDITAR TIPO PAGO';
            this.tipoPago = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO PAGO';
            this.tipoPago = new TipoPago();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idTipoPago: new FormControl(this.tipoPago?.idTipoPago),
            nombreTipoPago: new FormControl(
                this.tipoPago?.nombreTipoPago,
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ]
            ),
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
        const recordId = values.idTipoPago;

        if (this.isEdit) {
            this.tipoPagoService.update(recordId, values).subscribe((data) => {
                this.tipoPagoService.setTipoPagoChange(data);
                this.tipoPagoService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoPagoService.save(values).subscribe((data) => {
                this.tipoPagoService.setTipoPagoChange(data);
                this.tipoPagoService.setMessageChange({
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
