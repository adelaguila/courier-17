import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Servicio } from 'src/app/admin/models/servicio';
import { ServicioService } from 'src/app/admin/services/servicio.service';


import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-servicio-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './servicio-form.component.html',
    styleUrl: './servicio-form.component.scss',
})
export class ServicioFormComponent implements OnInit {
    servicio: Servicio;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private servicioService: ServicioService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR SERVICIO';
            this.servicio = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO SERVICIO';
            this.servicio = new Servicio();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idServicio: new FormControl(this.servicio?.idServicio),
            nombreServicio: new FormControl(this.servicio?.nombreServicio, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
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
        const recordId = values.idServicio;

        if (this.isEdit) {
            this.servicioService.update(recordId, values).subscribe((data) => {
                this.servicioService.setServicioChange(data);
                this.servicioService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.servicioService.save(values).subscribe((data) => {
                this.servicioService.setServicioChange(data);
                this.servicioService.setMessageChange({
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
