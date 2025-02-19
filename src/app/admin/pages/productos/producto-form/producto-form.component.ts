import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Producto } from 'src/app/admin/models/producto';
import { ProductoService } from 'src/app/admin/services/producto.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

interface UsaONU {
    code: number;
    name: string;
}

interface Estado {
    name: string;
    code: string;
}

@Component({
    selector: 'app-producto-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './producto-form.component.html',
    styleUrl: './producto-form.component.scss',
})
export class ProductoFormComponent implements OnInit {
    producto: Producto;
    form: FormGroup;
    formServicio!: FormGroup;
    title: string = '';
    submitted = false;

    estados: Estado[] | undefined;
    usaOnus: UsaONU[] | undefined;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    activeIndex: number = 0;

    constructor(
        private productoService: ProductoService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.estados = [
            { name: 'ACTIVO', code: 'A' },
            { name: 'DESACTIVADO', code: 'D' },
        ];
        this.usaOnus = [
            { code: 0, name: 'NO' },
            { code: 1, name: 'SI' },
        ];

        if (this.config.data) {
            this.title = 'EDITAR PRODUCTO';
            this.producto = this.config.data;
            this.readOnlyID = false;
            this.isEdit = true;
        } else {
            this.title = 'NUEVO PRODUCTO';
            this.producto = new Producto();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {

        this.form = new FormGroup({
            idProducto: new FormControl(this.producto.idProducto),
            nombreProducto: new FormControl(this.producto.nombreProducto, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            unidadMedida: new FormControl(this.producto.unidadMedida, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(50),
            ]),
            stock: new FormControl(this.producto.stock, [
                Validators.required
            ]),
            controlSerie: new FormControl(this.producto.controlSerie, [
                Validators.required
            ]),
            controlDevolucion: new FormControl(this.producto.controlDevolucion, [
                Validators.required
            ])
        });

    }
    get f() {
        return this.form.controls;
    }

    operate() {
        if (this.form.invalid) {
            this.messageService.add({
                // key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'El formulario es inválido',
                life: 3000,
            });

            return;
        }

        const productoNew: Producto = new Producto();
        productoNew.idProducto = this.form.value["idProducto"];
        productoNew.nombreProducto = this.form.value["nombreProducto"];
        productoNew.unidadMedida = this.form.value["unidadMedida"];
        productoNew.stock = this.form.value["stock"];
        productoNew.controlSerie = this.form.value["controlSerie"];
        productoNew.controlDevolucion = this.form.value["controlDevolucion"];

        if (this.isEdit) {
            this.productoService
                .update(this.producto.idProducto, productoNew)
                .subscribe((data) => {
                    this.productoService.setProductoChange(data);
                    this.productoService.setMessageChange({
                        key: "tc",
                        severity: "success",
                        summary: "Success",
                        detail: "Datos actualizados correctamente",
                        life: 3000,
                    });
                });
        } else {
            this.productoService
                .save(productoNew)
                .subscribe((data) => {
                    this.productoService.setProductoChange(data);
                    this.productoService.setMessageChange({
                        key: "tc",
                        severity: "success",
                        summary: "Success",
                        detail: "Datos creados correctamente",
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
