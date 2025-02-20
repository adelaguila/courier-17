import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SunatTipoDocumentoIdentidad } from 'src/app/admin/models/sunat-tipo-documento-identidad';
import { SunatTipoDocumentoIdentidadService } from 'src/app/admin/services/sunat-tipo-documento-identidad.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tipo-documento-identidad-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-documento-identidad-form.component.html',
    styleUrl: './tipo-documento-identidad-form.component.scss',
})
export class TipoDocumentoIdentidadFormComponent implements OnInit {
    tipoDocumentoIdentidad: SunatTipoDocumentoIdentidad;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private tipoDocumentoIdentidadService: SunatTipoDocumentoIdentidadService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {


        if (this.config.data) {
            this.title = 'EDITAR TIPO DOCUMENTO IDENTIDAD';
            this.tipoDocumentoIdentidad = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO DOCUMENTO IDENTIDAD';
            this.tipoDocumentoIdentidad = new SunatTipoDocumentoIdentidad();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idSunatTipoDocumentoIdentidad: new FormControl(this.tipoDocumentoIdentidad?.idSunatTipoDocumentoIdentidad),
            nombreSunatTipoDocumentoIdentidad: new FormControl(
                this.tipoDocumentoIdentidad?.nombreSunatTipoDocumentoIdentidad,
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ]
            ),
            digitos: new FormControl(
                this.tipoDocumentoIdentidad?.digitos
            ),
            siglas: new FormControl(
                this.tipoDocumentoIdentidad?.siglas,
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(5),
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
        const recordId = values.idSunatTipoDocumentoIdentidad;

        if (this.isEdit) {
            this.tipoDocumentoIdentidadService.update(recordId, values).subscribe((data) => {
                this.tipoDocumentoIdentidadService.setSunatTipoDocumentoIdentidadChange(data);
                this.tipoDocumentoIdentidadService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoDocumentoIdentidadService.save(values).subscribe((data) => {
                this.tipoDocumentoIdentidadService.setSunatTipoDocumentoIdentidadChange(data);
                this.tipoDocumentoIdentidadService.setMessageChange({
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
