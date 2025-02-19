import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoClienteProveedor } from 'src/app/admin/models/tipo-cliente-proveedor';
import { TipoClienteProveedorService } from 'src/app/admin/services/tipo-cliente-proveedor.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tipo-cliente-proveedor-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tipo-cliente-proveedor-form.component.html',
    styleUrl: './tipo-cliente-proveedor-form.component.scss',
})
export class TipoClienteProveedorFormComponent implements OnInit {
    tipoClienteProveedor: TipoClienteProveedor;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private tipoClienteProveedorService: TipoClienteProveedorService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {


        if (this.config.data) {
            this.title = 'EDITAR TIPO CLIENTE PROVEEDOR';
            this.tipoClienteProveedor = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO TIPO CLIENTE PROVEEDOR';
            this.tipoClienteProveedor = new TipoClienteProveedor();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idTipoClienteProveedor: new FormControl(this.tipoClienteProveedor?.idTipoClienteProveedor),
            nombreTipoClienteProveedor: new FormControl(
                this.tipoClienteProveedor?.nombreTipoClienteProveedor,
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
        const recordId = values.idtipoClienteProveedor;

        if (this.isEdit) {
            this.tipoClienteProveedorService.update(recordId, values).subscribe((data) => {
                this.tipoClienteProveedorService.setTipoClienteProveedorChange(data);
                this.tipoClienteProveedorService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.tipoClienteProveedorService.save(values).subscribe((data) => {
                this.tipoClienteProveedorService.setTipoClienteProveedorChange(data);
                this.tipoClienteProveedorService.setMessageChange({
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
