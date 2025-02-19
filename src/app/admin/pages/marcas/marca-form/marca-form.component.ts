import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Marca } from 'src/app/admin/models/marca';
import { MarcaService } from 'src/app/admin/services/marca.service';


import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-marca-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './marca-form.component.html',
    styleUrl: './marca-form.component.scss',
})
export class MarcaFormComponent implements OnInit {
    marca: Marca;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private marcaService: MarcaService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR MARCA';
            this.marca = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO MARCA';
            this.marca = new Marca();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idMarca: new FormControl(this.marca?.idMarca),
            nombreMarca: new FormControl(this.marca?.nombreMarca, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
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
        const recordId = values.idMarca;

        if (this.isEdit) {
            this.marcaService.update(recordId, values).subscribe((data) => {
                this.marcaService.setMarcaChange(data);
                this.marcaService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.marcaService.save(values).subscribe((data) => {
                this.marcaService.setMarcaChange(data);
                this.marcaService.setMessageChange({
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
