import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoOrdenServicio } from 'src/app/admin/models/tipo-orden-servicio';
import { TipoOrdenServicioService } from 'src/app/admin/services/tipo-orden-servicio.service';

import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tipo-orden-servicio-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-orden-servicio-form.component.html',
    styleUrl: './tipo-orden-servicio-form.component.scss',
})
export class TipoOrdenServicioFormComponent implements OnInit {
    tipoOrdenServicio: TipoOrdenServicio;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private tipoOrdenServicioService: TipoOrdenServicioService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {


        if (this.config.data) {
            this.title = 'EDITAR TIPO ORDEN DE SERVICIO';
            this.tipoOrdenServicio = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO ORDEN DE SERVICIO';
            this.tipoOrdenServicio = new TipoOrdenServicio();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idTipoOrdenServicio: new FormControl(this.tipoOrdenServicio?.idTipoOrdenServicio),
            nombreTipoOrdenServicio: new FormControl(
                this.tipoOrdenServicio?.nombreTipoOrdenServicio,
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
        const recordId = values.idTipoOrdenServicio;

        if (this.isEdit) {
            this.tipoOrdenServicioService.update(recordId, values).subscribe((data) => {
                this.tipoOrdenServicioService.setTipoOrdenServicioChange(data);
                this.tipoOrdenServicioService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoOrdenServicioService.save(values).subscribe((data) => {
                this.tipoOrdenServicioService.setTipoOrdenServicioChange(data);
                this.tipoOrdenServicioService.setMessageChange({
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
