import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoIngreso } from 'src/app/admin/models/tipo-ingreso';
import { TipoIngresoService } from 'src/app/admin/services/tipo-ingreso.service';


import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tipo-ingreso-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-ingreso-form.component.html',
    styleUrl: './tipo-ingreso-form.component.scss',
})
export class TipoIngresoFormComponent implements OnInit {
    tipoIngreso: TipoIngreso;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private tipoIngresoService: TipoIngresoService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR TIPO DE INGRESO';
            this.tipoIngreso = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO DE INGRESO';
            this.tipoIngreso = new TipoIngreso();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idTipoIngreso: new FormControl(this.tipoIngreso?.idTipoIngreso),
            nombreTipoIngreso: new FormControl(
                this.tipoIngreso?.nombreTipoIngreso,
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
        const recordId = values.idTipoIngreso;

        if (this.isEdit) {
            this.tipoIngresoService.update(recordId, values).subscribe((data) => {
                this.tipoIngresoService.setTipoIngresoChange(data);
                this.tipoIngresoService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoIngresoService.save(values).subscribe((data) => {
                this.tipoIngresoService.setTipoIngresoChange(data);
                this.tipoIngresoService.setMessageChange({
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
