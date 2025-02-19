import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoAgencia } from 'src/app/admin/models/tipo-agencia';
import { TipoAgenciaService } from 'src/app/admin/services/tipo-agencia.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tipo-agencia-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-agencia-form.component.html',
    styleUrl: './tipo-agencia-form.component.scss',
})
export class TipoAgenciaFormComponent implements OnInit {
    tipoAgencia: TipoAgencia;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private tipoAgenciaService: TipoAgenciaService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {


        if (this.config.data) {
            this.title = 'EDITAR TIPO AGENCIA';
            this.tipoAgencia = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO AGENCIA';
            this.tipoAgencia = new TipoAgencia();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idTipoAgencia: new FormControl(this.tipoAgencia?.idTipoAgencia),
            nombreTipoAgencia: new FormControl(
                this.tipoAgencia?.nombreTipoAgencia,
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
        const recordId = values.idtipoAgencia;

        if (this.isEdit) {
            this.tipoAgenciaService.update(recordId, values).subscribe((data) => {
                this.tipoAgenciaService.setTipoAgenciaChange(data);
                this.tipoAgenciaService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoAgenciaService.save(values).subscribe((data) => {
                this.tipoAgenciaService.setTipoAgenciaChange(data);
                this.tipoAgenciaService.setMessageChange({
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
