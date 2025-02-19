import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Ubigeo } from 'src/app/admin/models/ubigeo';
import { UbigeoService } from 'src/app/admin/services/ubigeo.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-ubigeo-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './ubigeo-form.component.html',
    styleUrl: './ubigeo-form.component.scss',
})
export class UbigeoFormComponent implements OnInit {
    ubigeo: Ubigeo;
    form: FormGroup;
    title: string = '';
    submitted = false;
    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private ubigeoService: UbigeoService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR UBIGEO';
            this.ubigeo = this.config.data;
            this.readOnlyID = false;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO UBIGEO';
            this.ubigeo = new Ubigeo();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idUbigeo: new FormControl(this.ubigeo.idUbigeo),
            codigo: new FormControl(this.ubigeo.codigo, [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
            ]),
            departamento: new FormControl(
                this.ubigeo.departamento,
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                ]
            ),
            provincia: new FormControl(this.ubigeo.provincia, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100),
            ]),
            distrito: new FormControl(this.ubigeo.distrito, [
                Validators.required,
                Validators.minLength(3),
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
        const recordId = values.idUbigeo;

        if (this.isEdit) {
            this.ubigeoService.update(recordId, values).subscribe((data) => {
                this.ubigeoService.setUbigeoChange(data);
                this.ubigeoService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.ubigeoService.save(values).subscribe((data) => {
                this.ubigeoService.setUbigeoChange(data);
                this.ubigeoService.setMessageChange({
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
