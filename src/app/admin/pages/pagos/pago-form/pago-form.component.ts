import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Pago } from 'src/app/admin/models/pago';
import { PagoService } from 'src/app/admin/services/pago.service';


import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-pago-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './pago-form.component.html',
    styleUrl: './pago-form.component.scss',
})
export class PagoFormComponent implements OnInit {
    pago: Pago;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private pagoService: PagoService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR PAGO';
            this.pago = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO PAGO';
            this.pago = new Pago();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        // this.form = new FormGroup({
        //     idPago: new FormControl(this.pago?.idPago),
        //     nombrePago: new FormControl(this.pago?.nombrePago, [
        //         Validators.required,
        //         Validators.minLength(2),
        //         Validators.maxLength(100),
        //     ]),
        // });
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
        const recordId = values.idPago;

        if (this.isEdit) {
            this.pagoService.update(recordId, values).subscribe((data) => {
                this.pagoService.setPagoChange(data);
                this.pagoService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.pagoService.save(values).subscribe((data) => {
                this.pagoService.setPagoChange(data);
                this.pagoService.setMessageChange({
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
