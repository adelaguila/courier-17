import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoEgreso } from 'src/app/admin/models/tipo-egreso';
import { TipoEgresoService } from 'src/app/admin/services/tipo-egreso.service';

import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tipo-egreso-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-egreso-form.component.html',
    styleUrl: './tipo-egreso-form.component.scss',
})
export class TipoEgresoFormComponent implements OnInit {
    tipoEgreso: TipoEgreso;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private tipoEgresoService: TipoEgresoService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR TIPO DE EGRESO';
            this.tipoEgreso = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO DE EGRESO';
            this.tipoEgreso = new TipoEgreso();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idTipoEgreso: new FormControl(this.tipoEgreso?.idTipoEgreso),
            nombreTipoEgreso: new FormControl(
                this.tipoEgreso?.nombreTipoEgreso,
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
        const recordId = values.idTipoEgreso;

        if (this.isEdit) {
            this.tipoEgresoService.update(recordId, values).subscribe((data) => {
                this.tipoEgresoService.setTipoEgresoChange(data);
                this.tipoEgresoService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoEgresoService.save(values).subscribe((data) => {
                this.tipoEgresoService.setTipoEgresoChange(data);
                this.tipoEgresoService.setMessageChange({
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
