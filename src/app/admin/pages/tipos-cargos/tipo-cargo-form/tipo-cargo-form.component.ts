import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoCargo } from 'src/app/admin/models/tipo-cargo';
import { TipoCargoService } from 'src/app/admin/services/tipo-cargo.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tipo-cargo-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-cargo-form.component.html',
    styleUrl: './tipo-cargo-form.component.scss',
})
export class TipoCargoFormComponent implements OnInit {
    tipoCargo: TipoCargo;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;


    constructor(
        private tipoCargoService: TipoCargoService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR TIPO CARGO';
            this.tipoCargo = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO CARGO';
            this.tipoCargo = new TipoCargo();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idTipoCargo: new FormControl(this.tipoCargo.idTipoCargo),
            nombreTipoCargo: new FormControl(
                this.tipoCargo.nombreTipoCargo,
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ]
            ),
            precio: new FormControl(this.tipoCargo.precio),
        });

        // setTimeout(() => {
        //     const comisionValue = this.form.controls['comision'].value;
        //     this.form.controls['comision'].setValue('');
        //     this.form.controls['comision'].setValue(comisionValue);
        // });
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
        const recordId = values.idTipoCargo;

        if (this.isEdit) {
            this.tipoCargoService.update(recordId, values).subscribe((data) => {
                this.tipoCargoService.setTipoCargoChange(data);
                this.tipoCargoService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoCargoService.save(values).subscribe((data) => {
                this.tipoCargoService.setTipoCargoChange(data);
                this.tipoCargoService.setMessageChange({
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
