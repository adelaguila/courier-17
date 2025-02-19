import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CajaIngreso } from 'src/app/admin/models/caja-ingreso';
import { TipoIngreso } from 'src/app/admin/models/tipo-ingreso';
import { User } from 'src/app/admin/models/user';
import { CajaIngresoService } from 'src/app/admin/services/caja-ingreso.service';
import { TipoIngresoService } from 'src/app/admin/services/tipo-ingreso.service';
import { UserService } from 'src/app/admin/services/user.service';

import { PrimengModule } from 'src/app/primeng/primeng.module';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-caja-ingreso-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './caja-ingreso-form.component.html',
    styleUrl: './caja-ingreso-form.component.scss',
})
export class CajaIngresoFormComponent implements OnInit {
    cajaIngreso: CajaIngreso;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    today = new Date();
    fecha: any;
    pipe = new DatePipe('en-US');

    tiposIngresos: TipoIngreso[];

    userRegistro: User;

    constructor(
        private cajaIngresoService: CajaIngresoService,
        private tipoIngresoService: TipoIngresoService,
        private userService: UserService,

        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {
        if (this.config.data) {
            this.title = 'EDITAR INGRESO';
            this.cajaIngreso = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

            this.fecha = this.config.data.fecha;
        } else {
            this.title = 'NUEVO INGRESO';
            this.cajaIngreso = new CajaIngreso();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.fecha = this.pipe.transform(this.today, 'YYYY-MM-dd');

        const helper = new JwtHelperService();
                const decodeToken = helper.decodeToken(
                    localStorage.getItem(environment.TOKEN_NAME)
                );
                this.userService
                    .findOneByUsername(decodeToken.sub)
                    .subscribe((user) => {
                        this.userRegistro = user;
                    });

        this.tipoIngresoService
                    .findAll()
                    .subscribe(
                        (data: TipoIngreso[]) => (this.tiposIngresos = data)
                    );

        this.form = new FormGroup({
            idCajaIngreso: new FormControl(this.cajaIngreso?.idCajaIngreso),
            tipoIngreso: new FormControl(this.cajaIngreso?.tipoIngreso, [Validators.required]),
            fecha: new FormControl(this.fecha, [Validators.required]),
            documento: new FormControl(this.cajaIngreso?.documento, [
                Validators.required,
            ]),
            cliente: new FormControl(this.cajaIngreso?.cliente, [
                Validators.required,
            ]),
            glosa: new FormControl(this.cajaIngreso?.glosa, [
                Validators.required,
            ]),
            // userCobrador: new FormControl("", [Validators.required]),
            importe: new FormControl(this.cajaIngreso.importe, [
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

        const values: CajaIngreso =  { ...this.form.value };
        const recordId = values.idCajaIngreso;
        values.userRegistro = this.userRegistro.idUser;

        if (this.isEdit) {
            this.cajaIngresoService
                .update(recordId, values)
                .subscribe((data) => {
                    this.cajaIngresoService.setCajaIngresoChange(data);
                    this.cajaIngresoService.setMessageChange({
                        key: 'tc',
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Datos actualizados correctamente',
                        life: 3000,
                    });
                });
        } else {

            this.cajaIngresoService.save(values).subscribe((data) => {
                this.cajaIngresoService.setCajaIngresoChange(data);
                this.cajaIngresoService.setMessageChange({
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
