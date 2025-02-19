import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Comprobante } from 'src/app/admin/models/comprobante';
import { ComprobanteService } from 'src/app/admin/services/comprobante.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-comprobante-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './comprobante-form.component.html',
    styleUrl: './comprobante-form.component.scss',
})
export class ComprobanteFormComponent implements OnInit {
    comprobante: Comprobante;
    form: FormGroup;
    title: string = '';
    idEdit!: boolean;
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private comprobanteService: ComprobanteService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR COMPROBANTE';
            this.comprobante = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO COMPROBANTE';
            this.comprobante = new Comprobante();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            serie: new FormControl(this.comprobante.serie),
            numero: new FormControl(this.comprobante.numero, Validators.required),
            tipo: new FormControl(this.comprobante.tipo),
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
        const recordId = values.serie;

        if (this.idEdit) {
            this.comprobanteService.update(recordId, values).subscribe((data) => {
                this.comprobanteService.setComprobanteChange(data);
                this.comprobanteService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.comprobanteService.save(values).subscribe((data) => {
                this.comprobanteService.setComprobanteChange(data);
                this.comprobanteService.setMessageChange({
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
