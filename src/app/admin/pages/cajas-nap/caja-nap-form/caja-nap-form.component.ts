import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CajaNap } from 'src/app/admin/models/cajaNap';
import { CajaNapService } from 'src/app/admin/services/caja-nap.service';



import { PrimengModule } from 'src/app/primeng/primeng.module';

export interface Estado {
    name: string;
    code: string;
}

@Component({
    selector: 'app-caja-nap-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './caja-nap-form.component.html',
    styleUrl: './caja-nap-form.component.scss',
})
export class CajaNapFormComponent implements OnInit {
    cajaNap: CajaNap;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    estados: Estado[] | undefined;

    constructor(
        private cajaNapService: CajaNapService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR CAJA NAP';
            this.cajaNap = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO CAJA NAP';
            this.cajaNap = new CajaNap();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {

        this.estados = [
            { name: "ACTIVO", code: "A" },
            { name: "DESACTIVADO", code: "D" },
        ];

        this.form = new FormGroup({
            idCajaNap: new FormControl(this.cajaNap?.idCajaNap),
            nombreCajaNap: new FormControl(this.cajaNap?.nombreCajaNap, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            ubicacion: new FormControl(this.cajaNap?.ubicacion),
            puertos: new FormControl(this.cajaNap?.puertos, [Validators.required, Validators.min(2)]),
            estado: new FormControl(this.cajaNap?.estado, [Validators.required]),
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
        const recordId = values.idCajaNap;

        if (this.isEdit) {
            this.cajaNapService.update(recordId, values).subscribe((data) => {
                this.cajaNapService.setCajaNapChange(data);
                this.cajaNapService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.cajaNapService.save(values).subscribe((data) => {
                this.cajaNapService.setCajaNapChange(data);
                this.cajaNapService.setMessageChange({
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
