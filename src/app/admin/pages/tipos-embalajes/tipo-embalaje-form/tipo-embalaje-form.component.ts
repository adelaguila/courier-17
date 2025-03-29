import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoEmbalaje } from 'src/app/admin/models/tipo-embalaje';
import { TipoEmbalajeService } from 'src/app/admin/services/tipo-embalaje.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tipo-embalaje-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-embalaje-form.component.html',
    styleUrl: './tipo-embalaje-form.component.scss',
})
export class TipoEmbalajeFormComponent implements OnInit {
    tipoEmbalaje: TipoEmbalaje;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private tipoEmbalajeService: TipoEmbalajeService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {


        if (this.config.data) {
            this.title = 'EDITAR TIPO EMBALAJE';
            this.tipoEmbalaje = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO EMBALAJE';
            this.tipoEmbalaje = new TipoEmbalaje();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idTipoEmbalaje: new FormControl(this.tipoEmbalaje?.idTipoEmbalaje),
            nombreTipoEmbalaje: new FormControl(
                this.tipoEmbalaje?.nombreTipoEmbalaje,
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
        const recordId = values.idTipoEmbalaje;

        if (this.isEdit) {
            this.tipoEmbalajeService.update(recordId, values).subscribe((data) => {
                this.tipoEmbalajeService.setTipoEmbalajeChange(data);
                this.tipoEmbalajeService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoEmbalajeService.save(values).subscribe((data) => {
                this.tipoEmbalajeService.setTipoEmbalajeChange(data);
                this.tipoEmbalajeService.setMessageChange({
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
