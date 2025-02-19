import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoVia } from 'src/app/admin/models/tipo-via';
import { TipoViaService } from 'src/app/admin/services/tipo-via.service';

import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tipo-via-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-via-form.component.html',
    styleUrl: './tipo-via-form.component.scss',
})
export class TipoViaFormComponent implements OnInit {
    tipoVia: TipoVia;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private tipoViaService: TipoViaService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR TIPO DE VIA';
            this.tipoVia = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO DE VIA';
            this.tipoVia = new TipoVia();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idTipoVia: new FormControl(
                this.tipoVia?.idTipoVia,
                [Validators.required, Validators.minLength(2), Validators.maxLength(5)]
              ),
              nombreTipoVia: new FormControl(
                this.tipoVia?.nombreTipoVia,
                [Validators.required, Validators.minLength(3), Validators.maxLength(150)]
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
        const recordId = values.idTipoVia;

        if (this.isEdit) {
            this.tipoViaService.update(recordId, values).subscribe((data) => {
                this.tipoViaService.setTipoViaChange(data);
                this.tipoViaService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoViaService.save(values).subscribe((data) => {
                this.tipoViaService.setTipoViaChange(data);
                this.tipoViaService.setMessageChange({
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
