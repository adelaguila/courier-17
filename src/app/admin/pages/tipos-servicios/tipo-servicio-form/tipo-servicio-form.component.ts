import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoServicio } from 'src/app/admin/models/tipo-servicio';
import { TipoServicioService } from 'src/app/admin/services/tipo-servicio.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tipo-cliente-proveedor-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-servicio-form.component.html',
    styleUrl: './tipo-servicio-form.component.scss',
})
export class TipoServicioFormComponent implements OnInit {
    tipoServicio: TipoServicio;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private tipoServicioService: TipoServicioService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {


        if (this.config.data) {
            this.title = 'EDITAR TIPO SERVICIO';
            this.tipoServicio = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO SERVICIO';
            this.tipoServicio = new TipoServicio();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idTipoServicio: new FormControl(this.tipoServicio?.idTipoServicio),
            nombreTipoServicio: new FormControl(
                this.tipoServicio?.nombreTipoServicio,
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
        const recordId = values.idTipoServicio;

        if (this.isEdit) {
            this.tipoServicioService.update(recordId, values).subscribe((data) => {
                this.tipoServicioService.setTipoServicioChange(data);
                this.tipoServicioService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoServicioService.save(values).subscribe((data) => {
                this.tipoServicioService.setTipoServicioChange(data);
                this.tipoServicioService.setMessageChange({
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
