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
import { Via } from 'src/app/admin/models/via';
import { TipoViaService } from 'src/app/admin/services/tipo-via.service';
import { ViaService } from 'src/app/admin/services/via.service';

import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-via-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './via-form.component.html',
    styleUrl: './via-form.component.scss',
})
export class ViaFormComponent implements OnInit {
    via: Via;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    tiposVias: TipoVia[] | undefined;

    constructor(
        private tipoViaService: TipoViaService,
        private viaService: ViaService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR VIA';
            this.via = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO VIA';
            this.via = new Via();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {

        this.tipoViaService.findAll().subscribe((data) => (this.tiposVias = data));

        this.form = new FormGroup({
            idVia: new FormControl(this.via?.idVia),
            tipoVia: new FormControl(this.via?.tipoVia, [
                Validators.required,
            ]),
            nombreVia: new FormControl(this.via?.nombreVia, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ])
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
        const recordId = values.idVia;

        if (this.isEdit) {
            this.viaService.update(recordId, values).subscribe((data) => {
                this.viaService.setViaChange(data);
                this.viaService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.viaService.save(values).subscribe((data) => {
                this.viaService.setViaChange(data);
                this.viaService.setMessageChange({
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
