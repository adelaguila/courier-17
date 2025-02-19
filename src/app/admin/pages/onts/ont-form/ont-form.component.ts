import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Ont } from 'src/app/admin/models/ont';
import { Producto } from 'src/app/admin/models/producto';
import { OntService } from 'src/app/admin/services/ont.service';
import { ProductoService } from 'src/app/admin/services/producto.service';



import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-ont-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './ont-form.component.html',
    styleUrl: './ont-form.component.scss',
})
export class OntFormComponent implements OnInit {
    ont: Ont;
    form: FormGroup;
    title: string = '';
    submitted = false;

    productos: Producto[] | undefined;

    readOnlyID: boolean = false;
    isEdit: boolean = false;
    estado: string = 'DISPONIBLE';
    constructor(
        private ontService: OntService,
        private productoService: ProductoService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR ONT';
            this.ont = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;
            this.estado = this.ont.estado;

        } else {
            this.title = 'NUEVO ONT';
            this.ont = new Ont();
            this.readOnlyID = false;
            this.isEdit = false;
            this.ont.estado = 'DISPONIBLE'
        }
    }
    ngOnInit(): void {

        this.productoService.getProductosControlSerie().subscribe((data) => (this.productos = data));

        this.form = new FormGroup({
            serie: new FormControl(this.ont?.serie),
            producto: new FormControl(this.ont?.producto, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            estado: new FormControl(this.estado, [
                Validators.required,
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
        const recordId = values.idOnt;

        if (this.isEdit) {
            this.ontService.update(recordId, values).subscribe((data) => {
                this.ontService.setOntChange(data);
                this.ontService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.ontService.save(values).subscribe((data) => {
                this.ontService.setOntChange(data);
                this.ontService.setMessageChange({
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
