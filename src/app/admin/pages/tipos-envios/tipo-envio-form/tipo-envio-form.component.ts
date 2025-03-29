import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoEnvio } from 'src/app/admin/models/tipo-envio';
import { TipoEnvioService } from 'src/app/admin/services/tipo-envio.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tipo-cliente-proveedor-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-envio-form.component.html',
    styleUrl: './tipo-envio-form.component.scss',
})
export class TipoEnvioFormComponent implements OnInit {
    tipoEnvio: TipoEnvio;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private tipoEnvioService: TipoEnvioService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {


        if (this.config.data) {
            this.title = 'EDITAR TIPO ENVIO';
            this.tipoEnvio = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO ENVIO';
            this.tipoEnvio = new TipoEnvio();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idTipoEnvio: new FormControl(this.tipoEnvio?.idTipoEnvio),
            nombreTipoEnvio: new FormControl(
                this.tipoEnvio?.nombreTipoEnvio,
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
        const recordId = values.idTipoEnvio;

        if (this.isEdit) {
            this.tipoEnvioService.update(recordId, values).subscribe((data) => {
                this.tipoEnvioService.setTipoEnvioChange(data);
                this.tipoEnvioService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoEnvioService.save(values).subscribe((data) => {
                this.tipoEnvioService.setTipoEnvioChange(data);
                this.tipoEnvioService.setMessageChange({
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
