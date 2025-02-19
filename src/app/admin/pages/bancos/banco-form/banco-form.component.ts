import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Banco } from 'src/app/admin/models/banco';
import { BancoService } from 'src/app/admin/services/banco.service';


import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-banco-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './banco-form.component.html',
    styleUrl: './banco-form.component.scss',
})
export class BancoFormComponent implements OnInit {
    banco: Banco;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private bancoService: BancoService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR BANCO';
            this.banco = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO BANCO';
            this.banco = new Banco();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idBanco: new FormControl(this.banco?.idBanco),
            nombreBanco: new FormControl(this.banco?.nombreBanco, [
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
        const recordId = values.idBanco;

        if (this.isEdit) {
            this.bancoService.update(recordId, values).subscribe((data) => {
                this.bancoService.setBancoChange(data);
                this.bancoService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.bancoService.save(values).subscribe((data) => {
                this.bancoService.setBancoChange(data);
                this.bancoService.setMessageChange({
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
