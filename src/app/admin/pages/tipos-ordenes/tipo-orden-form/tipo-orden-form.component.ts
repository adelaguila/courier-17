import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoOrden } from 'src/app/admin/models/tipo-orden';
import { TipoOrdenService } from 'src/app/admin/services/tipo-orden.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

interface GeneraComision {
    code: number;
    name: string;
}

@Component({
    selector: 'app-tipo-orden-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-orden-form.component.html',
    styleUrl: './tipo-orden-form.component.scss',
})
export class TipoOrdenFormComponent implements OnInit {
    tipoOrden: TipoOrden;
    form: FormGroup;
    title: string = '';
    idEdit!: boolean;
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    generaComision: GeneraComision[] | undefined;

    constructor(
        private tipoOrdenService: TipoOrdenService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        this.generaComision = [
            { code: 0, name: "NO" },
            { code: 1, name: "SI" }
        ];

        if (this.config.data) {
            this.title = 'EDITAR TIPO DE ORDEN';
            this.tipoOrden = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO DE ORDEN';
            this.tipoOrden = new TipoOrden();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idTipoOrden: new FormControl(this.tipoOrden?.idTipoOrden),
            nombreTipoOrden: new FormControl(
                this.tipoOrden?.nombreTipoOrden,
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ]
            ),
            comision: new FormControl(this.tipoOrden?.comision),
        });

        setTimeout(() => {
            const comisionValue = this.form.controls['comision'].value;
            this.form.controls['comision'].setValue('');
            this.form.controls['comision'].setValue(comisionValue);
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
        const recordId = values.idtipoOrden;

        if (this.idEdit) {
            this.tipoOrdenService.update(recordId, values).subscribe((data) => {
                this.tipoOrdenService.setTipoOrdenChange(data);
                this.tipoOrdenService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoOrdenService.save(values).subscribe((data) => {
                this.tipoOrdenService.setTipoOrdenChange(data);
                this.tipoOrdenService.setMessageChange({
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
